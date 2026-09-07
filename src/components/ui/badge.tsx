import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none select-none",
  {
    variants: {
      variant: {
        default:
          "border-[#0089FF]/20 bg-[#0089FF]/10 text-[#0089FF]",
        secondary:
          "border-border bg-muted/60 text-foreground",
        destructive:
          "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
        outline:
          "border-border text-muted-foreground",
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
        info:
          "border-[#0089FF]/20 bg-[#0089FF]/10 text-[#0089FF]",
      },
      pill: {
        true: "rounded-full px-2.5",
        false: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      pill: false,
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
