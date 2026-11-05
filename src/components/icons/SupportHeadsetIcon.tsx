import React from "react";

export function SupportHeadsetIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Outer Headband & Boom Arm curving to bottom center */}
      <path
        d="M 3.43 10.45 A 8.6 8.6 0 0 1 20.6 11.2 A 8.6 8.6 0 0 1 13.5 19.67"
      />

      {/* Left Earcup */}
      <rect
        x="1.5"
        y="8.2"
        width="2.8"
        height="6.0"
        rx="1.4"
        fill="currentColor"
        stroke="none"
      />

      {/* Right Earcup */}
      <rect
        x="19.7"
        y="8.2"
        width="2.8"
        height="6.0"
        rx="1.4"
        fill="currentColor"
        stroke="none"
      />

      {/* Microphone Capsule */}
      <circle cx="12.2" cy="19.7" r="1.8" fill="currentColor" stroke="none" />

      {/* Central Speech Chat Bubble */}
      <path
        d="M 11.28 16.35 A 5.2 5.2 0 1 1 7.9 14.4 L 6.2 17.2 L 11.28 16.35 Z"
      />

      {/* Three Message Dots inside Speech Bubble */}
      <circle cx="9.6" cy="11.2" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="12.0" cy="11.2" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="14.4" cy="11.2" r="0.95" fill="currentColor" stroke="none" />
    </svg>
  );
}
