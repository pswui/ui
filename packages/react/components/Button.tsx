import React from "react";
import { vcn, VariantProps, Slot, AsChild } from "@pswui-lib/shared@1.0.0";

const colors = {
  outline: {
    focus: "dark:focus-visible:outline-white/20 focus-visible:outline-black/10",
  },
  border: {
    default: "border-neutral-300 dark:border-neutral-700",
    success: "border-green-400 dark:border-green-600",
    warning: "border-yellow-400 dark:border-yellow-600",
    danger: "border-red-400 dark:border-red-600",
  },
  background: {
    default:
      "bg-white dark:bg-black hover:bg-neutral-200 dark:hover:bg-neutral-800",
    ghost:
      "bg-black/0 dark:bg-white/0 hover:bg-black/20 dark:hover:bg-white/20",
    success:
      "bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800",
    warning:
      "bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800",
    danger: "bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800",
  },
  underline: "decoration-current",
};

const [buttonVariants, resolveVariants] = vcn({
  base: `w-fit flex flex-row items-center justify-between rounded-md outline outline-1 outline-transparent outline-offset-2 ${colors.outline.focus} transition-all`,
  variants: {
    size: {
      link: "p-0 text-base",
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
      icon: "p-2 text-base",
    },
    border: {
      none: "border-0",
      solid: `border ${colors.border.default}`,
      success: `border ${colors.border.success}`,
      warning: `border ${colors.border.warning}`,
      danger: `border ${colors.border.danger}`,
    },
    background: {
      default: colors.background.default,
      ghost: colors.background.ghost,
      success: colors.background.success,
      warning: colors.background.warning,
      danger: colors.background.danger,
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
      size: "link",
    },
    success: {
      border: "success",
      background: "success",
      decoration: "none",
      size: "md",
    },
    warning: {
      border: "warning",
      background: "warning",
      decoration: "none",
      size: "md",
    },
    danger: {
      border: "danger",
      background: "danger",
      decoration: "none",
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
    const [variantProps, otherPropsCompressed] = resolveVariants(props);
    const { asChild, ...otherPropsExtracted } = otherPropsCompressed;

    const Comp = asChild ? Slot : "button";
    const compProps = {
      ...otherPropsExtracted,
      className: buttonVariants(variantProps),
    };

    return <Comp ref={ref} {...compProps} />;
  },
);

export { Button };
