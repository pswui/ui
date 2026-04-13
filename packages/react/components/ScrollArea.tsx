import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const [scrollAreaVariant, resolveScrollAreaVariantProps] = vcn({
  base: "relative overscroll-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-neutral-700 dark:focus-visible:ring-offset-black [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700",
  variants: {
    orientation: {
      vertical: "overflow-y-auto overflow-x-hidden",
      horizontal: "overflow-x-auto overflow-y-hidden",
      both: "overflow-auto",
    },
  },
  defaults: {
    orientation: "vertical",
  },
});

interface ScrollAreaProps
  extends VariantProps<typeof scrollAreaVariant>,
    React.ComponentPropsWithoutRef<"div"> {}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveScrollAreaVariantProps(props);
    const { tabIndex, ...otherPropsExtracted } = otherPropsCompressed;

    const orientation = variantProps.orientation ?? "vertical";

    return (
      <div
        ref={ref}
        data-orientation={orientation}
        tabIndex={tabIndex ?? 0}
        className={scrollAreaVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
