import React from "react";
import { TrakzeeWalkthroughScreen } from "./TrakzeeWalkthroughScreen";

export interface AddObjectWalkthroughProps {
  defaultMethod?: "tracking" | "settings";
}

export function AddObjectWalkthrough({ defaultMethod = "settings" }: AddObjectWalkthroughProps) {
  return (
    <div className="w-full h-[640px] rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">
      <TrakzeeWalkthroughScreen topic="object" />
    </div>
  );
}
