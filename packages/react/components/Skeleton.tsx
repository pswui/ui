import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const [skeletonVariant, resolveSkeletonVariantProps] = vcn({
  base: "block animate-pulse bg-neutral-200 dark:bg-neutral-800",
  variants: {
    shape: {
      rectangle: "rounded-md",
      circle: "rounded-full",
      text: "rounded-md",
    },
    size: {
      sm: "h-3 w-full",
      md: "h-4 w-full",
      lg: "h-6 w-full",
      icon: "size-10",
    },
  },
  defaults: {
    shape: "rectangle",
    size: "md",
  },
});

interface SkeletonProps
  extends VariantProps<typeof skeletonVariant>,
    Omit<React.ComponentPropsWithoutRef<"div">, "className"> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveSkeletonVariantProps(props);
    const { "aria-hidden": ariaHidden, ...otherPropsExtracted } =
      otherPropsCompressed;

    return (
      <div
        ref={ref}
        aria-hidden={ariaHidden ?? true}
        className={skeletonVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
