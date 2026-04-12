import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const [separatorVariant, resolveSeparatorVariantProps] = vcn({
  base: "shrink-0 bg-neutral-200 dark:bg-neutral-800",
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px self-stretch",
    },
  },
  defaults: {
    orientation: "horizontal",
  },
});

interface SeparatorProps
  extends VariantProps<typeof separatorVariant>,
    Omit<React.ComponentPropsWithoutRef<"div">, "className"> {
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveSeparatorVariantProps(props);
    const {
      decorative,
      role,
      "aria-hidden": ariaHidden,
      "aria-orientation": ariaOrientation,
      ...otherPropsExtracted
    } = otherPropsCompressed;

    const orientation = variantProps.orientation ?? "horizontal";
    const ariaOrientationValue =
      orientation === "vertical"
        ? ariaOrientation ?? "vertical"
        : ariaOrientation;

    return (
      <div
        ref={ref}
        role={decorative ? "none" : role ?? "separator"}
        aria-hidden={decorative ? true : ariaHidden}
        aria-orientation={decorative ? undefined : ariaOrientationValue}
        className={separatorVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
Separator.displayName = "Separator";

export { Separator };
