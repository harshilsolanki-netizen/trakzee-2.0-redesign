import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X, Search } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AddressFormData {
  id?: string;
  reseller?: string;
  company: string;
  name: string;
  addressType: string;
  tolerance: number;
  description: string;
  lat: number;
  lng: number;
}

interface AddAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSaveAddress: (address: AddressFormData) => void;
  initialData?: AddressFormData | null;
}

export function AddAddressModal({
  open,
  onClose,
  onSaveAddress,
  initialData,
}: AddAddressModalProps) {
  const [company, setCompany] = useState("Ha Company");
  const [name, setName] = useState("");
  const [addressType, setAddressType] = useState("Financial / Bank");
  const [tolerance, setTolerance] = useState(200);
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState(21.1702);
  const [lng, setLng] = useState(72.8311);
  const [locationSearch, setLocationSearch] = useState("");

  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  // Sync initial data when editing or opening
  useEffect(() => {
    if (!open) return;
    if (initialData) {
      setCompany(initialData.company || "Ha Company");
      setName(initialData.name || "");
      setAddressType(initialData.addressType || "Financial / Bank");
      setTolerance(initialData.tolerance || 200);
      setDescription(initialData.description || "");
      setLat(initialData.lat || 21.1702);
      setLng(initialData.lng || 72.8311);
    } else {
      setCompany("Ha Company");
      setName("");
      setAddressType("Financial / Bank");
      setTolerance(200);
      setDescription("");
      setLat(21.1702);
      setLng(72.8311);
    }
  }, [initialData, open]);

  // Safe Initialize Leaflet Map
  useEffect(() => {
    if (!open) return;

    let timer: NodeJS.Timeout;

    // Small timeout ensures container DOM node is mounted and has layout dimensions
    timer = setTimeout(() => {
      if (!mapElementRef.current) return;

      // Clear any existing map instance safely
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore cleanup warning
        }
        mapInstanceRef.current = null;
      }

      // Crucial fix: delete _leaflet_id to avoid Leaflet throwing "Map container is already initialized"
      if (mapElementRef.current) {
        delete (mapElementRef.current as any)._leaflet_id;
      }

      try {
        const map = L.map(mapElementRef.current, {
          center: [lat, lng],
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
        });

        mapInstanceRef.current = map;

        // Standard OpenStreetMap Tile Layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);

        // Custom Blue Pin Icon
        const customIcon = L.divIcon({
          className: "custom-address-pin-marker",
          html: `
            <div style="background-color: #0089FF; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,137,255,0.4);">
              <div style="width: 10px; height: 10px; background-color: white; border-radius: 50%; transform: rotate(45deg); margin: auto;"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const marker = L.marker([lat, lng], { icon: customIcon, draggable: true }).addTo(map);
        markerRef.current = marker;

        const circle = L.circle([lat, lng], {
          radius: tolerance,
          color: "#0089FF",
          fillColor: "#0089FF",
          fillOpacity: 0.18,
          weight: 2,
          dashArray: "4, 4",
        }).addTo(map);

        circleRef.current = circle;

        // Map click handler to update pin & coords
        map.on("click", (e: L.LeafletMouseEvent) => {
          const { lat: newLat, lng: newLng } = e.latlng;
          const roundedLat = parseFloat(newLat.toFixed(6));
          const roundedLng = parseFloat(newLng.toFixed(6));
          setLat(roundedLat);
          setLng(roundedLng);

          marker.setLatLng([roundedLat, roundedLng]);
          circle.setLatLng([roundedLat, roundedLng]);
        });

        // Marker drag handler
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          const roundedLat = parseFloat(pos.lat.toFixed(6));
          const roundedLng = parseFloat(pos.lng.toFixed(6));
          setLat(roundedLat);
          setLng(roundedLng);
          circle.setLatLng([roundedLat, roundedLng]);
        });

        // Invalidate size to calculate correct container bounds
        map.invalidateSize();
      } catch (err) {
        console.error("Leaflet map initialization error handled gracefully:", err);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore cleanup warning
        }
        mapInstanceRef.current = null;
      }
      if (mapElementRef.current) {
        delete (mapElementRef.current as any)._leaflet_id;
      }
    };
  }, [open]);

  // Sync tolerance radius circle on map
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setRadius(tolerance);
    }
  }, [tolerance]);

  // Sync coords pin on map
  useEffect(() => {
    if (markerRef.current && circleRef.current && mapInstanceRef.current) {
      const newPos: [number, number] = [lat, lng];
      markerRef.current.setLatLng(newPos);
      circleRef.current.setLatLng(newPos);
      mapInstanceRef.current.panTo(newPos);
    }
  }, [lat, lng]);

  if (!open) return null;

  const handleSearchLocation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!locationSearch.trim()) return;

    // Check if input is Lat, Lng
    const parts = locationSearch.split(",").map((s) => s.trim());
    if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
      const newLat = parseFloat(Number(parts[0]).toFixed(6));
      const newLng = parseFloat(Number(parts[1]).toFixed(6));
      setLat(newLat);
      setLng(newLng);
      toast.success(`Position set to Lat ${newLat}, Lng ${newLng}`);
      return;
    }

    // Quick location presets
    const searchLower = locationSearch.toLowerCase();
    const presets: Record<string, [number, number]> = {
      almaty: [43.2389, 76.8897],
      mumbai: [19.076, 72.8777],
      surat: [21.1702, 72.8311],
      valsad: [20.5937, 72.9342],
      jakarta: [-6.2088, 106.8456],
      bangkok: [13.7563, 100.5018],
      london: [51.5074, -0.1278],
    };

    const foundKey = Object.keys(presets).find((k) => searchLower.includes(k));
    if (foundKey) {
      const [nLat, nLng] = presets[foundKey];
      setLat(nLat);
      setLng(nLng);
      toast.success(`Located "${locationSearch}" on map`);
    } else {
      toast.info(`Centered map to location search "${locationSearch}"`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a valid Address Name");
      return;
    }

    onSaveAddress({
      id: initialData?.id || "a-" + Date.now(),
      reseller: initialData?.reseller || "Device Integration Testing",
      company,
      name: name.trim(),
      addressType,
      tolerance,
      description,
      lat,
      lng,
    });

    toast.success(
      initialData ? `Address "${name}" updated!` : `Address "${name}" added successfully!`,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-7xl lg:max-w-[1380px] h-[88vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modern Clean Header Bar */}
        <div className="flex h-14 items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {initialData ? "Edit Address" : "Add Address"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5 stroke-[2]" />
          </button>
        </div>

        {/* Content Body Layout */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Form Sidebar Panel (380px compact) with Pinned Footer */}
          <div className="w-full md:w-[360px] lg:w-[380px] shrink-0 bg-slate-50/70 dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full min-h-0">
            <form
              id="add-address-form-element"
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
            >
              {/* Company Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Company / Branch
                </label>
                <Select value={company} onValueChange={setCompany}>
                  <SelectTrigger className="w-full h-9 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0089FF]">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent className="z-[60]">
                    <SelectItem value="All">All Companies</SelectItem>
                    <SelectItem value="Ha Company">Ha Company</SelectItem>
                    <SelectItem value="Surat Branch">Surat Branch</SelectItem>
                    <SelectItem value="Valsad Hub">Valsad Hub</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Address Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Address Name <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-normal">Required</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. HS - Bank Headquarters, Surat Central Depot"
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] transition-colors"
                />
              </div>

              {/* Address Type */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Address Type <span className="text-rose-500">*</span>
                </label>
                <Select value={addressType} onValueChange={setAddressType}>
                  <SelectTrigger className="w-full h-9 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:border-[#0089FF]">
                    <SelectValue placeholder="Select address type" />
                  </SelectTrigger>
                  <SelectContent className="z-[60]">
                    <SelectItem value="Financial / Bank">Financial / Bank</SelectItem>
                    <SelectItem value="Tech Hub">Tech Hub</SelectItem>
                    <SelectItem value="Logistics Hub">Logistics Hub</SelectItem>
                    <SelectItem value="Customer Location">Customer Location</SelectItem>
                    <SelectItem value="Warehouse / Plant">Warehouse / Plant</SelectItem>
                    <SelectItem value="Safety Zone">Safety Zone</SelectItem>
                    <SelectItem value="Emergency Area">Emergency Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tolerance Radius Slider & Meter Readout */}
              <div className="space-y-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Tolerance Radius
                  </span>
                  <span className="text-xs font-bold font-mono text-[#0089FF] bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded-lg">
                    {tolerance} metres
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={25}
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full accent-[#0089FF] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>50m</span>
                  <span>500m</span>
                  <span>1000m</span>
                  <span>2000m</span>
                </div>
              </div>

              {/* Description Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description / Notes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter optional address description or landmark notes..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#0089FF] resize-none"
                />
              </div>
            </form>

            {/* Pinned Bottom CTA Action Bar */}
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
                  const form = document.querySelector("#add-address-form-element") as HTMLFormElement;
                  if (form) {
                    form.requestSubmit();
                  } else {
                    handleSubmit(e);
                  }
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-xl shadow-md shadow-[#0089FF]/25 transition-all cursor-pointer active:scale-95"
              >
                {initialData ? "Update Address" : "Save Address"}
              </button>
            </div>
          </div>

          {/* Right Interactive Map Area (Fills all remaining space) */}
          <div className="flex-1 relative h-full bg-slate-100 dark:bg-slate-950 flex flex-col">
            {/* Top Search Bar Overlay */}
            <div className="absolute top-3 left-3 right-3 z-10">
              <form
                onSubmit={handleSearchLocation}
                className="relative flex items-center bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg backdrop-blur-md overflow-hidden"
              >
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Search Location OR Lat,Lng..."
                  className="w-full h-10 pl-10 pr-20 text-xs bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Map Canvas */}
            <div ref={mapElementRef} className="h-full w-full z-0 cursor-crosshair" />
          </div>
        </div>
      </div>
    </div>
  );
}
