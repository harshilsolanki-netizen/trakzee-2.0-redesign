import * as React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownOption =
  | string
  | {
      label: string;
      value?: string;
      description?: string;
      icon?: React.ReactNode;
      disabled?: boolean;
    };

export interface SelectDropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  id?: string;
  name?: string;
  error?: boolean;
}

export function SelectDropdown({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  className,
  triggerClassName,
  menuClassName,
  disabled = false,
  searchable,
  searchPlaceholder = "Search...",
  id,
  name,
  error = false,
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const isSearchable = searchable ?? options.length >= 8;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearchQuery("");
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      if (isSearchable) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, isSearchable]);

  const selectedOption = useMemo(() => {
    return options.find((opt) => {
      if (typeof opt === "object") {
        return (opt.value ?? opt.label) === value || opt.label === value;
      }
      return opt === value;
    });
  }, [options, value]);

  const displayLabel = selectedOption
    ? typeof selectedOption === "object"
      ? selectedOption.label
      : selectedOption
    : "";

  const selectedIcon =
    typeof selectedOption === "object" ? selectedOption.icon : undefined;

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter((opt) => {
      const label = typeof opt === "object" ? opt.label : opt;
      const desc = typeof opt === "object" ? opt.description || "" : "";
      return (
        label.toLowerCase().includes(q) || desc.toLowerCase().includes(q)
      );
    });
  }, [options, searchQuery]);

  return (
    <div ref={containerRef} className={cn("relative w-full select-none", className)}>
      {name && <input type="hidden" name={name} value={value} id={id} />}

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen(!open);
            if (!open) setSearchQuery("");
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "select-dropdown-trigger flex h-9 w-full items-center justify-between rounded-md border border-input/80 bg-background px-3 text-xs shadow-2xs transition-all",
          "hover:border-[#0089FF]/60 hover:bg-muted/40",
          "focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 focus:border-[#0089FF]",
          "cursor-pointer select-none font-normal",
          open &&
            "border-[#0089FF] ring-2 ring-[#0089FF]/20 bg-muted/40 shadow-xs",
          error && "border-rose-500 ring-rose-500/20",
          disabled &&
            "opacity-50 cursor-not-allowed hover:border-input/80 hover:bg-background",
          triggerClassName,
        )}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {selectedIcon && (
            <span className="shrink-0 text-muted-foreground">{selectedIcon}</span>
          )}
          <span
            className={cn(
              "truncate text-left leading-normal",
              displayLabel
                ? "text-foreground font-medium"
                : "text-muted-foreground/60 font-normal italic",
            )}
          >
            {displayLabel || placeholder}
          </span>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 opacity-70 transition-transform duration-200 ml-1.5",
            open && "rotate-180 text-[#0089FF] opacity-100",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "select-dropdown-menu absolute top-full left-0 right-0 z-[100] mt-1.5 max-h-64 overflow-hidden !rounded-xl border border-border/80 bg-popover/98 backdrop-blur-xl p-1.5 shadow-2xl animate-in fade-in-0 zoom-in-95 select-none flex flex-col",
            menuClassName,
          )}
        >
          {isSearchable && (
            <div className="p-1 pb-1.5 border-b border-border/60 mb-1 shrink-0">
              <div className="flex h-7.5 items-center gap-1.5 rounded-lg border border-input/80 bg-background px-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#0089FF]/20 focus-within:border-[#0089FF] transition-all">
                <Search className="h-3 w-3 text-muted-foreground shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-full flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="overflow-y-auto max-h-56 space-y-0.5 custom-scrollbar pr-0.5 flex-1">
            {filteredOptions.map((opt) => {
              const isObj = typeof opt === "object";
              const optLabel = isObj ? opt.label : opt;
              const optVal = isObj ? opt.value ?? opt.label : opt;
              const optDesc = isObj ? opt.description : undefined;
              const optIcon = isObj ? opt.icon : undefined;
              const optDisabled = isObj ? opt.disabled : false;
              const isSelected = value === optVal || value === optLabel;

              return (
                <button
                  key={optVal}
                  type="button"
                  disabled={optDisabled}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    if (!optDisabled) {
                      onChange(optVal);
                      setOpen(false);
                      setSearchQuery("");
                    }
                  }}
                  className={cn(
                    "select-dropdown-item flex w-full items-center justify-between !rounded-lg px-3 py-2 text-left transition-colors cursor-pointer select-none",
                    isSelected
                      ? "bg-[#0089FF]/10 text-[#0089FF] font-semibold"
                      : "text-foreground hover:bg-muted/80 font-medium",
                    optDisabled &&
                      "opacity-40 cursor-not-allowed hover:bg-transparent",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {optIcon && (
                      <span className="shrink-0 text-muted-foreground">
                        {optIcon}
                      </span>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span
                        className={cn(
                          "text-xs leading-tight truncate",
                          isSelected ? "font-semibold" : "font-normal",
                        )}
                      >
                        {optLabel}
                      </span>
                      {optDesc && (
                        <span className="text-[10.5px] leading-snug text-muted-foreground mt-0.5 font-normal">
                          {optDesc}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-[#0089FF] shrink-0 ml-1.5 stroke-[2.5]" />
                  )}
                </button>
              );
            })}

            {filteredOptions.length === 0 && (
              <div className="py-6 text-center text-xs text-muted-foreground italic">
                No options found matching "${searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectDropdown;
