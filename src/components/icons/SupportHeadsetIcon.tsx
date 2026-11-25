import React from "react";
import { Headset } from "lucide-react";

export function SupportHeadsetIcon({
  className,
  ...props
}: React.ComponentProps<typeof Headset>) {
  return <Headset className={className} {...props} />;
}