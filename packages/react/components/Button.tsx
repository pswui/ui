import React from "react";
import { vcn, VariantProps, Slot, AsChild } from "../shared";

const colors = {
  outlineFocus: "focus-visible:outline-neutral-500",
  outline: "outline-neutral-300 dark:outline-neutral-700",
  border: "border-neutral-300 dark:border-neutral-700",
  background: {
    default:
      "bg-white dark:bg-black hover:bg-neutral-100 dark:hover:bg-neutral-800",
    ghost:
      "bg-black/0 dark:bg-white/0 hover:bg-black/20 dark:hover:bg-white/20",
  },
  underline: "decoration-black dark:decoration-white",
};

const [buttonVariants, resolveVariants] = vcn({
  base: `w-fit flex flex-row items-center justify-between rounded-md outline outline-1 outline-transparent outline-offset-2 ${colors.outlineFocus} transition-all`,
  variants: {
    size: {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
    },
    border: {
      none: "outline-none",
      solid: `border ${colors.border}`,
      outline: `outline outline-1 ${colors.outline}`,
    },
    background: {
      default: colors.background.default,
      ghost: colors.background.ghost,
      transparent: "bg-transparent hover:bg-transparent",
    },
    decoration: {
      none: "no-underline",
      link: `underline decoration-1 underline-offset-2 hover:underline-offset-4 ${colors.underline}`,
    },
  },
  defaults: {
    size: "md",
    border: "solid",
    background: "default",
    decoration: "none",
  },
  presets: {
    default: {
      border: "solid",
      background: "default",
      decoration: "none",
      size: "md",
    },
    ghost: {
      border: "none",
      background: "ghost",
      decoration: "none",
      size: "md",
    },
    link: {
      border: "none",
      background: "transparent",
      decoration: "link",
      size: "md",
    },
  },
});

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "className">,
    VariantProps<typeof buttonVariants>,
    AsChild {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const [variantProps, otherProps] = resolveVariants(props);

    const Comp = otherProps.asChild ? Slot : "button";
    const compProps = {
      ...otherProps,
      className: buttonVariants(variantProps),
    };

    return <Comp ref={ref} {...compProps} />;
  }
);

export { Button };
