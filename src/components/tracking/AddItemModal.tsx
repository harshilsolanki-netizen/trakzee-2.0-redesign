import React, { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type ItemRow = {
  id: string;
  itemType: string;
  name: string;
  qty: number | string;
  weight: string;
};

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  jobTitle?: string;
  initialItems?: ItemRow[];
  onSave?: (items: ItemRow[]) => void;
}

const DEFAULT_ITEMS: ItemRow[] = [
  { id: "1", itemType: "HP Item 1", name: "", qty: 1, weight: "" },
  { id: "2", itemType: "HP Item 1", name: "", qty: 1, weight: "" },
  { id: "3", itemType: "HP Item 1", name: "", qty: 1, weight: "" },
  { id: "4", itemType: "HP Item 1", name: "", qty: 1, weight: "" },
];

const ITEM_OPTIONS = [
  "HP Item 1",
  "HP Item 2",
  "HP Item 3",
  "SCM Material A",
  "SCM Material B",
  "General Cargo",
];

export function AddItemModal({
  open,
  onClose,
  jobTitle = "Add Item",
  initialItems,
  onSave,
}: AddItemModalProps) {
  const [items, setItems] = useState<ItemRow[]>(
    initialItems && initialItems.length > 0 ? initialItems : DEFAULT_ITEMS
  );
  const [addVia, setAddVia] = useState<"manual">("manual");

  if (!open) return null;

  const handleAddField = () => {
    const newId = String(Date.now());
    setItems((prev) => [
      ...prev,
      { id: newId, itemType: "HP Item 1", name: "", qty: 1, weight: "" },
    ]);
  };

  const handleRemoveField = (id: string) => {
    if (items.length <= 1) {
      toast.warning("At least one item row is required.");
      return;
    }
    setItems((prev) => prev.filter((row) => row.id !== id));
    toast.info("Item row removed");
  };

  const handleFieldChange = (
    id: string,
    field: keyof ItemRow,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave(items);
    }
    toast.success("Item details saved successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
      {/* Backdrop */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer animate-in fade-in duration-200"
      />

      {/* Modal Dialog Box (Matching Standard Application Modal Component 1:1) */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-foreground shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 select-none pointer-events-auto">
        {/* Header (56px) - Matching Standard Modal Component */}
        <header className="flex h-[56px] items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900 shrink-0">
          <h2 className="text-[16px] font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Add Item
          </h2>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="rounded-md p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {/* Controls Sub-Header Row with Standard Add Row Button & Mode Selection */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            {/* Standard Add Row Button */}
            <button
              type="button"
              onClick={handleAddField}
              className="h-8 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
              title="Add Item Row"
            >
              <Plus className="h-4 w-4 stroke-[2.5] text-[#0089FF]" />
              <span>Add Row</span>
            </button>

            {/* Right: Add via radio selector */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Add via :</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="addVia"
                  checked={addVia === "manual"}
                  onChange={() => setAddVia("manual")}
                  className="h-3.5 w-3.5 text-[#0089FF] focus:ring-[#0089FF]"
                />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Manual
                </span>
              </label>
            </div>
          </div>

          {/* Dynamic Item Form Rows */}
          <div className="space-y-3">
            {items.map((row) => (
              <div
                key={row.id}
                className="flex items-center gap-2 bg-white dark:bg-slate-900 transition-all"
              >
                {/* 1. Item Dropdown */}
                <div className="flex items-center gap-1 min-w-[130px] flex-1">
                  <span className="text-xs font-medium text-slate-500 shrink-0">
                    Item<span className="text-rose-500">*</span>
                  </span>
                  <select
                    value={row.itemType}
                    onChange={(e) =>
                      handleFieldChange(row.id, "itemType", e.target.value)
                    }
                    className="w-full h-8 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0089FF] cursor-pointer"
                  >
                    {ITEM_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Name Input */}
                <div className="flex items-center gap-1 min-w-[140px] flex-1">
                  <span className="text-xs font-medium text-slate-500 shrink-0">
                    Name<span className="text-rose-500">*</span>
                  </span>
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) =>
                      handleFieldChange(row.id, "name", e.target.value)
                    }
                    placeholder=""
                    className="w-full h-8 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0089FF]"
                  />
                </div>

                {/* 3. Qty Input */}
                <div className="flex items-center gap-1 w-[90px] shrink-0">
                  <span className="text-xs font-medium text-slate-500 shrink-0">
                    Qty<span className="text-rose-500">*</span>
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={row.qty}
                    onChange={(e) =>
                      handleFieldChange(row.id, "qty", e.target.value)
                    }
                    className="w-full h-8 px-2 text-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0089FF]"
                  />
                </div>

                {/* 4. Weight Input */}
                <div className="flex items-center gap-1 w-[100px] shrink-0">
                  <span className="text-xs font-medium text-slate-500 shrink-0">
                    Weight<span className="text-rose-500">*</span>
                  </span>
                  <input
                    type="text"
                    value={row.weight}
                    onChange={(e) =>
                      handleFieldChange(row.id, "weight", e.target.value)
                    }
                    placeholder=""
                    className="w-full h-8 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0089FF]"
                  />
                </div>

                {/* 5. Trash Action Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveField(row.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors cursor-pointer shrink-0"
                  title="Remove row"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer (56px) - Standard Modal Actions (Cancel & Primary Brand Save Button) */}
        <footer className="flex h-[56px] items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="h-8 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer shadow-2xs active:scale-98"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-8 rounded-md bg-[#0089FF] hover:bg-[#0077E6] px-5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer active:scale-98"
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
}
