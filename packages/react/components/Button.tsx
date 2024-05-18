import React from "react";
import { vcn, VariantProps } from "../shared";

const variants = vcn({
  base: "flex flex-row items-center justify-between rounded-md",
  variants: {
    variant: {
      default:
        "bg-white border border-gray-300 dark:bg-black dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors",
      ghost:
        "bg-black/0 hover:bg-black/20 dark:bg-white/0 dark:hover:bg-white/10 transition-colors",
    },
    size: {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
    },
  },
  defaults: {
    variant: "default",
    size: "md",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <button ref={ref} {...props} className={variants(props)} />;
  }
);

export { Button, variants as buttonVariants };
