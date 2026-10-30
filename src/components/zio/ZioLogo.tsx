import React from "react";
import { cn } from "@/lib/utils";

/**
 * Official Zio AI Assistant Logo
 * Uses tight viewBox (40 40 220 220) centered on the 4-point star to maximize visible icon size
 */
export function ZioLogo({
  className,
  size = "md",
  fill = "#0089FF",
}: {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fill?: string;
}) {
  const sizeClasses = {
    xs: "h-4 w-4",
    sm: "h-5 w-5",
    md: "h-5.5 w-5.5",
    lg: "h-7 w-7",
    xl: "h-9 w-9",
  };

  return (
    <svg
      viewBox="40 40 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], "shrink-0 inline-block", className)}
    >
      <path
        d="M186.771 149.839L220.078 201.674L253.327 253.3L201.757 220.086L149.922 186.779L46.5756 253.278L113.133 149.847L79.8264 98.012L46.7271 46.6201L149.922 113.024L201.757 79.7172L253.221 46.5703L186.771 149.839Z"
        fill={fill}
      />
    </svg>
  );
}

/**
 * Zio Icon for Navigation, Buttons and Toolbars (inherits currentColor by default)
 */
export function ZioIcon({
  className,
  fill = "currentColor",
  ...props
}: React.SVGProps<SVGSVGElement> & { fill?: string }) {
  return (
    <svg
      viewBox="40 40 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6 shrink-0", className)}
      {...props}
    >
      <path
        d="M186.771 149.839L220.078 201.674L253.327 253.3L201.757 220.086L149.922 186.779L46.5756 253.278L113.133 149.847L79.8264 98.012L46.7271 46.6201L149.922 113.024L201.757 79.7172L253.221 46.5703L186.771 149.839Z"
        fill={fill}
      />
    </svg>
  );
}
