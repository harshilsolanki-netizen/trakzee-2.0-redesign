import React from "react";

/**
 * Universal automotive ISO TPMS (Tire Pressure Monitoring System) icon.
 * Features the standard open tire cross-section with tread lugs and center exclamation mark.
 */
export function TpmsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Outer tire profile with curved sidewalls */}
      <path d="M4 14.5C3.1 12.2 3.1 9.2 4.4 7C5.8 4.5 8.6 3 12 3s6.2 1.5 7.6 4c1.3 2.2 1.3 5.2.4 7.5" />
      {/* Bottom tire tread ribs */}
      <path d="M4.5 17.5h1.8M8.5 17.5h2M13.5 17.5h2M17.7 17.5h1.8" />
      {/* Center exclamation mark */}
      <line x1="12" y1="7" x2="12" y2="11.5" strokeWidth="2.2" />
      <circle cx="12" cy="14" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Universal automotive Engine Block / Check Engine icon.
 * Features the standard engine block outline with top intake, left pulley, and right exhaust manifold.
 */
export function EngineIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Main engine block */}
      <rect x="5.5" y="8" width="12" height="10" rx="1.5" />
      {/* Top air intake / valve cover */}
      <path d="M8 8V5h3v3" />
      {/* Top right oil cap / spark sensor */}
      <path d="M14 5.5h2.5v2.5H14" />
      {/* Left alternator / serpentine pulley */}
      <path d="M2.5 11h3v4h-3z" />
      {/* Right exhaust manifold / bellhousing */}
      <path d="M17.5 10.5h3.5v5h-3.5" />
      {/* Center cylinder rotor / crankshaft detail */}
      <circle cx="11.5" cy="13" r="1.5" />
    </svg>
  );
}
