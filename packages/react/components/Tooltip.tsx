import React, { useState } from "react";
import { VariantProps, vcn } from "../shared";

interface TooltipContextBody {
  position: "top" | "bottom" | "left" | "right";
}

const Tooltip$Context$InitialState: TooltipContextBody = {
  position: "top",
};
const Tooltip$Context = React.createContext<
  [TooltipContextBody, React.Dispatch<React.SetStateAction<TooltipContextBody>>]
>([
  Tooltip$Context$InitialState,
  () => {
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
      console.warn(
        "It seems like you're using TooltipContext outside of a provider."
      );
    }
  },
]);

const [Tooltip$Variant, Tooltip$resolveVariantProps] = vcn({
  base: "w-fit h-fit relative group/tooltip",
  variants: {
    position: {
      top: "",
      bottom: "",
      left: "",
      right: "",
    },
  },
  defaults: {
    position: "top",
  },
});

interface TooltipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof Tooltip$Variant> {}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
  const [variantProps, rest] = Tooltip$resolveVariantProps(props);
  const contextState = useState<TooltipContextBody>({
    ...Tooltip$Context$InitialState,
    ...variantProps,
  });

  return (
    <Tooltip$Context.Provider value={contextState}>
      <div ref={ref} className={Tooltip$Variant(variantProps)} {...rest} />
    </Tooltip$Context.Provider>
  );
});

const [TooltipContent$Variant, TooltipContent$resolveVariantProps] = vcn({
  base: "absolute py-1 px-3 bg-white dark:bg-black border border-black/10 dark:border-white/20 [--tooltip-offset:2px] opacity-0 group-hover/tooltip:opacity-100 pointer-events-none group-hover/tooltip:pointer-events-auto transition-all rounded-md",
  variants: {
    position: {
      top: "bottom-[calc(100%+var(--tooltip-offset))] left-1/2 -translate-x-1/2 group-hover/tooltip:translate-y-0 translate-y-[10px]",
      bottom:
        "top-[calc(100%+var(--tooltip-offset))] left-1/2 -translate-x-1/2 group-hover/tooltip:translate-y-0 translate-y-[-10px]",
      left: "right-[calc(100%+var(--tooltip-offset))] top-1/2 -translate-y-1/2 group-hover/tooltip:translate-x-0 translate-x-[10px]",
      right:
        "left-[calc(100%+var(--tooltip-offset))] top-1/2 -translate-y-1/2 group-hover/tooltip:translate-x-0 translate-x-[-10px]",
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
  },
});

interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof TooltipContent$Variant>, "position"> {}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (props, ref) => {
    const [variantProps, rest] = TooltipContent$resolveVariantProps(props);
    const [contextState] = React.useContext(Tooltip$Context);

    return (
      <div
        ref={ref}
        className={TooltipContent$Variant({
          ...variantProps,
          position: contextState.position,
        })}
        {...rest}
      />
    );
  }
);

export { Tooltip, TooltipContent };
