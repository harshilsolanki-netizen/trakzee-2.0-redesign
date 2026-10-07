import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TrailerItem } from "./EditTrailerModal";

interface AllocateVehicleModalProps {
  open: boolean;
  onClose: () => void;
  trailer: TrailerItem | null;
  availableVehicles?: Array<{ id: string; name: string; plateNumber?: string }>;
  onSaveAllocation: (updatedTrailer: TrailerItem) => void;
}

export function AllocateVehicleModal({
  open,
  onClose,
  trailer,
  availableVehicles = [
    { id: "v1", name: "MH 14 KQ 4446" },
    { id: "v2", name: "MH 14 KA 6985" },
    { id: "v3", name: "MH 14 KA 9125" },
    { id: "v4", name: "MH 12 QW 5286" },
    { id: "v5", name: "GJ 05 CU 1936" },
  ],
  onSaveAllocation,
}: AllocateVehicleModalProps) {
  const [selectedVehicle, setSelectedVehicle] = useState("Unassigned");

  useEffect(() => {
    if (!open || !trailer) return;
    setSelectedVehicle(trailer.vehicle || "Unassigned");
  }, [open, trailer]);

  if (!open || !trailer) return null;

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    const isAttached = selectedVehicle !== "Unassigned";

    const updated: TrailerItem = {
      ...trailer,
      vehicle: selectedVehicle,
      isAttached,
    };

    onSaveAllocation(updated);
    if (isAttached) {
      toast.success(`Vehicle "${selectedVehicle}" assigned to trailer "${trailer.name}"!`);
    } else {
      toast.info(`Trailer "${trailer.name}" is now unallocated`);
    }
    onClose();
  };

  const handleDeallocate = () => {
    setSelectedVehicle("Unassigned");
    const updated: TrailerItem = {
      ...trailer,
      vehicle: "Unassigned",
      isAttached: false,
    };
    onSaveAllocation(updated);
    toast.info(`Trailer "${trailer.name}" deallocated successfully!`);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* 1. Standard Modal Header Bar (56px Height matching reference image) */}
        <div className="flex h-[56px] items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate pr-2">
            {trailer.name} - Assign Object
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="h-5 w-5 stroke-[2]" />
          </button>
        </div>

        {/* 2. Modal Content Form Body (Matching media_1791357972930.png 1:1) */}
        <form onSubmit={handleAssign} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Object :
            </label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger className="h-10 text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl font-medium">
                <SelectValue placeholder="Select Object / Vehicle" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <SelectItem value="Unassigned">Select (Unassigned)</SelectItem>
                {availableVehicles.map((v) => (
                  <SelectItem key={v.id} value={v.name}>
                    {v.name} {trailer.vehicle === v.name ? "(Allocated)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Footer Action Buttons matching reference image (Deallocate, Assign, Cancel) */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Deallocate Button */}
            <button
              type="button"
              onClick={handleDeallocate}
              className="px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl transition-all cursor-pointer active:scale-95"
            >
              Deallocate
            </button>

            {/* Assign Button */}
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#0089FF] hover:bg-[#0070d6] rounded-xl shadow-md shadow-[#0089FF]/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <Check className="h-4 w-4 stroke-[2.5]" />
              <span>Assign</span>
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
