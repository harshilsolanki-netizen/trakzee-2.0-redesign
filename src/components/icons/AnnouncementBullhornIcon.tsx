import React from "react";

export function AnnouncementBullhornIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 
        Solid Horizontal Bullhorn / Megaphone matching reference screenshot exactly:
        - Mouthpiece on the left
        - Cone expanding horizontally to the right
        - Vertical flare / rim on the right
        - Downward handle on the bottom left
      */}
      {/* Mouthpiece */}
      <path d="M1.5 5.25a.75.75 0 0 1 .75-.75h1.5v3.5h-1.5a.75.75 0 0 1-.75-.75v-2z" />
      {/* Main cone */}
      <path d="M4.5 4.2 12 1.85a.75.75 0 0 1 1 .72v8.86a.75.75 0 0 1-1 .72L4.5 9.8V4.2z" />
      {/* Front rim / mouth flare */}
      <rect x="13.5" y="1.5" width="1.25" height="11" rx="0.6" />
      {/* Handle */}
      <path d="M5.2 9.5h1.8v3.75a.8.8 0 0 1-.8.8h-.2a.8.8 0 0 1-.8-.8V9.5z" />
    </svg>
  );
}
