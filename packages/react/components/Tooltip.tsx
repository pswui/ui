import { type AsChild, Slot, type VariantProps, vcn } from "@pswui-lib";
import React, { useState } from "react";

interface TooltipContextBody {
  position: "top" | "bottom" | "left" | "right";
}

const tooltipContextInitial: TooltipContextBody = {
  position: "top",
};
const TooltipContext = React.createContext<
  [TooltipContextBody, React.Dispatch<React.SetStateAction<TooltipContextBody>>]
>([
  tooltipContextInitial,
  () => {
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
      console.warn(
        "It seems like you're using TooltipContext outside of a provider.",
      );
    }
  },
]);

const [tooltipVariant, resolveTooltipVariantProps] = vcn({
  base: "w-fit h-fit relative group/tooltip",
  variants: {
    position: {
      top: "",
      bottom: "",
      left: "",
      right: "",
    },
    controlled: {
      true: "controlled",
      false: "",
    },
    opened: {
      true: "opened",
      false: "",
    },
  },
  defaults: {
    position: "top",
    controlled: false,
    opened: false,
  },
});

interface TooltipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipVariant>,
    AsChild {}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
  const [variantProps, rest] = resolveTooltipVariantProps(props);
  const { asChild, ...extractedRest } = rest;
  const contextState = useState<TooltipContextBody>({
    ...tooltipContextInitial,
    ...variantProps,
  });

  const Comp = asChild ? Slot : "div";

  return (
    <TooltipContext.Provider value={contextState}>
      <Comp
        ref={ref}
        className={tooltipVariant(variantProps)}
        {...extractedRest}
      />
    </TooltipContext.Provider>
  );
});
Tooltip.displayName = "Tooltip";

const tooltipContentColors = {
  variants: {
    default:
      "bg-white dark:bg-black border-neutral-200 dark:border-neutral-700",
    error: "bg-red-400 dark:bg-red-800 border-red-500 text-white",
    success: "bg-green-400 dark:bg-green-800 border-green-500 text-white",
    warning: "bg-yellow-400 dark:bg-yellow-800 border-yellow-500",
  },
};

const [tooltipContentVariant, resolveTooltipContentVariantProps] = vcn({
  base: `absolute py-1 px-3 rounded-md border opacity-0 transition-all
  group-[:not(.controlled):hover]/tooltip:opacity-100 group-[.opened]/tooltip:opacity-100
  select-none pointer-events-none
  group-[:not(.controlled):hover]/tooltip:select-auto group-[.opened]/tooltip:select-auto group-[:not(.controlled):hover]/tooltip:pointer-events-auto group-[.opened]/tooltip:pointer-events-auto
  group-[:not(.controlled):hover]/tooltip:[transition:transform_150ms_ease-out_var(--delay),opacity_150ms_ease-out_var(--delay),background-color_150ms_ease-in-out,color_150ms_ease-in-out,border-color_150ms_ease-in-out]`,
  variants: {
    position: {
      top: "bottom-[calc(100%+var(--tooltip-offset))] left-1/2 -translate-x-1/2 group-[:not(.controlled):hover]/tooltip:translate-y-0 group-[.opened]/tooltip:translate-y-0 translate-y-[10px]",
      bottom:
        "top-[calc(100%+var(--tooltip-offset))] left-1/2 -translate-x-1/2 group-[:not(.controlled):hover]/tooltip:translate-y-0 group-[.opened]/tooltip:translate-y-0 translate-y-[-10px]",
      left: "right-[calc(100%+var(--tooltip-offset))] top-1/2 -translate-y-1/2 group-[:not(.controlled):hover]/tooltip:translate-x-0 group-[.opened]/tooltip:translate-x-0 translate-x-[10px]",
      right:
        "left-[calc(100%+var(--tooltip-offset))] top-1/2 -translate-y-1/2 group-[:not(.controlled):hover]/tooltip:translate-x-0 group-[.opened]/tooltip:translate-x-0 translate-x-[-10px]",
    },
    delay: {
      none: "[--delay:0ms]",
      early: "[--delay:150ms]",
      normal: "[--delay:500ms]",
      late: "[--delay:1000ms]",
    },
    offset: {
      sm: "[--tooltip-offset:2px]",
      md: "[--tooltip-offset:4px]",
      lg: "[--tooltip-offset:8px]",
    },
    status: {
      normal: tooltipContentColors.variants.default,
      error: tooltipContentColors.variants.error,
      success: tooltipContentColors.variants.success,
      warning: tooltipContentColors.variants.warning,
    },
  },
  defaults: {
    position: "top",
    offset: "md",
    delay: "normal",
    status: "normal",
  },
});

interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof tooltipContentVariant>, "position"> {}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (props, ref) => {
    const [variantProps, rest] = resolveTooltipContentVariantProps(props);
    const [contextState] = React.useContext(TooltipContext);

    return (
      <div
        ref={ref}
        className={tooltipContentVariant({
          ...variantProps,
          position: contextState.position,
        })}
        role="tooltip"
        {...rest}
      />
    );
  },
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipContent };
