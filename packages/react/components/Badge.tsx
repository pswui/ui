import { type AsChild, Slot, type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const badgeColors = {
  default:
    "border-neutral-300 bg-neutral-100 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100",
  success:
    "border-green-300 bg-green-100 text-green-900 dark:border-green-700 dark:bg-green-900 dark:text-green-100",
  warning:
    "border-yellow-300 bg-yellow-100 text-yellow-900 dark:border-yellow-700 dark:bg-yellow-900 dark:text-yellow-100",
  danger:
    "border-red-300 bg-red-100 text-red-900 dark:border-red-700 dark:bg-red-900 dark:text-red-100",
};

const [badgeVariant, resolveBadgeVariantProps] = vcn({
  base: "inline-flex w-fit items-center rounded-md border font-medium leading-none",
  variants: {
    size: {
      sm: "px-1.5 py-0.5 text-xs",
      md: "px-2 py-1 text-sm",
    },
    status: {
      default: badgeColors.default,
      success: badgeColors.success,
      warning: badgeColors.warning,
      danger: badgeColors.danger,
    },
  },
  defaults: {
    size: "md",
    status: "default",
  },
});

interface BadgeProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "className">,
    VariantProps<typeof badgeVariant>,
    AsChild {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
  const [variantProps, otherPropsCompressed] = resolveBadgeVariantProps(props);
  const { asChild, ...otherPropsExtracted } = otherPropsCompressed;

  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      ref={ref}
      className={badgeVariant(variantProps)}
      {...otherPropsExtracted}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
