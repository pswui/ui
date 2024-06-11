import React, { useState } from "react";
import { VariantProps, vcn } from "@pswui-lib";

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
    VariantProps<typeof tooltipVariant> {}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
  const [variantProps, rest] = resolveTooltipVariantProps(props);
  const contextState = useState<TooltipContextBody>({
    ...tooltipContextInitial,
    ...variantProps,
  });

  return (
    <TooltipContext.Provider value={contextState}>
      <div ref={ref} className={tooltipVariant(variantProps)} {...rest} />
    </TooltipContext.Provider>
  );
});

const tooltipContentColors = {
  background: "bg-white dark:bg-black",
  border: "border-neutral-200 dark:border-neutral-700",
};

const [tooltipContentVariant, resolveTooltipContentVariantProps] = vcn({
  base: `absolute py-1 px-3 rounded-md ${tooltipContentColors.background} border ${tooltipContentColors.border} opacity-0 transition-all 
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
  },
  defaults: {
    position: "top",
    offset: "md",
    delay: "normal",
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
        {...rest}
      />
    );
  },
);

export { Tooltip, TooltipContent };
