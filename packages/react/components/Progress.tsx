import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const [progressVariant, resolveProgressVariantProps] = vcn({
  base: "h-2 w-full overflow-hidden rounded-md border-0 bg-neutral-200 dark:bg-neutral-800 [&::-moz-progress-bar]:bg-neutral-900 [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-neutral-900 dark:[&::-moz-progress-bar]:bg-neutral-100 dark:[&::-webkit-progress-value]:bg-neutral-100",
  variants: {
    size: {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    },
  },
  defaults: {
    size: "md",
  },
});

interface ProgressProps
  extends VariantProps<typeof progressVariant>,
    Omit<
      React.ComponentPropsWithoutRef<"progress">,
      "className" | "max" | "value"
    > {
  max?: number;
  value?: number | null;
}

const Progress = React.forwardRef<HTMLProgressElement, ProgressProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveProgressVariantProps(props);
    const { max = 100, value, ...otherPropsExtracted } = otherPropsCompressed;

    const resolvedMax = Number.isFinite(max) && max > 0 ? max : 100;
    const isDeterminate = typeof value === "number" && Number.isFinite(value);
    const resolvedValue = isDeterminate
      ? Math.min(Math.max(value, 0), resolvedMax)
      : undefined;

    return (
      <progress
        {...otherPropsExtracted}
        ref={ref}
        max={resolvedMax}
        value={resolvedValue}
        aria-valuemin={0}
        aria-valuemax={resolvedMax}
        aria-valuenow={resolvedValue}
        className={progressVariant(variantProps)}
      />
    );
  },
);
Progress.displayName = "Progress";

export { Progress };
