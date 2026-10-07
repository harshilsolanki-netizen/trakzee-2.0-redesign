import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  X,
  Search,
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  FileCode,
  Shapes,
  Circle as CircleIcon,
  Square,
  Trash2,
  Pipette,
  Edit3,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface GeofenceFormData {
  id?: string;
  company: string;
  name: string;
  category: string;
  access: "Public" | "Private";
  group: string;
  type: "Polygon Zone" | "Circular Zone" | "Rectangle Zone";
  contactNo: string;
  address: string;
  color: string;
  tolerance: number;
  description: string;
  lat?: number;
  lng?: number;
}

interface AddGeofenceModalProps {
  open: boolean;
  onClose: () => void;
  onSaveGeofence: (geofence: GeofenceFormData) => void;
  initialData?: GeofenceFormData | null;
}

// Color conversion utilities for rich interactive color palette popover
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace("#", "").trim();
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("");
  }
  const num = parseInt(c || "0089FF", 16);
  return {
    r: isNaN((num >> 16) & 255) ? 0 : (num >> 16) & 255,
    g: isNaN((num >> 8) & 255) ? 137 : (num >> 8) & 255,
    b: isNaN(num & 255) ? 255 : num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(isNaN(n) ? 0 : n)));
    return clamped.toString(16).padStart(2, "0");
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const f = (n: number, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return {
    r: Math.round(f(5) * 255),
    g: Math.round(f(3) * 255),
    b: Math.round(f(1) * 255),
  };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case rN:
        h = (gN - bN) / d + (gN < bN ? 6 : 0);
        break;
      case gN:
        h = (bN - rN) / d + 2;
        break;
      case bN:
        h = (rN - gN) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s, v };
}

