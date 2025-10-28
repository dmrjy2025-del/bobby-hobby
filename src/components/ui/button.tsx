import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // white/icon variant for circular edit buttons
        icon: "bg-white text-foreground shadow-sm hover:shadow-md hover:scale-105",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Keep default sizing but ensure minimum touch target (44x44)
        default: "h-9 px-4 py-2 has-[>svg]:px-3 min-w-[44px] min-h-[44px]",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 min-w-[44px] min-h-[44px]",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 min-w-[44px] min-h-[44px]",
        icon: "size-9 rounded-md",
        // Circular 40x40 visual size (w-10 = 40px) but keep min touch target 44x44
        circle: "w-10 h-10 rounded-full p-0 flex items-center justify-center min-w-[44px] min-h-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(
        // add global interaction rules: smooth transition (0.2s) and active opacity/scale
        "transition duration-200 ease-in-out active:opacity-80 active:scale-95",
        buttonVariants({ variant, size, className }),
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
