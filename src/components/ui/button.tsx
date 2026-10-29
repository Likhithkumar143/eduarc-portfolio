import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-brand-navy-deep active:scale-[0.99]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.99]",
        outline:
          "border border-border bg-background shadow-xs hover:bg-secondary hover:text-foreground active:scale-[0.99]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:scale-[0.99]",
        ghost: "hover:bg-secondary hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gold: "bg-brand-gold text-brand-navy font-semibold shadow-xs hover:bg-brand-gold-hover active:scale-[0.98]",
        pill: "rounded-full bg-primary text-primary-foreground font-medium tracking-tight shadow-sm hover:bg-brand-navy-deep active:scale-[0.98]",
        "pill-gold":
          "rounded-full bg-brand-gold text-brand-navy font-semibold tracking-tight shadow-sm hover:bg-brand-gold-hover active:scale-[0.98]",
        "pill-outline":
          "rounded-full border border-border text-foreground font-medium tracking-tight bg-background/80 hover:border-brand-navy hover:text-brand-navy active:scale-[0.98]",
        "pill-light":
          "rounded-full bg-white text-brand-navy font-medium tracking-tight shadow-sm hover:bg-brand-gold-soft active:scale-[0.98]",
        "text-link":
          "h-auto px-0 text-brand-navy font-medium tracking-tight hover:underline underline-offset-4 inline-flex items-center gap-1",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9 w-9",
        pill: "h-11 px-6 text-[15px]",
        "pill-sm": "h-8 px-4 text-xs",
        inline: "h-auto p-0 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