export function AddGeofenceModal({
  open,
  onClose,
  onSaveGeofence,
  initialData,
}: AddGeofenceModalProps) {
  const [activeTab, setActiveTab] = useState<"Custom" | "KML/KMZ" | "Excel/XLS">("Custom");

  // Custom Form States
  const [company, setCompany] = useState("Ha Company");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Area");
  const [access, setAccess] = useState<"Public" | "Private">("Public");
  const [group, setGroup] = useState("Ha Company Geofences");
  const [geofenceType, setGeofenceType] = useState<"Polygon Zone" | "Circular Zone" | "Rectangle Zone">("Polygon Zone");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [color, setColor] = useState("#0089FF");
  const [tolerance, setTolerance] = useState(10);
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState(21.1702);
  const [lng, setLng] = useState(72.8311);
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>([]);
  const [hasPlacedShape, setHasPlacedShape] = useState<boolean>(!!initialData);
  const [isEditingShape, setIsEditingShape] = useState<boolean>(false);
  const [locationSearch, setLocationSearch] = useState("");

  // Color Picker Popover State
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const colorPickerContainerRef = useRef<HTMLDivElement>(null);

  // HSV State for Saturation/Value Spectrum Canvas
  const rgbCurrent = hexToRgb(color);
  const hsvCurrent = rgbToHsv(rgbCurrent.r, rgbCurrent.g, rgbCurrent.b);
  const [hue, setHue] = useState(hsvCurrent.h);
  const [sat, setSat] = useState(hsvCurrent.s);
  const [val, setVal] = useState(hsvCurrent.v);

  // Sync HSV when color hex changes externally
  useEffect(() => {
    const { r, g, b } = hexToRgb(color);
    const { h, s, v } = rgbToHsv(r, g, b);
    setHue(h);
    setSat(s);
    setVal(v);
  }, [color]);

  // Close color popover on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        colorPickerContainerRef.current &&
        !colorPickerContainerRef.current.contains(e.target as Node)
      ) {
        setIsColorPickerOpen(false);
      }
    };
    if (isColorPickerOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isColorPickerOpen]);

  // Upload Tab States
  const [kmlFile, setKmlFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [uploadCompany, setUploadCompany] = useState("Ha Company");
  const [uploadGroup, setUploadGroup] = useState("Ha Company Geofences");
  const [isDragging, setIsDragging] = useState(false);
  const kmlInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  // Map References
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const shapeLayerRef = useRef<L.LayerGroup | null>(null);

  const PRESET_COLORS = [
    "#0089FF",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#64748B",
    "#111827",
    "#3B82F6",
  ];

  // Populate data when editing or opening
  useEffect(() => {
    if (!open) return;
    if (initialData) {
      setCompany(initialData.company || "Ha Company");
      setName(initialData.name || "");
      setCategory(initialData.category || "Area");
      setAccess(initialData.access || "Public");
      setGroup(initialData.group || "Ha Company Geofences");
      setGeofenceType(initialData.type || "Polygon Zone");
      setContactNo(initialData.contactNo || "");
      setAddress(initialData.address || "");
      setColor(initialData.color || "#0089FF");
      setTolerance(initialData.tolerance || 10);
      setDescription(initialData.description || "");
      if (initialData.lat && initialData.lng) {
        setLat(initialData.lat);
        setLng(initialData.lng);
      }
      setPolygonPoints([
        [21.178, 72.825],
        [21.175, 72.840],
        [21.162, 72.835],
        [21.165, 72.820],
      ]);
      setHasPlacedShape(true);
    } else {
      setCompany("Ha Company");
      setName("");
      setCategory("Area");
      setAccess("Public");
      setGroup("Ha Company Geofences");
      setGeofenceType("Polygon Zone");
      setContactNo("");
      setAddress("");
      setColor("#0089FF");
      setTolerance(10);
      setDescription("");
      setLat(21.1702);
      setLng(72.8311);
      setPolygonPoints([]);
      setHasPlacedShape(false);
    }
  }, [initialData, open]);

  // Leaflet Map Initialization & Dynamic Shape Rendering
  useEffect(() => {
    if (!open || (activeTab !== "Custom" && activeTab !== "KML/KMZ")) return;

    let timer: NodeJS.Timeout;

    timer = setTimeout(() => {
      if (!mapElementRef.current) return;

      // Clean up previous map instance
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }

      // Clear _leaflet_id to avoid container already initialized error
      if (mapElementRef.current) {
        delete (mapElementRef.current as any)._leaflet_id;
      }

      try {
        const map = L.map(mapElementRef.current, {
          center: [lat, lng],
          zoom: 13,
          zoomControl: false,
        });

        // Crisp OpenStreetMap tiles without watermark errors
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        const shapeGroup = L.layerGroup().addTo(map);
        shapeLayerRef.current = shapeGroup;
        mapInstanceRef.current = map;

        // Render Shape on Map
        renderShapeOnMap(map, shapeGroup);

        // Map Click handler to place point or shape center
        map.on("click", (e: L.LeafletMouseEvent) => {
          const { lat: clickLat, lng: clickLng } = e.latlng;
          setLat(clickLat);
          setLng(clickLng);
          setHasPlacedShape(true);

          if (geofenceType === "Polygon Zone") {
            setPolygonPoints((prev) => [...prev, [clickLat, clickLng]]);
          }
        });

        // Trigger resize after render
        setTimeout(() => {
          map.invalidateSize();
        }, 150);
      } catch (err) {
        console.error("Map mount error:", err);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, [open, activeTab]);

  // Re-render map shape whenever parameters change
  const renderShapeOnMap = (map: L.Map, shapeGroup: L.LayerGroup) => {
    shapeGroup.clearLayers();

    if (!hasPlacedShape) return;

    // Center marker pin icon
    const customPinIcon = L.divIcon({
      className: "bg-transparent border-0",
      html: `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full">
          <div class="h-8 w-8 rounded-full bg-white shadow-xl border-2 border-[${color}] flex items-center justify-center">
            <div class="h-3.5 w-3.5 rounded-full bg-[${color}]"></div>
          </div>
          <div class="absolute -bottom-1 w-2 h-2 rotate-45 bg-[${color}]"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    L.marker([lat, lng], { icon: customPinIcon }).addTo(shapeGroup);

    if (geofenceType === "Circular Zone") {
      L.circle([lat, lng], {
        radius: Math.max(100, tolerance * 15),
        color: color,
        fillColor: color,
        fillOpacity: 0.25,
        weight: 3,
      }).addTo(shapeGroup);
    } else if (geofenceType === "Rectangle Zone") {
      const latDelta = 0.005 + (tolerance / 100) * 0.005;
      const lngDelta = 0.008 + (tolerance / 100) * 0.008;
      const bounds: L.LatLngBoundsExpression = [
        [lat - latDelta, lng - lngDelta],
        [lat + latDelta, lng + lngDelta],
      ];
      L.rectangle(bounds, {
        color: color,
        fillColor: color,
        fillOpacity: 0.25,
        weight: 3,
      }).addTo(shapeGroup);
    } else {
      // Polygon Zone
      if (polygonPoints.length >= 2) {
        if (polygonPoints.length >= 3) {
          L.polygon(polygonPoints, {
            color: color,
            fillColor: color,
            fillOpacity: 0.25,
            weight: 3,
          }).addTo(shapeGroup);
        } else {
          L.polyline(polygonPoints, {
            color: color,
            weight: 3,
            dashArray: "4 4",
          }).addTo(shapeGroup);
        }

        // Draw vertex handles
        polygonPoints.forEach((pt) => {
          L.circleMarker(pt, {
            radius: 6,
            color: "#FFFFFF",
            fillColor: color,
            fillOpacity: 1,
            weight: 2,
          }).addTo(shapeGroup);
        });
      }
    }
  };

  useEffect(() => {
    if (mapInstanceRef.current && shapeLayerRef.current) {
      renderShapeOnMap(mapInstanceRef.current, shapeLayerRef.current);
    }
  }, [lat, lng, color, tolerance, geofenceType, polygonPoints, hasPlacedShape]);

  if (!open) return null;

  // Spectrum Canvas Mouse Drag Handler
  const handleSpectrumClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    const newSat = x / rect.width;
    const newVal = 1 - y / rect.height;
    setSat(newSat);
    setVal(newVal);
    const { r, g, b } = hsvToRgb(hue, newSat, newVal);
    setColor(rgbToHex(r, g, b));
  };

  const handleHueSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number(e.target.value);
    setHue(newHue);
    const { r, g, b } = hsvToRgb(newHue, sat, val);
    setColor(rgbToHex(r, g, b));
  };

  const handleRgbInputChange = (channel: "r" | "g" | "b", valueStr: string) => {
    const valNum = parseInt(valueStr || "0", 10);
    const currentRgb = hexToRgb(color);
    const newRgb = {
      ...currentRgb,
      [channel]: isNaN(valNum) ? 0 : Math.max(0, Math.min(255, valNum)),
    };
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleEyedropper = async () => {
    if ("EyeDropper" in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          setColor(result.sRGBHex);
          toast.success(`Color picked: ${result.sRGBHex}`);
        }
      } catch (e) {
        // User canceled eyedropper
      }
    } else {
      toast.info("Native Eyedropper tool not supported in this browser.");
    }
  };

  // Search location lookup handler (Exact match with Add Address Screen)
  const handleLocationSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!locationSearch.trim()) return;

    // Check if input is Lat, Lng
    const parts = locationSearch.split(",").map((s) => s.trim());
    if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
      const newLat = parseFloat(Number(parts[0]).toFixed(6));
      const newLng = parseFloat(Number(parts[1]).toFixed(6));
      setLat(newLat);
      setLng(newLng);
      setHasPlacedShape(true);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([newLat, newLng], 14, { animate: true });
      }
      toast.success(`Position set to Lat ${newLat}, Lng ${newLng}`);
      return;
    }

    const searchLower = locationSearch.toLowerCase().trim();
    const presets: Record<string, [number, number]> = {
      almaty: [43.2389, 76.8897],
      mumbai: [19.076, 72.8777],
      surat: [21.1702, 72.8311],
      valsad: [20.5937, 72.9342],
      delhi: [28.6139, 77.2090],
      ahmedabad: [23.0225, 72.5714],
      bangalore: [12.9716, 77.5946],
      london: [51.5074, -0.1278],
    };

    const foundKey = Object.keys(presets).find((k) => searchLower.includes(k));
    if (foundKey) {
      const [nLat, nLng] = presets[foundKey];
      setLat(nLat);
      setLng(nLng);
      setHasPlacedShape(true);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([nLat, nLng], 14, { animate: true });
      }
      toast.success(`Located "${locationSearch}" on map`);
    } else {
      toast.info(`Centered map to location search "${locationSearch}"`);
    }
  };

  const handleResetPoints = () => {
    setPolygonPoints([]);
    setHasPlacedShape(false);
    toast.info("Map points cleared. Click on the map to start drawing again.");
  };

  const handleDeleteGeofence = () => {
    if (initialData?.name) {
      toast.error(`Geofence "${initialData.name}" deleted`);
    } else {
      setPolygonPoints([]);
      setHasPlacedShape(false);
      toast.info("Drawn shape cleared.");
    }
    onClose();
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Geofence Name is required");
      return;
    }

    onSaveGeofence({
      id: initialData?.id || `g-${Date.now()}`,
      company,
      name: name.trim(),
      category,
      access,
      group,
      type: geofenceType,
      contactNo,
      address: address || "Custom Drawn Geofence",
      color,
      tolerance,
      description,
      lat,
      lng,
    });

    toast.success(`Geofence "${name}" saved successfully!`);
    onClose();
  };

  const handleKmlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kmlFile) {
      toast.error("Please select a KML/KMZ file to upload.");
      return;
    }
    const geofenceName = kmlFile.name.replace(/\.[^/.]+$/, "");
    onSaveGeofence({
      id: initialData?.id || `g-${Date.now()}`,
      company,
      name: geofenceName || "KML Geofence",
      category: "Area",
      access,
      group,
      type: geofenceType,
      contactNo,
      address: "Uploaded KML/KMZ Boundary",
      color,
      tolerance: 10,
      description: `Imported from ${kmlFile.name}`,
      lat,
      lng,
    });
    toast.success(`KML Geofence "${geofenceName}" uploaded & saved successfully!`);
    onClose();
  };

  const handleExcelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excelFile) {
      toast.error("Please select an Excel/XLS file to upload.");
      return;
    }
    toast.success(`Uploaded ${excelFile.name} to ${uploadGroup}!`);
    onClose();
  };

  const handleDownloadSampleExcel = () => {
    const sampleCsv = `Geofence Name,Company,Group,Category,Access,Type,Tolerance,Description\n"Surat Logistics Zone","Ha Company","Ha Company Geofences","Area","Public","Polygon Zone",10,"Primary Hub Boundary"\n"Valsad Plant Area","Ha Company","Plant Operations","Warehouse / Plant","Private","Circular Zone",50,"Factory Perimeter"`;
    const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "geofence_import_template.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Sample Excel template downloaded!");
  };

  // Pure hue background color for gradient canvas
  const hueBgColor = `hsl(${hue}, 100%, 50%)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-7xl lg:max-w-[1380px] h-[88vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* 1. Modal Header Bar (Exact Height 56px) */}
        <div className="flex h-[56px] items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {initialData ? "Edit Geofence" : "Add Geofence"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5 stroke-[2]" />
          </button>
        </div>

        {/* 2. Sub-header Tabs Bar (Exact Height 44px with Background #FAFBFC) */}
        <div className="flex h-[44px] items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-[#FAFBFC] dark:bg-slate-950/80 shrink-0 gap-6">
          {[
            { id: "Custom", label: "Custom" },
            { id: "KML/KMZ", label: "KML / KMZ" },
            { id: "Excel/XLS", label: "Excel / XLS" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "h-full flex items-center text-xs font-bold transition-all cursor-pointer border-b-2 relative -mb-px",
                  isActive
                    ? "border-[#0089FF] text-[#0089FF]"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-semibold",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Custom Geofence Drawing & Parameters */}
        {activeTab === "Custom" && (
          <div className="flex flex-1 overflow-hidden relative">
            {/* Left Form Sidebar Panel (380px compact) */}
            <div className="w-full md:w-[360px] lg:w-[380px] shrink-0 bg-slate-50/70 dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden">
              <form
                id="add-geofence-form-element"
                onSubmit={handleSubmitCustom}
                className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
              >
                {/* Company Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Company <span className="text-rose-500">*</span>
                  </label>
                  <Select value={company} onValueChange={setCompany}>
                    <SelectTrigger className="w-full h-9 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0089FF] font-medium">
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ha Company">Ha Company</SelectItem>
                      <SelectItem value="HP Company">HP Company</SelectItem>
                      <SelectItem value="Surya Travels">Surya Travels</SelectItem>
                      <SelectItem value="Agrawal Industries">Agrawal Industries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Geofence Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Geofence Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter geofence title (e.g. Surat Terminal)"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF]"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full h-9 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0089FF] font-medium">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Area">Area</SelectItem>
                      <SelectItem value="Warehouse / Plant">Warehouse / Plant</SelectItem>
                      <SelectItem value="Security Area">Security Area</SelectItem>
                      <SelectItem value="Emergency Response">Emergency Response</SelectItem>
                      <SelectItem value="Hazard Zone">Hazard Zone</SelectItem>
                      <SelectItem value="Tech Hub">Tech Hub</SelectItem>
                      <SelectItem value="Financial / Bank">Financial / Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Geofence Access Radio Pill Cards (Exact match with Schedule Report reference image media_1791347548708.png) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Geofence Access <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Public Option Pill Card */}
                    <div
                      onClick={() => setAccess("Public")}
                      className={cn(
                        "h-10 px-3.5 rounded-xl border flex items-center gap-2.5 cursor-pointer select-none transition-all duration-150",
                        access === "Public"
                          ? "bg-[#0089FF]/10 dark:bg-sky-950/50 border-[#0089FF] text-[#0089FF] font-bold shadow-xs"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 font-medium",
                      )}
                    >
                      <div
                        className={cn(
                          "h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                          access === "Public"
                            ? "border-[#0089FF] bg-white dark:bg-slate-900"
                            : "border-slate-300 dark:border-slate-600 bg-transparent",
                        )}
                      >
                        {access === "Public" && (
                          <div className="h-2 w-2 rounded-full bg-[#0089FF]" />
                        )}
                      </div>
                      <span className="text-xs">Public</span>
                    </div>

                    {/* Private Option Pill Card */}
                    <div
                      onClick={() => setAccess("Private")}
                      className={cn(
                        "h-10 px-3.5 rounded-xl border flex items-center gap-2.5 cursor-pointer select-none transition-all duration-150",
                        access === "Private"
                          ? "bg-[#0089FF]/10 dark:bg-sky-950/50 border-[#0089FF] text-[#0089FF] font-bold shadow-xs"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 font-medium",
                      )}
                    >
                      <div
                        className={cn(
                          "h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                          access === "Private"
                            ? "border-[#0089FF] bg-white dark:bg-slate-900"
                            : "border-slate-300 dark:border-slate-600 bg-transparent",
                        )}
                      >
                        {access === "Private" && (
                          <div className="h-2 w-2 rounded-full bg-[#0089FF]" />
                        )}
                      </div>
                      <span className="text-xs">Private</span>
                    </div>
                  </div>
                </div>

                {/* Geofence Group & Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Geofence Group
                    </label>
                    <Select value={group} onValueChange={setGroup}>
                      <SelectTrigger className="w-full h-9 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0089FF] font-medium">
                        <SelectValue placeholder="Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ha Company Geofences">Ha Company Geofences</SelectItem>
                        <SelectItem value="Plant Operations">Plant Operations</SelectItem>
                        <SelectItem value="Logistics Sectors">Logistics Sectors</SelectItem>
                        <SelectItem value="Regional Branches">Regional Branches</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Geofence Type
                    </label>
                    <Select
                      value={geofenceType}
                      onValueChange={(v: any) => setGeofenceType(v)}
                    >
                      <SelectTrigger className="w-full h-9 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0089FF] font-medium">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Polygon Zone">Polygon</SelectItem>
                        <SelectItem value="Circular Zone">Circle</SelectItem>
                        <SelectItem value="Rectangle Zone">Rectangle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Contact No */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Contact No
                  </label>
                  <input
                    type="text"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF]"
                  />
                </div>

                {/* Color Picker (1:1 Match with Reference Image media_1791348378258.png: Custom Spectrum Palette Popover) */}
                <div className="space-y-1.5 relative" ref={colorPickerContainerRef}>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Color Picker:
                  </label>

                  {/* Trigger Box: Color Swatch + Hex Input */}
                  <div className="flex items-center gap-2">
                    <div
                      onClick={() => setIsColorPickerOpen((prev) => !prev)}
                      className="h-9 w-9 rounded-lg border border-slate-300 dark:border-slate-700 shadow-xs cursor-pointer overflow-hidden shrink-0 flex items-center justify-center p-0.5 bg-white dark:bg-slate-900 hover:border-[#0089FF] transition-colors"
                      title="Click to open Color Palette"
                    >
                      <div
                        className="w-full h-full rounded-md shadow-inner"
                        style={{ backgroundColor: color }}
                      />
                    </div>

                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      onClick={() => setIsColorPickerOpen(true)}
                      placeholder="#3388ff"
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold uppercase focus:outline-none focus:border-[#0089FF]"
                    />
                  </div>

                  {/* Color Palette Popover Container (1:1 with media_1791348378258.png) */}
                  {isColorPickerOpen && (
                    <div className="absolute top-full left-0 z-50 mt-1 w-full max-w-[280px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 flex flex-col space-y-3 animate-in fade-in duration-150">
                      {/* Saturation/Value Gradient Canvas */}
                      <div
                        onClick={handleSpectrumClick}
                        className="w-full h-32 rounded-xl relative cursor-crosshair overflow-hidden shadow-inner select-none"
                        style={{
                          backgroundColor: hueBgColor,
                          backgroundImage:
                            "linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)",
                        }}
                      >
                        {/* Selector handle marker */}
                        <div
                          className="absolute h-4 w-4 rounded-full border-2 border-white shadow-md pointer-events-none -translate-x-1/2 -translate-y-full"
                          style={{
                            left: `${sat * 100}%`,
                            top: `${(1 - val) * 100}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>

                      {/* Eyedropper Tool + Color Preview Circle + Rainbow Hue Slider Bar */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleEyedropper}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shrink-0"
                          title="Eyedropper tool"
                        >
                          <Pipette className="h-4 w-4" />
                        </button>

                        <div
                          className="h-7 w-7 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 shadow-xs"
                          style={{ backgroundColor: color }}
                        />

                        {/* Rainbow Hue Slider */}
                        <input
                          type="range"
                          min={0}
                          max={360}
                          value={hue}
                          onChange={handleHueSliderChange}
                          className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-white"
                          style={{
                            background:
                              "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
                          }}
                        />
                      </div>

                      {/* RGB Number Input Fields matching reference screenshot media_1791348378258.png */}
                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col items-center">
                          <input
                            type="number"
                            min={0}
                            max={255}
                            value={rgbCurrent.r}
                            onChange={(e) => handleRgbInputChange("r", e.target.value)}
                            className="w-full h-8 px-1 text-center text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          />
                          <span className="text-[10px] font-bold text-slate-400 mt-0.5">R</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <input
                            type="number"
                            min={0}
                            max={255}
                            value={rgbCurrent.g}
                            onChange={(e) => handleRgbInputChange("g", e.target.value)}
                            className="w-full h-8 px-1 text-center text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          />
                          <span className="text-[10px] font-bold text-slate-400 mt-0.5">G</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <input
                            type="number"
                            min={0}
                            max={255}
                            value={rgbCurrent.b}
                            onChange={(e) => handleRgbInputChange("b", e.target.value)}
                            className="w-full h-8 px-1 text-center text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          />
                          <span className="text-[10px] font-bold text-slate-400 mt-0.5">B</span>
                        </div>
                      </div>

                      {/* Preset Swatches Gallery */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100 dark:border-slate-800">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            style={{ backgroundColor: c }}
                            className={cn(
                              "h-5 w-5 rounded-full transition-transform cursor-pointer shrink-0 active:scale-90 shadow-2xs border border-white/40",
                              color.toLowerCase() === c.toLowerCase()
                                ? "ring-2 ring-offset-1 ring-[#0089FF] scale-110"
                                : "opacity-85 hover:opacity-100",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tolerance Radius Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Tolerance (metres)
                    </label>
                    <span className="text-xs font-extrabold text-[#0089FF] font-mono">
                      {tolerance} m
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={1000}
                    step={5}
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="w-full accent-[#0089FF] cursor-pointer"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Address
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Location address or landmark info"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] resize-none"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description or security notes..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] resize-none"
                  />
                </div>
              </form>

              {/* Pinned Bottom Footer Buttons */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl transition-all cursor-pointer active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    const form = document.querySelector("#add-geofence-form-element") as HTMLFormElement;
                    if (form) {
                      form.requestSubmit();
                    } else {
                      handleSubmitCustom(e);
                    }
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-xl shadow-md shadow-[#0089FF]/25 transition-all cursor-pointer active:scale-95"
                >
                  {initialData ? "Update Geofence" : "Save Geofence"}
                </button>
              </div>
            </div>

            {/* Right Interactive GIS Map View (Fills remaining area) */}
            <div className="flex-1 relative h-full bg-slate-100 dark:bg-slate-950 flex flex-col">
              {/* Top Location Search Bar Overlay (Spans top of map canvas) */}
              <div className="absolute top-3 left-3 right-3 z-10">
                <form
                  onSubmit={handleLocationSearchSubmit}
                  className="relative flex items-center bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg backdrop-blur-md overflow-hidden"
                >
                  <Search className="h-4 w-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="Search Location OR Lat,Lng..."
                    className="w-full h-10 pl-10 pr-20 text-xs bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none font-medium"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Icon-Only Vertical Drawing & Action Stack Toolbar positioned on the RIGHT side below Search Bar (Top-16 Right-3) */}
              <div className="absolute top-16 right-3 z-20 flex flex-col items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1 select-none">
                {/* Polygon Icon Tool */}
                <button
                  type="button"
                  onClick={() => {
                    setGeofenceType("Polygon Zone");
                    setIsEditingShape(false);
                  }}
                  className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center transition-all cursor-pointer",
                    geofenceType === "Polygon Zone" && !isEditingShape
                      ? "bg-[#0089FF] text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                  )}
                  title="Polygon Geofence Tool"
                >
                  <Shapes className="h-4 w-4" />
                </button>

                {/* Circle Icon Tool */}
                <button
                  type="button"
                  onClick={() => {
                    setGeofenceType("Circular Zone");
                    setIsEditingShape(false);
                  }}
                  className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center transition-all cursor-pointer",
                    geofenceType === "Circular Zone" && !isEditingShape
                      ? "bg-[#0089FF] text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                  )}
                  title="Circle Geofence Tool"
                >
                  <CircleIcon className="h-4 w-4" />
                </button>

                {/* Rectangle Icon Tool */}
                <button
                  type="button"
                  onClick={() => {
                    setGeofenceType("Rectangle Zone");
                    setIsEditingShape(false);
                  }}
                  className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center transition-all cursor-pointer",
                    geofenceType === "Rectangle Zone" && !isEditingShape
                      ? "bg-[#0089FF] text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                  )}
                  title="Rectangle Geofence Tool"
                >
                  <Square className="h-4 w-4" />
                </button>

                <div className="w-5 h-px bg-slate-200 dark:bg-slate-800 my-0.5" />

                {/* Edit Icon Tool (Disabled during creation of new geofence, active when editing existing geofence) */}
                <button
                  type="button"
                  disabled={!initialData}
                  onClick={() => {
                    if (!initialData) return;
                    if (!hasPlacedShape) {
                      toast.info("Place a geofence shape on the map first to edit.");
                      return;
                    }
                    setIsEditingShape((prev) => !prev);
                    toast.success(
                      isEditingShape
                        ? "Edit mode disabled"
                        : "Edit mode enabled: click map to adjust points",
                    );
                  }}
                  className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center transition-all",
                    !initialData
                      ? "opacity-30 text-slate-400 dark:text-slate-600 cursor-not-allowed pointer-events-none"
                      : isEditingShape
                      ? "bg-amber-500 text-white shadow-xs cursor-pointer"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
                  )}
                  title={
                    !initialData
                      ? "Edit option is disabled when adding a new geofence"
                      : "Edit Geofence Shape"
                  }
                >
                  <Edit3 className="h-4 w-4" />
                </button>

                {/* Delete Icon Tool (Disabled during creation of new geofence, active when editing existing geofence) */}
                <button
                  type="button"
                  disabled={!initialData}
                  onClick={() => {
                    if (!initialData) return;
                    handleDeleteGeofence();
                  }}
                  className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center transition-colors",
                    !initialData
                      ? "opacity-30 text-slate-400 dark:text-slate-600 cursor-not-allowed pointer-events-none"
                      : "text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer",
                  )}
                  title={
                    !initialData
                      ? "Delete option is disabled when adding a new geofence"
                      : "Delete Geofence"
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="w-5 h-px bg-slate-200 dark:bg-slate-800 my-0.5" />

                {/* Zoom In Button */}
                <button
                  type="button"
                  onClick={() => mapInstanceRef.current?.zoomIn()}
                  className="h-8 w-8 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                </button>

                {/* Zoom Out Button */}
                <button
                  type="button"
                  onClick={() => mapInstanceRef.current?.zoomOut()}
                  className="h-8 w-8 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <Minus className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Floating Helper Banner when creating a new geofence prior to map click */}
              {!hasPlacedShape && (
                <div className="absolute bottom-4 left-4 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-lg flex items-center gap-2.5 max-w-sm animate-in fade-in">
                  <div className="h-8 w-8 rounded-xl bg-[#0089FF]/10 text-[#0089FF] flex items-center justify-center shrink-0">
                    <Shapes className="h-4 w-4" />
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold block text-slate-900 dark:text-white">Start Drawing Geofence</span>
                    {geofenceType === "Polygon Zone" && "Click anywhere on map to add polygon boundary points."}
                    {geofenceType === "Circular Zone" && "Click on map to place circular zone center."}
                    {geofenceType === "Rectangle Zone" && "Click on map to place rectangular zone."}
                  </div>
                </div>
              )}

              {/* Map Canvas */}
              <div ref={mapElementRef} className="h-full w-full z-0 cursor-crosshair" />
            </div>
          </div>
        )}

        {/* Tab 2: KML / KMZ Upload & Map View (Matching reference image media_1791349338801.png) */}
        {activeTab === "KML/KMZ" && (
          <div className="flex flex-1 overflow-hidden relative">
            {/* Left Form Sidebar Panel (380px compact matching Custom tab format) */}
            <div className="w-full md:w-[360px] lg:w-[380px] shrink-0 bg-slate-50/70 dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden">
              <form
                id="kml-geofence-form-element"
                onSubmit={handleKmlSubmit}
                className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
              >
                {/* 1. Company Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Company <span className="text-rose-500">*</span>
                  </label>
                  <Select value={company} onValueChange={setCompany}>
                    <SelectTrigger className="w-full h-9 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0089FF] font-medium">
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ha Company">Ha Company</SelectItem>
                      <SelectItem value="HP Company">HP Company</SelectItem>
                      <SelectItem value="Surya Travels">Surya Travels</SelectItem>
                      <SelectItem value="Agrawal Industries">Agrawal Industries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Geofence Access Radio Pill Cards (Public / Private) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Geofence Access <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Public Option */}
                    <div
                      onClick={() => setAccess("Public")}
                      className={cn(
                        "h-10 px-3.5 rounded-xl border flex items-center gap-2.5 cursor-pointer select-none transition-all duration-150",
                        access === "Public"
                          ? "bg-[#0089FF]/10 dark:bg-sky-950/50 border-[#0089FF] text-[#0089FF] font-bold shadow-xs"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 font-medium",
                      )}
                    >
                      <div
                        className={cn(
                          "h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                          access === "Public"
                            ? "border-[#0089FF] bg-white dark:bg-slate-900"
                            : "border-slate-300 dark:border-slate-600 bg-transparent",
                        )}
                      >
                        {access === "Public" && (
                          <div className="h-2 w-2 rounded-full bg-[#0089FF]" />
                        )}
                      </div>
                      <span className="text-xs">Public</span>
                    </div>

                    {/* Private Option */}
                    <div
                      onClick={() => setAccess("Private")}
                      className={cn(
                        "h-10 px-3.5 rounded-xl border flex items-center gap-2.5 cursor-pointer select-none transition-all duration-150",
                        access === "Private"
                          ? "bg-[#0089FF]/10 dark:bg-sky-950/50 border-[#0089FF] text-[#0089FF] font-bold shadow-xs"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 font-medium",
                      )}
                    >
                      <div
                        className={cn(
                          "h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                          access === "Private"
                            ? "border-[#0089FF] bg-white dark:bg-slate-900"
                            : "border-slate-300 dark:border-slate-600 bg-transparent",
                        )}
                      >
                        {access === "Private" && (
                          <div className="h-2 w-2 rounded-full bg-[#0089FF]" />
                        )}
                      </div>
                      <span className="text-xs">Private</span>
                    </div>
                  </div>
                </div>

                {/* 3. Geofence Group */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Geofence Group
                  </label>
                  <Select value={group} onValueChange={setGroup}>
                    <SelectTrigger className="w-full h-9 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0089FF] font-medium">
                      <SelectValue placeholder="Select Some Options" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ha Company Geofences">Ha Company Geofences</SelectItem>
                      <SelectItem value="Plant Operations">Plant Operations</SelectItem>
                      <SelectItem value="Logistics Sectors">Logistics Sectors</SelectItem>
                      <SelectItem value="Regional Branches">Regional Branches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. Geofence Type */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Geofence Type
                  </label>
                  <Select
                    value={geofenceType}
                    onValueChange={(v: any) => setGeofenceType(v)}
                  >
                    <SelectTrigger className="w-full h-9 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0089FF] font-medium">
                      <SelectValue placeholder="-- select --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Polygon Zone">Polygon</SelectItem>
                      <SelectItem value="Circular Zone">Circle</SelectItem>
                      <SelectItem value="Rectangle Zone">Rectangle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 5. Color Picker (Rich Palette Popover) */}
                <div className="space-y-1.5 relative" ref={colorPickerContainerRef}>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Color Picker:
                  </label>

                  <div className="flex items-center gap-2">
                    <div
                      onClick={() => setIsColorPickerOpen((prev) => !prev)}
                      className="h-9 w-9 rounded-lg border border-slate-300 dark:border-slate-700 shadow-xs cursor-pointer overflow-hidden shrink-0 flex items-center justify-center p-0.5 bg-white dark:bg-slate-900 hover:border-[#0089FF] transition-colors"
                      title="Click to open Color Palette"
                    >
                      <div
                        className="w-full h-full rounded-md shadow-inner"
                        style={{ backgroundColor: color }}
                      />
                    </div>

                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      onClick={() => setIsColorPickerOpen(true)}
                      placeholder="#3388ff"
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold uppercase focus:outline-none focus:border-[#0089FF]"
                    />
                  </div>

                  {isColorPickerOpen && (
                    <div className="absolute top-full left-0 z-50 mt-1 w-full max-w-[280px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 flex flex-col space-y-3 animate-in fade-in duration-150">
                      <div
                        onClick={handleSpectrumClick}
                        className="w-full h-32 rounded-xl relative cursor-crosshair overflow-hidden shadow-inner select-none"
                        style={{
                          backgroundColor: hueBgColor,
                          backgroundImage:
                            "linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)",
                        }}
                      >
                        <div
                          className="absolute h-4 w-4 rounded-full border-2 border-white shadow-md pointer-events-none -translate-x-1/2 -translate-y-full"
                          style={{
                            left: `${sat * 100}%`,
                            top: `${(1 - val) * 100}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleEyedropper}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shrink-0"
                          title="Eyedropper tool"
                        >
                          <Pipette className="h-4 w-4" />
                        </button>

                        <div
                          className="h-7 w-7 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 shadow-xs"
                          style={{ backgroundColor: color }}
                        />

                        <input
                          type="range"
                          min={0}
                          max={360}
                          value={hue}
                          onChange={handleHueSliderChange}
                          className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-white"
                          style={{
                            background:
                              "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col items-center">
                          <input
                            type="number"
                            min={0}
                            max={255}
                            value={rgbCurrent.r}
                            onChange={(e) => handleRgbInputChange("r", e.target.value)}
                            className="w-full h-8 px-1 text-center text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          />
                          <span className="text-[10px] font-bold text-slate-400 mt-0.5">R</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <input
                            type="number"
                            min={0}
                            max={255}
                            value={rgbCurrent.g}
                            onChange={(e) => handleRgbInputChange("g", e.target.value)}
                            className="w-full h-8 px-1 text-center text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          />
                          <span className="text-[10px] font-bold text-slate-400 mt-0.5">G</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <input
                            type="number"
                            min={0}
                            max={255}
                            value={rgbCurrent.b}
                            onChange={(e) => handleRgbInputChange("b", e.target.value)}
                            className="w-full h-8 px-1 text-center text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          />
                          <span className="text-[10px] font-bold text-slate-400 mt-0.5">B</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100 dark:border-slate-800">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            style={{ backgroundColor: c }}
                            className={cn(
                              "h-5 w-5 rounded-full transition-transform cursor-pointer shrink-0 active:scale-90 shadow-2xs border border-white/40",
                              color.toLowerCase() === c.toLowerCase()
                                ? "ring-2 ring-offset-1 ring-[#0089FF] scale-110"
                                : "opacity-85 hover:opacity-100",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Upload File */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Upload File <span className="text-rose-500">*</span>
                  </label>
                  <div
                    onClick={() => kmlInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files?.[0]) setKmlFile(e.dataTransfer.files[0]);
                    }}
                    className={cn(
                      "border border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 bg-white dark:bg-slate-900",
                      isDragging
                        ? "border-[#0089FF] bg-[#0089FF]/5"
                        : kmlFile
                        ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-[#0089FF]",
                    )}
                  >
                    <input
                      ref={kmlInputRef}
                      type="file"
                      accept=".kml,.kmz"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && setKmlFile(e.target.files[0])}
                    />
                    <div className="flex items-center gap-2.5 w-full">
                      <div className="h-8 w-8 rounded-lg bg-[#0089FF]/10 text-[#0089FF] flex items-center justify-center shrink-0">
                        <Upload className="h-4 w-4" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        {kmlFile ? (
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {kmlFile.name}
                            </p>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                              {(kmlFile.size / 1024).toFixed(1)} KB &bull; Ready to import
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                              Choose File <span className="text-slate-400 font-normal text-[11px]">(No file chosen)</span>
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Click to browse or drop .kml / .kmz
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              {/* Pinned Bottom Footer Buttons */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl transition-all cursor-pointer active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    const form = document.querySelector("#kml-geofence-form-element") as HTMLFormElement;
                    if (form) {
                      form.requestSubmit();
                    } else {
                      handleKmlSubmit(e);
                    }
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-xl shadow-md shadow-[#0089FF]/25 transition-all cursor-pointer active:scale-95"
                >
                  Save Geofence
                </button>
              </div>
            </div>

            {/* Right Interactive GIS Map View (Fills remaining area) */}
            <div className="flex-1 relative h-full bg-slate-100 dark:bg-slate-950 flex flex-col">
              {/* Top Location Search Bar Overlay */}
              <div className="absolute top-3 left-3 right-3 z-10">
                <form
                  onSubmit={handleLocationSearchSubmit}
                  className="relative flex items-center bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg backdrop-blur-md overflow-hidden"
                >
                  <Search className="h-4 w-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="Search Location OR Lat,Lng..."
                    className="w-full h-10 pl-10 pr-20 text-xs bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none font-medium"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Zoom Only Controller Toolbar on top-right for KML/KMZ */}
              <div className="absolute top-16 right-3 z-20 flex flex-col items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1 select-none">
                <button
                  type="button"
                  onClick={() => mapInstanceRef.current?.zoomIn()}
                  className="h-8 w-8 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={() => mapInstanceRef.current?.zoomOut()}
                  className="h-8 w-8 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <Minus className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Map Canvas */}
              <div ref={mapElementRef} className="h-full w-full z-0 cursor-crosshair" />
            </div>
          </div>
        )}

        {/* Tab 3: Excel / XLS Upload */}
        {activeTab === "Excel/XLS" && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center">
            <form onSubmit={handleExcelSubmit} className="w-full max-w-lg space-y-5">
              <div className="flex items-center justify-between bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 rounded-2xl p-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#0089FF]/15 text-[#0089FF] flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Excel Import Template</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Download formatted template for geofences</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSampleExcel}
                  className="h-8 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0089FF] text-xs font-bold hover:bg-sky-50 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Template</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                    Company <span className="text-rose-500">*</span>
                  </label>
                  <Select value={uploadCompany} onValueChange={setUploadCompany}>
                    <SelectTrigger className="h-10 text-xs rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-semibold">
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ha Company">Ha Company</SelectItem>
                      <SelectItem value="HP Company">HP Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                    Geofence Group <span className="text-rose-500">*</span>
                  </label>
                  <Select value={uploadGroup} onValueChange={setUploadGroup}>
                    <SelectTrigger className="h-10 text-xs rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-semibold">
                      <SelectValue placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ha Company Geofences">Ha Company Geofences</SelectItem>
                      <SelectItem value="Plant Operations">Plant Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Drag & Drop File Zone */}
              <div
                onClick={() => excelInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) setExcelFile(e.dataTransfer.files[0]);
                }}
                className={cn(
                  "border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200",
                  isDragging
                    ? "border-[#0089FF] bg-[#0089FF]/5 scale-[1.01]"
                    : excelFile
                      ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20"
                      : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-[#0089FF]",
                )}
              >
                <input
                  ref={excelInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && setExcelFile(e.target.files[0])}
                />
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
                  <FileSpreadsheet className="h-7 w-7" />
                </div>
                {excelFile ? (
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{excelFile.name}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                      Ready to batch import geofences ({(excelFile.size / 1024).toFixed(1)} KB)
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Click to browse or drag & drop Excel / XLS file
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Supports .xlsx, .xls, and .csv files
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!excelFile}
                  className="h-10 px-6 rounded-xl bg-[#0089FF] hover:bg-[#0070d6] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#0089FF]/20 transition-all"
                >
                  Upload Excel Geofences
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
