import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[15px] font-semibold cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-brand-navy-deep active:scale-[0.99]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 active:scale-[0.99]",
        outline:
          "border border-primary text-primary bg-transparent shadow-2xs hover:bg-primary/10 hover:text-primary active:scale-[0.99]",
        secondary:
          "bg-secondary text-secondary-foreground border border-border shadow-2xs hover:bg-secondary/80 active:scale-[0.99]",
        ghost: "hover:bg-secondary hover:text-foreground",
        link: "text-accent underline-offset-4 hover:underline hover:text-brand-gold-hover",
        gold: "bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-brand-navy-deep active:scale-[0.98]",
        pill: "rounded-full bg-primary text-primary-foreground font-semibold tracking-tight shadow-xs hover:bg-brand-navy-deep active:scale-[0.98]",
        "pill-gold":
          "rounded-full bg-primary text-primary-foreground font-semibold tracking-tight shadow-xs hover:bg-brand-navy-deep active:scale-[0.98]",
        "pill-outline":
          "rounded-full border border-primary text-primary font-semibold tracking-tight bg-transparent hover:bg-primary/10 hover:text-primary active:scale-[0.98]",
        "pill-terracotta":
          "rounded-full bg-accent text-accent-foreground font-semibold tracking-tight shadow-xs hover:bg-brand-gold-hover active:scale-[0.98]",
        "pill-light":
          "rounded-full bg-secondary text-secondary-foreground font-semibold tracking-tight border border-border shadow-xs hover:bg-white active:scale-[0.98]",
        "text-link":
          "h-auto px-0 text-accent font-semibold tracking-tight hover:underline underline-offset-4 inline-flex items-center gap-1 hover:text-brand-gold-hover",
      },
      size: {
        default: "h-9.5 px-4 py-2 text-[15px]",
        sm: "h-8.5 rounded-md px-3.5 text-sm",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9.5 w-9.5",
        pill: "h-11 px-6 text-[15px]",
        "pill-sm": "h-8.5 px-4 text-sm",
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
