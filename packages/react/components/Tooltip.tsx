import { type AsChild, Slot, type VariantProps, vcn } from "@pswui-lib";
import React from "react";

interface TooltipContextBody {
  position: "top" | "bottom" | "left" | "right";
  opened: boolean;
  controlled: boolean;
}

const tooltipContextInitial: TooltipContextBody = {
  position: "top",
  opened: false,
  controlled: false,
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
  const {
    asChild,
    onBlur,
    onFocus,
    onMouseEnter,
    onMouseLeave,
    ...extractedRest
  } = rest;
  const internalRef = React.useRef<HTMLElement | null>(null);
  const isControlled = variantProps.controlled || props.opened !== undefined;
  const [contextState, setContextState] = React.useState<TooltipContextBody>({
    ...tooltipContextInitial,
    position: variantProps.position ?? tooltipContextInitial.position,
    opened: props.opened ?? false,
    controlled: isControlled,
  });

  React.useEffect(() => {
    setContextState((prev) => ({
      ...prev,
      position: variantProps.position ?? tooltipContextInitial.position,
      controlled: isControlled,
      opened: isControlled ? props.opened ?? false : prev.opened,
    }));
  }, [isControlled, props.opened, variantProps.position]);

  function setOpen(opened: boolean) {
    if (!isControlled) {
      setContextState((prev) => ({ ...prev, opened }));
    }
  }

  const handleMouseEnter: React.MouseEventHandler<HTMLDivElement> = (event) => {
    onMouseEnter?.(event);
    setOpen(true);
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = (event) => {
    onMouseLeave?.(event);
    setOpen(false);
  };

  const handleFocus: React.FocusEventHandler<HTMLDivElement> = (event) => {
    onFocus?.(event);
    setOpen(true);
  };

  const handleBlur: React.FocusEventHandler<HTMLDivElement> = (event) => {
    onBlur?.(event);
    if (internalRef.current?.contains(event.relatedTarget as Node | null)) {
      return;
    }
    setOpen(false);
  };

  const Comp = asChild ? Slot : "div";

  return (
    <TooltipContext.Provider value={[contextState, setContextState]}>
      <Comp
        ref={(element: HTMLElement | null) => {
          internalRef.current = element;
          if (typeof ref === "function") {
            ref(element as HTMLDivElement | null);
          } else if (ref) {
            ref.current = element as HTMLDivElement | null;
          }
        }}
        className={tooltipVariant({
          ...variantProps,
          controlled: isControlled,
          opened: contextState.opened,
        })}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
  base: `absolute py-1 px-3 rounded-md border opacity-0 select-none pointer-events-none
  [transition:transform_150ms_ease-out_var(--delay),opacity_150ms_ease-out_var(--delay),background-color_150ms_ease-in-out,color_150ms_ease-in-out,border-color_150ms_ease-in-out]`,
  variants: {
    position: {
      top: "bottom-[calc(100%+var(--tooltip-offset))] left-1/2 -translate-x-1/2",
      bottom:
        "top-[calc(100%+var(--tooltip-offset))] left-1/2 -translate-x-1/2",
      left: "right-[calc(100%+var(--tooltip-offset))] top-1/2 -translate-y-1/2",
      right: "left-[calc(100%+var(--tooltip-offset))] top-1/2 -translate-y-1/2",
    },
    opened: {
      true: "opacity-100 select-auto pointer-events-auto",
      false: "opacity-0 select-none pointer-events-none",
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
    opened: false,
    offset: "md",
    delay: "normal",
    status: "normal",
  },
  dynamics: [
    ({ position, opened }) => {
      switch (position) {
        case "top":
          return opened ? "translate-y-0" : "translate-y-[10px]";
        case "bottom":
          return opened ? "translate-y-0" : "translate-y-[-10px]";
        case "left":
          return opened ? "translate-x-0" : "translate-x-[10px]";
        case "right":
          return opened ? "translate-x-0" : "translate-x-[-10px]";
      }
    },
  ],
});

interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof tooltipContentVariant>, "position" | "opened"> {}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (props, ref) => {
    const [variantProps, rest] = resolveTooltipContentVariantProps(props);
    const [contextState] = React.useContext(TooltipContext);

    return (
      <div
        ref={ref}
        aria-hidden={!contextState.opened}
        className={tooltipContentVariant({
          ...variantProps,
          opened: contextState.opened,
          position: contextState.position,
        })}
        data-state={contextState.opened ? "open" : "closed"}
        hidden={!contextState.opened}
        role="tooltip"
        {...rest}
      />
    );
  },
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipContent };
