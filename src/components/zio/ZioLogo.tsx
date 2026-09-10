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
    xs: "h-3.5 w-3.5",
    sm: "h-4 w-4",
    md: "h-4.5 w-4.5",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
  };

  return (
    <img
      src="/zio-logo.png"
      alt="Zio Logo"
      className={cn(sizeClasses[size], "shrink-0 object-contain inline-block", className)}
    />
  );
}

