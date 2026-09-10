import React from "react";
import { cn } from "@/lib/utils";

/**
 * Official Zio AI Assistant Logo
 */
export function ZioLogo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const sizeClasses = {
    xs: "h-4 w-4",
    sm: "h-5 w-5",
    md: "h-5.5 w-5.5",
    lg: "h-7 w-7",
    xl: "h-9 w-9",
  };

  return (
    <img
      src="/zio-logo.png"
      alt="Zio Logo"
      className={cn(sizeClasses[size], "shrink-0 object-contain inline-block", className)}
    />
  );
}

