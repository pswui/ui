import { type AsChild, Slot, type VariantProps, vcn } from "@pswui-lib";
import React, { useContext, useEffect, useRef } from "react";

interface IPopoverContext {
  controlled: boolean;
  opened: boolean;
}

const PopoverContext = React.createContext<
  [IPopoverContext, React.Dispatch<React.SetStateAction<IPopoverContext>>]
>([
  {
    opened: false,
    controlled: false,
  },
  () => {
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
      console.warn(
        "It seems like you're using PopoverContext outside of a provider.",
      );
    }
  },
]);

interface PopoverProps extends AsChild {
  children: React.ReactNode;
  opened?: boolean;
}

const Popover = ({ children, opened, asChild }: PopoverProps) => {
  const [state, setState] = React.useState<IPopoverContext>({
    opened: opened ?? false,
    controlled: opened !== undefined,
  });

  useEffect(() => {
    setState((p) => ({
      ...p,
      controlled: opened !== undefined,
      opened: opened !== undefined ? opened : p.opened,
    }));
  }, [opened]);

  const Comp = asChild ? Slot : "div";

  return (
    <PopoverContext.Provider value={[state, setState]}>
      <Comp className="relative">{children}</Comp>
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = ({ children }: { children: React.ReactNode }) => {
  const [_, setState] = React.useContext(PopoverContext);
  function setOpen() {
    setState((prev) => ({ ...prev, opened: true }));
  }

  return <Slot onClick={setOpen}>{children}</Slot>;
};

const popoverColors = {
  background: "bg-white dark:bg-black",
  border: "border-neutral-200 dark:border-neutral-800",
};

const [popoverContentVariant, resolvePopoverContentVariantProps] = vcn({
  base: `absolute transition-all duration-150 border rounded-lg p-0.5 [&>*]:w-full ${popoverColors.background} ${popoverColors.border}`,
  variants: {
    direction: {
      row: "",
      col: "",
    },
    anchor: {
      start: "",
      middle: "",
      end: "",
    },
    align: {
      start: "",
      middle: "",
      end: "",
    },
    position: {
      start: "",
      end: "",
    },
    offset: {
      sm: "[--popover-offset:2px]",
      md: "[--popover-offset:4px]",
      lg: "[--popover-offset:8px]",
    },
    opened: {
      true: "opacity-1 scale-100 pointer-events-auto select-auto touch-auto",
      false: "opacity-0 scale-75 pointer-events-none select-none touch-none",
    },
  },
  defaults: {
    direction: "col",
    anchor: "middle",
    align: "middle",
    position: "end",
    opened: false,
    offset: "md",
  },
  dynamics: [
    function originClass({ direction, anchor, position }) {
      switch (`${direction} ${position} ${anchor}` as const) {
        // left
        case "row start start":
          return "origin-top-right";
        case "row start middle":
          return "origin-right";
        case "row start end":
          return "origin-bottom-right";
        // right
        case "row end start":
          return "origin-top-left";
        case "row end middle":
          return "origin-left";
        case "row end end":
          return "origin-bottom-left";
        // top
        case "col start start":
          return "origin-bottom-left";
        case "col start middle":
          return "origin-bottom";
        case "col start end":
          return "origin-bottom-right";
        // bottom
        case "col end start":
          return "origin-top-left";
        case "col end middle":
          return "origin-top";
        case "col end end":
          return "origin-top-right";
      }
    },
    function basePositionClass({ position, direction }) {
      switch (`${direction} ${position}` as const) {
        case "col start":
          return "bottom-[calc(100%+var(--popover-offset))]";
        case "col end":
          return "top-[calc(100%+var(--popover-offset))]";
        case "row start":
          return "right-[calc(100%+var(--popover-offset))]";
        case "row end":
          return "left-[calc(100%+var(--popover-offset))]";
      }
    },
    function directionPositionClass({ direction, anchor, align }) {
      switch (`${direction} ${anchor} ${align}` as const) {
        case "col start start":
          return "left-0";
        case "col start middle":
          return "left-1/2";
        case "col start end":
          return "left-full";
        case "col middle start":
          return "left-0 -translate-x-1/2";
        case "col middle middle":
          return "left-1/2 -translate-x-1/2";
        case "col middle end":
          return "right-0 translate-x-1/2";
        case "col end start":
          return "right-full";
        case "col end middle":
          return "right-1/2";
        case "col end end":
          return "right-0";
        case "row start start":
          return "top-0";
        case "row start middle":
          return "top-1/2";
        case "row start end":
          return "top-full";
        case "row middle start":
          return "top-0 -translate-y-1/2";
        case "row middle middle":
          return "top-1/2 -translate-y-1/2";
        case "row middle end":
          return "bottom-0 translate-y-1/2";
        case "row end start":
          return "bottom-full";
        case "row end middle":
          return "bottom-1/2";
        case "row end end":
          return "bottom-0";
      }
    },
  ],
});

interface PopoverContentProps
  extends Omit<VariantProps<typeof popoverContentVariant>, "opened">,
    React.ComponentPropsWithoutRef<"div">,
    AsChild {}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolvePopoverContentVariantProps(props);
    const { children, ...otherPropsExtracted } = otherPropsCompressed;
    const [state, setState] = useContext(PopoverContext);

    const internalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      function handleOutsideClick(e: MouseEvent) {
        if (
          internalRef.current &&
          !internalRef.current.contains(e.target as Node | null)
        ) {
          setState((prev) => ({ ...prev, opened: false }));
        }
      }
      !state.controlled &&
        document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, [state.controlled, setState]);

    return (
      <div
        {...otherPropsExtracted}
        className={popoverContentVariant({
          ...variantProps,
          opened: state.opened,
        })}
        ref={(el) => {
          internalRef.current = el;
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
      >
        {children}
      </div>
    );
  },
);

export { Popover, PopoverTrigger, PopoverContent };
