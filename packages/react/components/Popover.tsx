import React, { useContext, useEffect, useRef } from "react";
import { AsChild, Slot, VariantProps, vcn } from "@pswui-lib";

interface IPopoverContext {
  opened: boolean;
}

const PopoverContext = React.createContext<
  [IPopoverContext, React.Dispatch<React.SetStateAction<IPopoverContext>>]
>([
  {
    opened: false,
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
  const state = React.useState<IPopoverContext>({
    opened: opened ?? false,
  });

  const Comp = asChild ? Slot : "div";

  return (
    <PopoverContext.Provider value={state}>
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
    anchor: {
      topLeft:
        "bottom-[calc(100%+var(--popover-offset))] right-[calc(100%+var(--popover-offset))] origin-bottom-right",
      topCenter:
        "bottom-[calc(100%+var(--popover-offset))] left-1/2 -translate-x-1/2 origin-bottom-center",
      topRight:
        "bottom-[calc(100%+var(--popover-offset))] left-[calc(100%+var(--popover-offset))] origin-bottom-left",
      middleLeft: "top-1/2 translate-y-1/2 right-full origin-right",
      middleCenter:
        "top-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 origin-center",
      middleRight:
        "top-1/2 translate-y-1/2 left-[calc(100%+var(--popover-offset))] origin-left",
      bottomLeft:
        "top-[calc(100%+var(--popover-offset))] right-[calc(100%+var(--popover-offset))] origin-top-right",
      bottomCenter:
        "top-[calc(100%+var(--popover-offset))] left-1/2 -translate-x-1/2 origin-top-center",
      bottomRight:
        "top-[calc(100%+var(--popover-offset))] left-[calc(100%+var(--popover-offset))] origin-top-left",
    },
    offset: {
      sm: "[--popover-offset:2px]",
      md: "[--popover-offset:4px]",
      lg: "[--popover-offset:8px]",
    },
    opened: {
      true: "opacity-1 scale-100",
      false: "opacity-0 scale-75",
    },
  },
  defaults: {
    anchor: "bottomCenter",
    opened: false,
    offset: "md",
  },
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
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, [internalRef, setState]);

    return (
      <div
        {...otherPropsExtracted}
        className={popoverContentVariant({
          ...variantProps,
          opened: state.opened,
        })}
        ref={(el) => {
          internalRef.current = el;
          typeof ref === "function" ? ref(el) : ref && (ref.current = el);
        }}
      >
        {children}
      </div>
    );
  },
);

export { Popover, PopoverTrigger, PopoverContent };
