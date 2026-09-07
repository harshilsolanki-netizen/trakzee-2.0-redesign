import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs transition-all placeholder:text-muted-foreground/60 hover:border-[#0089FF]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0089FF]/20 focus-visible:border-[#0089FF] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
