import React, { useState, useMemo, useEffect } from "react";
import {
  Navigation,
  Search,
  MapPin,
  ExternalLink,
  X,
  ArrowUp,
  CornerUpLeft,
  CornerUpRight,
  ArrowUpRight,
  ArrowUpLeft,
  RotateCcw,
  Split,
  Flag,
  Car,
  Clock,
  Check,
  ChevronRight,
  ArrowLeft,
  Route as RouteIcon,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { type FleetObject } from "@/data/fleet";
import { cn } from "@/lib/utils";

export interface NavigationStep {
  id: string;
  icon:
    | "straight"
    | "turn-left"
    | "turn-right"
    | "slight-left"
    | "slight-right"
    | "u-turn"
    | "fork-left"
    | "fork-right"
    | "arrive";
  instruction: string;
  distance: string;
}

export interface NavigationRoute {
  id: string;
  destinationName: string;
  fullAddress: string;
  origin: [number, number]; // [lat, lng]
  destination: [number, number]; // [lat, lng]
  highwayName: string;
  totalDistance: string;
  totalDuration: string;
  coordinates: [number, number][];
  steps: NavigationStep[];
}

export interface PresetDestination {
  id: string;
  name: string;
  fullAddress: string;
  destination: [number, number];
  highwayName: string;
  totalDistance: string;
  totalDuration: string;
  coordinates: [number, number][];
  steps: NavigationStep[];
}

// Preset destinations including the exact ones from the reference screenshots
export const PRESET_DESTINATIONS: PresetDestination[] = [
  {
    id: "surat-katargam",
    name: "Surat, Katargam Taluka",
    fullAddress: "સુરત, Katargam Taluka, સુરત, Gujarat, 395008, India",
    destination: [21.2185, 72.8256],
    highwayName: "NH48, Mumbai Delhi Highway",
    totalDistance: "379.9 km",
    totalDuration: "4 h 37 min",
    coordinates: [
      [19.0760, 72.8777],
      [19.1230, 72.8900],
      [19.1860, 72.9350],
      [19.2250, 72.9800],
      [19.2950, 72.9300],
      [19.3800, 72.9050],
      [19.5200, 72.8900],
      [19.7423, 72.9126],
      [19.9547, 72.8931],
      [20.1500, 72.9100],
      [20.3712, 72.9043],
      [20.5126, 72.9512],
      [20.6105, 72.9342],
      [20.7582, 72.9814],
      [20.9467, 72.9279],
      [21.0847, 72.8762],
      [21.1702, 72.8311],
      [21.2185, 72.8256],
    ],
    steps: [
      { id: "s1", icon: "straight", instruction: "Head west", distance: "0.5 km" },
      { id: "s2", icon: "turn-left", instruction: "Turn left onto Mumbai - Pune Expressway (Toll Road) (NH48)", distance: "0.5 km" },
      { id: "s3", icon: "u-turn", instruction: "Make a U-turn onto NH48", distance: "35 km" },
      { id: "s4", icon: "turn-left", instruction: "Turn left onto NH48", distance: "1.5 km" },
      { id: "s5", icon: "fork-left", instruction: "Keep left at the fork onto Old NH4 (NH48)", distance: "35 km" },
      { id: "s6", icon: "fork-left", instruction: "Keep left at the fork onto NH48", distance: "0.5 km" },
      { id: "s7", icon: "turn-right", instruction: "Turn right onto NH48", distance: "0 km" },
      { id: "s8", icon: "fork-left", instruction: "Keep left at the fork onto NH48", distance: "5 km" },
      { id: "s9", icon: "slight-right", instruction: "Make a slight right onto NH48", distance: "1.5 km" },
      { id: "s10", icon: "turn-left", instruction: "Turn left onto NH48", distance: "0.5 km" },
      { id: "s11", icon: "straight", instruction: "Continue straight on NH48 towards Gujarat", distance: "245 km" },
      { id: "s12", icon: "slight-right", instruction: "Take exit toward Katargam / Sumul Dairy Road", distance: "2.4 km" },
      { id: "s13", icon: "turn-right", instruction: "Turn right onto Katargam Main Road", distance: "1.2 km" },
      { id: "s14", icon: "arrive", instruction: "Arrive at Katargam, Surat, Gujarat", distance: "0 km" },
    ],
  },
  {
    id: "surat-sumul",
    name: "Surat, Sumul Dairy Road",
    fullAddress: "Surat, Sumul Dairy Road, Mini Bazar, સુરત, Puna Taluka, સુરત, Gujarat, 395003, India",
    destination: [21.2054, 72.8427],
    highwayName: "NH48, Mumbai Delhi Highway",
    totalDistance: "376.4 km",
    totalDuration: "4 h 32 min",
    coordinates: [
      [19.0760, 72.8777],
      [19.1860, 72.9350],
      [19.2950, 72.9300],
      [19.7423, 72.9126],
      [20.3712, 72.9043],
      [20.6105, 72.9342],
      [20.9467, 72.9279],
      [21.1702, 72.8311],
      [21.2054, 72.8427],
    ],
    steps: [
      { id: "s1", icon: "straight", instruction: "Head north on Western Express Highway", distance: "1.2 km" },
      { id: "s2", icon: "fork-left", instruction: "Merge onto NH48 towards Surat / Ahmedabad", distance: "360 km" },
      { id: "s3", icon: "turn-right", instruction: "Take exit at Mini Bazar towards Sumul Dairy Road", distance: "3.5 km" },
      { id: "s4", icon: "arrive", instruction: "Arrive at Sumul Dairy Road, Surat", distance: "0 km" },
    ],
  },
  {
    id: "surat-city",
    name: "Surat City Center",
    fullAddress: "સુરત, Gujarat, India",
    destination: [21.1702, 72.8311],
    highwayName: "NH48, Mumbai Delhi Highway",
    totalDistance: "374.2 km",
    totalDuration: "4 h 28 min",
    coordinates: [
      [19.0760, 72.8777],
      [19.1860, 72.9350],
      [19.7423, 72.9126],
      [20.3712, 72.9043],
      [20.6105, 72.9342],
      [20.9467, 72.9279],
      [21.1702, 72.8311],
    ],
    steps: [
      { id: "s1", icon: "straight", instruction: "Head north on NH48", distance: "365 km" },
      { id: "s2", icon: "turn-left", instruction: "Turn left onto Ring Road Surat", distance: "8.5 km" },
      { id: "s3", icon: "arrive", instruction: "Arrive at Surat City, Gujarat", distance: "0 km" },
    ],
  },
  {
    id: "valsad-city",
    name: "Valsad, Gujarat",
    fullAddress: "Valsad, Gujarat, 396001, India",
    destination: [20.6105, 72.9342],
    highwayName: "NH48, Western Highway",
    totalDistance: "192.5 km",
    totalDuration: "3 h 12 min",
    coordinates: [
      [19.0760, 72.8777],
      [19.1860, 72.9350],
      [19.7423, 72.9126],
      [20.3712, 72.9043],
      [20.6105, 72.9342],
    ],
    steps: [
      { id: "s1", icon: "straight", instruction: "Head north on NH48", distance: "185 km" },
      { id: "s2", icon: "turn-right", instruction: "Turn right onto Dharampur Road", distance: "7.5 km" },
      { id: "s3", icon: "arrive", instruction: "Arrive at Valsad, Gujarat", distance: "0 km" },
    ],
  },
  {
    id: "vapi-gidc",
    name: "Vapi GIDC Industrial Hub",
    fullAddress: "Vapi GIDC Industrial Hub, Gujarat, 396195, India",
    destination: [20.3712, 72.9043],
    highwayName: "NH48, Golden Quadrilateral",
    totalDistance: "165.2 km",
    totalDuration: "2 h 48 min",
    coordinates: [
      [19.0760, 72.8777],
      [19.1860, 72.9350],
      [19.7423, 72.9126],
      [20.3712, 72.9043],
    ],
    steps: [
      { id: "s1", icon: "straight", instruction: "Head north on NH48 Expressway", distance: "160 km" },
      { id: "s2", icon: "turn-left", instruction: "Turn left onto Vapi Main GIDC Road", distance: "5.2 km" },
      { id: "s3", icon: "arrive", instruction: "Arrive at Vapi GIDC, Gujarat", distance: "0 km" },
    ],
  },
  {
    id: "pune-hinjawadi",
    name: "Pune, Hinjawadi IT Park",
    fullAddress: "Hinjawadi Phase 1, Pune, Maharashtra, 411057, India",
    destination: [18.5913, 73.7389],
    highwayName: "Mumbai - Pune Expressway",
    totalDistance: "148.5 km",
    totalDuration: "2 h 15 min",
    coordinates: [
      [19.0760, 72.8777],
      [19.0330, 73.0297],
      [18.9894, 73.1175],
      [18.8290, 73.2842],
      [18.7557, 73.4091],
      [18.7350, 73.6744],
      [18.5913, 73.7389],
    ],
    steps: [
      { id: "s1", icon: "straight", instruction: "Head east on Sion-Panvel Highway", distance: "28 km" },
      { id: "s2", icon: "fork-right", instruction: "Merge onto Mumbai - Pune Expressway (Toll Road)", distance: "94 km" },
      { id: "s3", icon: "slight-right", instruction: "Take exit towards Hinjawadi IT Park", distance: "4.5 km" },
      { id: "s4", icon: "arrive", instruction: "Arrive at Hinjawadi, Pune", distance: "0 km" },
    ],
  },
  {
    id: "ahmedabad-sg",
    name: "Ahmedabad, SG Highway",
    fullAddress: "SG Highway, Bodakdev, Ahmedabad, Gujarat, 380054, India",
    destination: [23.0225, 72.5714],
    highwayName: "NE1 / NH48 National Highway",
    totalDistance: "525.0 km",
    totalDuration: "6 h 45 min",
    coordinates: [
      [19.0760, 72.8777],
      [19.7423, 72.9126],
      [20.3712, 72.9043],
      [20.6105, 72.9342],
      [21.2185, 72.8256],
      [21.7051, 72.9959],
      [22.3072, 73.1812],
      [22.6916, 72.8634],
      [23.0225, 72.5714],
    ],
    steps: [
      { id: "s1", icon: "straight", instruction: "Head north on NH48 through Surat", distance: "380 km" },
      { id: "s2", icon: "fork-left", instruction: "Merge onto Ahmedabad - Vadodara Expressway (NE1)", distance: "95 km" },
      { id: "s3", icon: "turn-left", instruction: "Take exit toward SG Highway / Bodakdev", distance: "12 km" },
      { id: "s4", icon: "arrive", instruction: "Arrive at SG Highway, Ahmedabad", distance: "0 km" },
    ],
  },
];

export interface NavigationModeModalProps {
  open: boolean;
  onClose: () => void;
  vehicle: FleetObject | null;
  onStartNavigation: (route: NavigationRoute) => void;
  onClearNavigation: () => void;
  isNavigating: boolean;
  activeRoute?: NavigationRoute | null;
  className?: string;
}

export function NavigationModeModal({
  open,
  onClose,
  vehicle,
  onStartNavigation,
  onClearNavigation,
  isNavigating,
  activeRoute,
  className,
}: NavigationModeModalProps) {
  // If not open, don't render
  if (!open) return null;

  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (isNavigating && activeRoute) {
      return activeRoute.fullAddress || activeRoute.destinationName;
    }
    return "";
  });

  const [selectedDestination, setSelectedDestination] =
    useState<PresetDestination | null>(() => {
      if (activeRoute) {
        const found = PRESET_DESTINATIONS.find((p) => p.id === activeRoute.id);
        if (found) return found;
      }
      return null;
    });

  // viewMode: "search" | "selected" | "navigating"
  const [viewMode, setViewMode] = useState<"search" | "selected" | "navigating">(() => {
    if (isNavigating && activeRoute) return "navigating";
    return "search";
  });

  // Synchronize or reset state whenever modal is opened or activeRoute changes
  useEffect(() => {
    if (open) {
      if (isNavigating && activeRoute) {
        setSearchQuery(activeRoute.fullAddress || activeRoute.destinationName);
        setSelectedDestination(
          PRESET_DESTINATIONS.find((p) => p.id === activeRoute.id) || null
        );
        setViewMode("navigating");
      } else if (!isNavigating) {
        setSearchQuery("");
        setSelectedDestination(null);
        setViewMode("search");
      }
    }
  }, [open, isNavigating, activeRoute]);

  // Filtered preset suggestions based on search query
  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return PRESET_DESTINATIONS;
    return PRESET_DESTINATIONS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.fullAddress.toLowerCase().includes(q) ||
        item.highwayName.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Vehicle origin coords (default to Mumbai coordinates if vehicle doesn't have lat/lng)
  const originLat = vehicle?.lat ?? 19.0760;
  const originLng = vehicle?.lng ?? 72.8777;

  // Handle selecting a destination from autocomplete dropdown
  const handleSelectDestination = (dest: PresetDestination) => {
    setSelectedDestination(dest);
    setSearchQuery(dest.fullAddress);
    setViewMode("selected");
  };

  // Dynamically create a route for any custom queried destination
  const handleCreateCustomDestination = (query: string) => {
    const customDest: PresetDestination = {
      id: "custom-" + Date.now(),
      name: query,
      fullAddress: `${query}, India`,
      destination: [originLat + 0.5, originLng + 0.4],
      highwayName: `Expressway towards ${query}`,
      totalDistance: "215.0 km",
      totalDuration: "3 h 20 min",
      coordinates: [
        [originLat, originLng],
        [originLat + 0.1, originLng + 0.08],
        [originLat + 0.25, originLng + 0.2],
        [originLat + 0.38, originLng + 0.32],
        [originLat + 0.5, originLng + 0.4],
      ],
      steps: [
        { id: "cs1", icon: "straight", instruction: `Head towards highway connecting to ${query}`, distance: "1.5 km" },
        { id: "cs2", icon: "fork-left", instruction: `Merge onto Highway towards ${query}`, distance: "198 km" },
        { id: "cs3", icon: "turn-left", instruction: `Take exit towards ${query}`, distance: "15.5 km" },
        { id: "cs4", icon: "arrive", instruction: `Arrive at destination: ${query}`, distance: "0 km" },
      ],
    };
    setSelectedDestination(customDest);
    setSearchQuery(customDest.fullAddress);
    setViewMode("selected");
  };

  // Open in Google Maps directions
  const handleOpenInGoogleMaps = (destAddress?: string) => {
    const destinationQuery =
      destAddress ||
      selectedDestination?.fullAddress ||
      searchQuery ||
      "Surat, Gujarat";
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${encodeURIComponent(
      destinationQuery
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("Opening route in Google Maps");
  };

  // Start in-app navigation
  const handleStartInApp = () => {
    if (!selectedDestination) {
      toast.error("Please select a destination first");
      return;
    }

    const routeData: NavigationRoute = {
      id: selectedDestination.id,
      destinationName: selectedDestination.name,
      fullAddress: selectedDestination.fullAddress,
      origin: [originLat, originLng],
      destination: selectedDestination.destination,
      highwayName: selectedDestination.highwayName,
      totalDistance: selectedDestination.totalDistance,
      totalDuration: selectedDestination.totalDuration,
      coordinates: selectedDestination.coordinates,
      steps: selectedDestination.steps,
    };

    onStartNavigation(routeData);
    setViewMode("navigating");
    toast.success(`Navigation started to ${selectedDestination.name}`);
  };

  // Exit navigation
  const handleExitNavigation = () => {
    onClearNavigation();
    setViewMode("selected");
    toast.info("Navigation stopped and route cleared");
  };

  // Helper to render turn icon
  const renderTurnIcon = (icon: NavigationStep["icon"]) => {
    switch (icon) {
      case "straight":
        return <ArrowUp className="h-4 w-4 text-slate-700 dark:text-slate-200" />;
      case "turn-left":
        return <CornerUpLeft className="h-4 w-4 text-slate-700 dark:text-slate-200" />;
      case "turn-right":
        return <CornerUpRight className="h-4 w-4 text-slate-700 dark:text-slate-200" />;
      case "slight-left":
        return <ArrowUpLeft className="h-4 w-4 text-slate-700 dark:text-slate-200" />;
      case "slight-right":
        return <ArrowUpRight className="h-4 w-4 text-slate-700 dark:text-slate-200" />;
      case "u-turn":
        return <RotateCcw className="h-4 w-4 text-slate-700 dark:text-slate-200" />;
      case "fork-left":
      case "fork-right":
        return <Split className="h-4 w-4 text-slate-700 dark:text-slate-200" />;
      case "arrive":
        return <Flag className="h-4 w-4 text-rose-500 fill-rose-500/20" />;
      default:
        return <ArrowUp className="h-4 w-4 text-slate-700 dark:text-slate-200" />;
    }
  };

  const currentRoute = activeRoute || selectedDestination;

  return (
    <div
      className={cn(
        "w-[380px] sm:w-[410px] bg-white dark:bg-slate-900 border border-[#DFE3EB] dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto select-none transition-all duration-200 animate-in fade-in zoom-in-95",
        className
      )}
    >
      {/* ── 1. Top Header Bar (Trakzee 2.0 Theme) ── */}
      <div className="flex h-11 items-center justify-between px-3.5 bg-white dark:bg-slate-900 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-lg bg-[#0089FF]/10 text-[#0089FF] flex items-center justify-center shrink-0">
            <Navigation className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
            Navigation Mode
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close Navigation Mode"
        >
          <X className="h-4 w-4 stroke-[2]" />
        </button>
      </div>

      {/* ── 2. Destination Search & Input Box ── */}
      <div className="p-3 border-b border-[#DFE3EB]/70 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
        <div className="relative flex items-center">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (viewMode !== "search") {
                setViewMode("search");
              }
            }}
            onFocus={() => {
              if (viewMode === "selected") {
                setViewMode("search");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                if (suggestions.length > 0) {
                  handleSelectDestination(suggestions[0]);
                } else {
                  handleCreateCustomDestination(searchQuery.trim());
                }
              }
            }}
            placeholder="Search destination, city, highway..."
            className="w-full h-9 pl-9 pr-8 text-xs rounded-xl border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 hover:border-[#0089FF]/50 focus:outline-none focus:border-[#0089FF] focus:ring-2 focus:ring-[#0089FF]/20 transition-all truncate"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedDestination(null);
                setViewMode("search");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── 3. Mode Content ── */}

      {/* ── Mode A: Search & Suggestions View (matches media_1791883291316_27bbd1d3.png) ── */}
      {viewMode === "search" && (
        <div className="flex flex-col flex-1 min-h-0 animate-in fade-in duration-150">
          <div className="max-h-[260px] overflow-y-auto divide-y divide-[#DFE3EB]/50 dark:divide-slate-800/60 custom-scrollbar">
            {suggestions.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleSelectDestination(dest)}
                className="p-3 hover:bg-sky-50/70 dark:hover:bg-slate-800/80 cursor-pointer transition-colors flex items-start gap-2.5 group"
              >
                <MapPin className="h-4 w-4 text-slate-400 group-hover:text-[#0089FF] mt-0.5 shrink-0 transition-colors" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#0089FF] transition-colors truncate">
                    {dest.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                    {dest.fullAddress}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    <span>{dest.highwayName}</span>
                    <span>•</span>
                    <span>{dest.totalDistance}</span>
                    <span>•</span>
                    <span>{dest.totalDuration}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Dynamic Custom Destination Option */}
            {searchQuery.trim() &&
              !PRESET_DESTINATIONS.some(
                (p) => p.name.toLowerCase() === searchQuery.trim().toLowerCase()
              ) && (
                <div
                  onClick={() => handleCreateCustomDestination(searchQuery.trim())}
                  className="p-3 hover:bg-sky-50/70 dark:hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center justify-between gap-2.5 group bg-sky-50/30 dark:bg-slate-800/30"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <RouteIcon className="h-4 w-4 text-[#0089FF] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#0089FF] truncate">
                        Route to "{searchQuery.trim()}"
                      </p>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                        Calculate fastest driving route
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0089FF] shrink-0" />
                </div>
              )}

            {suggestions.length === 0 && !searchQuery.trim() && (
              <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
                Type an address or select from common destinations.
              </div>
            )}
          </div>

          {/* Bottom Action for Search Mode: Open in Maps */}
          <div className="p-3 border-t border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end shrink-0">
            <button
              type="button"
              onClick={() => handleOpenInGoogleMaps()}
              disabled={!searchQuery.trim()}
              className={cn(
                "text-xs font-semibold flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors",
                searchQuery.trim()
                  ? "text-[#0089FF] hover:text-[#0077E6] hover:underline hover:bg-sky-50 dark:hover:bg-sky-950/40 cursor-pointer"
                  : "text-slate-400 dark:text-slate-500 opacity-60 cursor-not-allowed"
              )}
            >
              <span>Open in Maps</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Mode B: Selected Destination State (matches media_1791883333022_9f7856fd.png) ── */}
      {viewMode === "selected" && selectedDestination && (
        <div className="p-3 space-y-3 animate-in fade-in duration-150">
          {/* Destination Summary Info Badge */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#DFE3EB] dark:border-slate-700/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-800 dark:text-slate-100 font-semibold">
              <span className="truncate pr-2">{selectedDestination.name}</span>
              <span className="text-[#0089FF] shrink-0 font-bold">
                {selectedDestination.totalDistance}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="truncate pr-2">{selectedDestination.highwayName}</span>
              <span className="shrink-0">{selectedDestination.totalDuration}</span>
            </div>
          </div>

          {/* Side-by-side Dual Action Buttons: [ In App ] & [ Open in Maps ] */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleStartInApp}
              className="h-9 px-4 rounded-xl bg-[#0089FF] hover:bg-[#0077E6] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
            >
              <Navigation className="h-3.5 w-3.5 fill-current" />
              <span>In App</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenInGoogleMaps()}
              className="h-9 px-4 rounded-xl border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
            >
              <span>Open in Maps</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      )}

      {/* ── Mode C: Turn-by-Turn Navigation View (matches media_1791883357890_22ce34ef.png) ── */}
      {viewMode === "navigating" && currentRoute && (
        <div className="flex flex-col flex-1 min-h-0 animate-in fade-in duration-150">
          {/* Route Overview Header Box */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-[#DFE3EB] dark:border-slate-800 shrink-0">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {currentRoute.highwayName}
            </h3>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {currentRoute.totalDistance}, {currentRoute.totalDuration}
            </p>
          </div>

          {/* Turn-by-Turn Directions List */}
          <div className="max-h-[300px] overflow-y-auto divide-y divide-[#DFE3EB]/40 dark:divide-slate-800/60 custom-scrollbar text-xs">
            {currentRoute.steps.map((step, idx) => (
              <div
                key={step.id || idx}
                className="flex items-start gap-2.5 p-2.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Step Direction Turn Icon */}
                <div className="h-6 w-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {renderTurnIcon(step.icon)}
                </div>

                {/* Step Instruction Text */}
                <div className="flex-1 min-w-0 pr-1">
                  <p className="text-[11.5px] font-medium text-slate-800 dark:text-slate-200 leading-snug">
                    {step.instruction}
                  </p>
                </div>

                {/* Step Distance */}
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                    {step.distance}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Controls in Navigation State */}
          <div className="p-3 border-t border-[#DFE3EB] dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExitNavigation}
              className="h-8 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
            >
              <X className="h-3.5 w-3.5" />
              <span>Exit Route</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenInGoogleMaps()}
              className="h-8 px-3.5 rounded-xl border border-[#DFE3EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
            >
              <span>Open in Maps</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
