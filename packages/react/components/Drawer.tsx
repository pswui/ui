"use client";

import {
  type AsChild,
  Slot,
  type VariantProps,
  useAnimatedMount,
  useDocument,
  vcn,
} from "@pswui-lib";
import React, {
  type ComponentPropsWithoutRef,
  type TouchEvent as ReactTouchEvent,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface IDrawerContext {
  opened: boolean;
  closeThreshold: number;
  movePercentage: number;
  isDragging: boolean;
  isMounted: boolean;
  isRendered: boolean;
  leaveWhileDragging: boolean;
}
const DrawerContextInitial: IDrawerContext = {
  opened: false,
  closeThreshold: 0.3,
  movePercentage: 0,
  isDragging: false,
  isMounted: false,
  isRendered: false,
  leaveWhileDragging: false,
};
const DrawerContext = React.createContext<
  [IDrawerContext, React.Dispatch<React.SetStateAction<IDrawerContext>>]
>([
  DrawerContextInitial,
  () => {
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
      console.warn(
        "It seems like you're using DrawerContext outside of a provider.",
      );
    }
  },
]);

interface DrawerRootProps {
  children: React.ReactNode;
  closeThreshold?: number;
  opened?: boolean;
}

const DrawerRoot = ({ children, closeThreshold, opened }: DrawerRootProps) => {
  const state = useState<IDrawerContext>({
    ...DrawerContextInitial,
    opened: opened ?? DrawerContextInitial.opened,
    closeThreshold: closeThreshold ?? DrawerContextInitial.closeThreshold,
  });
  const setState = state[1];

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      opened: opened ?? prev.opened,
      closeThreshold: closeThreshold ?? prev.closeThreshold,
    }));
  }, [closeThreshold, opened, setState]);

  return (
    <DrawerContext.Provider value={state}>{children}</DrawerContext.Provider>
  );
};

const DrawerTrigger = ({ children }: { children: React.ReactNode }) => {
  const [_, setState] = useContext(DrawerContext);

  function onClick() {
    setState((prev) => ({ ...prev, opened: true }));
  }

  return <Slot onClick={onClick}>{children}</Slot>;
};

const [drawerOverlayVariant, resolveDrawerOverlayVariantProps] = vcn({
  base: "fixed inset-0 transition-[backdrop-filter] duration-75",
  variants: {
    opened: {
      true: "pointer-events-auto select-auto touch-none", // touch-none to prevent outside scrolling
      false: "pointer-events-none select-none",
    },
  },
  defaults: {
    opened: false,
  },
});

const DRAWER_OVERLAY_BACKDROP_FILTER_BRIGHTNESS = 0.3;

interface DrawerOverlayProps
  extends Omit<VariantProps<typeof drawerOverlayVariant>, "opened">,
    AsChild,
    ComponentPropsWithoutRef<"div"> {}

const DrawerOverlay = forwardRef<HTMLDivElement, DrawerOverlayProps>(
  (props, ref) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const [state, setState] = useContext(DrawerContext);

    const { isMounted, isRendered } = useAnimatedMount(
      state.isDragging ? true : state.opened,
      internalRef,
    );

    const [variantProps, restPropsCompressed] =
      resolveDrawerOverlayVariantProps(props);
    const { asChild, ...restPropsExtracted } = restPropsCompressed;

    function onOutsideClick() {
      if (state.leaveWhileDragging) {
        setState((prev) => ({ ...prev, leaveWhileDragging: false }));
        return;
      }
      setState((prev) => ({ ...prev, opened: false }));
    }

    const Comp = asChild ? Slot : "div";
    const backdropFilter = `brightness(${
      state.isDragging
        ? state.movePercentage + DRAWER_OVERLAY_BACKDROP_FILTER_BRIGHTNESS
        : state.opened
          ? DRAWER_OVERLAY_BACKDROP_FILTER_BRIGHTNESS
          : 1
    })`;

    const document = useDocument();
    if (!document) return null;

    return (
      <>
        <DrawerContext.Provider
          value={[{ ...state, isMounted, isRendered }, setState]}
        >
          {isMounted
            ? createPortal(
                <Comp
                  {...restPropsExtracted}
                  className={drawerOverlayVariant({
                    ...variantProps,
                    opened: isRendered,
                  })}
                  onClick={onOutsideClick}
                  style={{
                    backdropFilter,
                    WebkitBackdropFilter: backdropFilter,
                    transitionDuration: state.isDragging ? "0s" : undefined,
                  }}
                  ref={(el: HTMLDivElement) => {
                    internalRef.current = el;
                    if (typeof ref === "function") {
                      ref(el);
                    } else if (ref) {
                      ref.current = el;
                    }
                  }}
                />,
                document.body,
              )
            : null}
        </DrawerContext.Provider>
      </>
    );
  },
);
DrawerOverlay.displayName = "DrawerOverlay";

const drawerContentColors = {
  background: "bg-white dark:bg-black",
  border: "border-neutral-200 dark:border-neutral-800",
};

const [drawerContentVariant, resolveDrawerContentVariantProps] = vcn({
  base: `fixed ${drawerContentColors.background} ${drawerContentColors.border} transition-all p-4 flex flex-col justify-between gap-8 overflow-auto`,
  variants: {
    position: {
      top: "top-0 w-full max-w-screen rounded-t-lg border-b-2",
      bottom: "bottom-0 w-full max-w-screen rounded-b-lg border-t-2",
      left: "left-0 h-screen rounded-l-lg border-r-2",
      right: "right-0 h-screen rounded-r-lg border-l-2",
    },
    maxSize: {
      sm: "[&.left-0]:max-w-sm [&.right-0]:max-w-sm",
      md: "[&.left-0]:max-w-md [&.right-0]:max-w-md",
      lg: "[&.left-0]:max-w-lg [&.right-0]:max-w-lg",
      xl: "[&.left-0]:max-w-xl [&.right-0]:max-w-xl",
    },
    opened: {
      true: "",
      false:
        "[&.top-0]:-translate-y-full [&.bottom-0]:translate-y-full [&.left-0]:-translate-x-full [&.right-0]:translate-x-full",
    },
    internal: {
      true: "relative",
      false: "fixed",
    },
  },
  defaults: {
    position: "left",
    opened: false,
    maxSize: "sm",
    internal: false,
  },
  dynamics: [
    ({ position, internal }) => {
      if (!internal) {
        if (["top", "bottom"].includes(position)) {
          return "inset-x-0";
        }
        return "inset-y-0";
      }

      return "w-fit";
    },
  ],
});

interface DrawerContentProps
  extends Omit<
      VariantProps<typeof drawerContentVariant>,
      "opened" | "internal"
    >,
    AsChild,
    ComponentPropsWithoutRef<"div"> {}

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  (props, ref) => {
    const [state, setState] = useContext(DrawerContext);
    const [dragState, setDragState] = useState({
      isDragging: false,
      prevTouch: { x: 0, y: 0 },
      delta: 0,
    });

    const [variantProps, restPropsCompressed] =
      resolveDrawerContentVariantProps(props);
    const { position = "left" } = variantProps;
    const { asChild, onClick, ...restPropsExtracted } = restPropsCompressed;

    const Comp = asChild ? Slot : "div";

    const internalRef = useRef<HTMLDivElement | null>(null);

    function onMouseDown() {
      setState((prev) => ({ ...prev, isDragging: true }));
      setDragState({
        isDragging: true,
        delta: 0,
        prevTouch: { x: 0, y: 0 },
      });
    }

    function onTouchStart(e: ReactTouchEvent<HTMLDivElement>) {
      setState((prev) => ({ ...prev, isDragging: true }));
      setDragState({
        isDragging: true,
        delta: 0,
        prevTouch: { x: e.touches[0].pageX, y: e.touches[0].pageY },
      });
    }

    useEffect(() => {
      function onMouseUp(e: TouchEvent): void;
      function onMouseUp(e: MouseEvent): void;
      function onMouseUp(e: TouchEvent | MouseEvent) {
        if (
          e.target instanceof Element &&
          internalRef.current &&
          internalRef.current.contains(e.target)
        ) {
          const size = ["top", "bottom"].includes(position)
            ? e.target.getBoundingClientRect().height
            : e.target.getBoundingClientRect().width;
          setState((prev) => ({
            ...prev,
            isDragging: false,
            opened:
              Math.abs(dragState.delta) > state.closeThreshold * size
                ? false
                : prev.opened,
            movePercentage: 0,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isDragging: false,
            movePercentage: 0,
          }));
        }
        setDragState({
          isDragging: false,
          delta: 0,
          prevTouch: { x: 0, y: 0 },
        });
      }

      function onMouseMove(e: TouchEvent): void;
      function onMouseMove(e: MouseEvent): void;
      function onMouseMove(e: MouseEvent | TouchEvent) {
        if (dragState.isDragging) {
          setDragState((prev) => {
            let movement = ["top", "bottom"].includes(position)
              ? "movementY" in e
                ? e.movementY
                : e.touches[0].pageY - prev.prevTouch.y
              : "movementX" in e
                ? e.movementX
                : e.touches[0].pageX - prev.prevTouch.x;
            if (
              (["top", "left"].includes(position) &&
                dragState.delta >= 0 &&
                movement > 0) ||
              (["bottom", "right"].includes(position) &&
                dragState.delta <= 0 &&
                movement < 0)
            ) {
              movement =
                movement /
                Math.abs(dragState.delta === 0 ? 1 : dragState.delta);
            }
            return {
              ...prev,
              delta: prev.delta + movement,
              ...("touches" in e
                ? {
                    prevTouch: { x: e.touches[0].pageX, y: e.touches[0].pageY },
                  }
                : {}),
            };
          });

          if (internalRef.current) {
            const size = ["top", "bottom"].includes(position)
              ? internalRef.current.getBoundingClientRect().height
              : internalRef.current.getBoundingClientRect().width;
            const movePercentage = dragState.delta / size;
            setState((prev) => ({
              ...prev,
              movePercentage: ["top", "left"].includes(position)
                ? -movePercentage
                : movePercentage,
            }));
          }
        }
      }

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onMouseMove);
      window.addEventListener("touchend", onMouseUp);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("touchmove", onMouseMove);
        window.removeEventListener("touchend", onMouseUp);
      };
    }, [state, setState, dragState, position]);

    return (
      <div
        className={drawerContentVariant({
          ...variantProps,
          opened: state.isRendered,
          className: dragState.isDragging
            ? "transition-[width] duration-0"
            : variantProps.className,
        })}
        style={
          state.opened
            ? ["top", "bottom"].includes(position)
              ? {
                  height:
                    (internalRef.current?.getBoundingClientRect?.()?.height ??
                      0) +
                    (position === "top" ? dragState.delta : -dragState.delta),
                  padding: 0,
                  [`padding${position.slice(0, 1).toUpperCase()}${position.slice(1)}`]: `${dragState.delta}px`,
                }
              : {
                  width:
                    (internalRef.current?.getBoundingClientRect?.()?.width ??
                      0) +
                    (position === "left" ? dragState.delta : -dragState.delta),
                  padding: 0,
                  [`padding${position.slice(0, 1).toUpperCase()}${position.slice(1)}`]: `${dragState.delta}px`,
                }
            : { width: 0, height: 0, padding: 0 }
        }
      >
        <Comp
          {...restPropsExtracted}
          className={drawerContentVariant({
            ...variantProps,
            opened: state.isRendered,
            internal: true,
          })}
          style={{
            transform:
              dragState.isDragging &&
              ((["top", "left"].includes(position) && dragState.delta < 0) ||
                (["bottom", "right"].includes(position) && dragState.delta > 0))
                ? `translate${["top", "bottom"].includes(position) ? "Y" : "X"}(${dragState.delta}px)`
                : undefined,
            transitionDuration: dragState.isDragging ? "0s" : undefined,
            userSelect: dragState.isDragging ? "none" : undefined,
          }}
          ref={(el: HTMLDivElement | null) => {
            internalRef.current = el;
            if (typeof ref === "function") {
              ref(el);
            } else if (ref) {
              ref.current = el;
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(e);
          }}
          onMouseDown={onMouseDown}
          onMouseLeave={() =>
            dragState.isDragging &&
            setState((prev) => ({ ...prev, leaveWhileDragging: true }))
          }
          onMouseEnter={() =>
            dragState.isDragging &&
            setState((prev) => ({ ...prev, leaveWhileDragging: false }))
          }
          onTouchStart={onTouchStart}
        />
      </div>
    );
  },
);
DrawerContent.displayName = "DrawerContent";

const DrawerClose = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>((props, ref) => {
  const [_, setState] = useContext(DrawerContext);
  return (
    <Slot
      ref={ref}
      {...props}
      onClick={() => setState((prev) => ({ ...prev, opened: false }))}
    />
  );
});
DrawerClose.displayName = "DrawerClose";

const [drawerHeaderVariant, resolveDrawerHeaderVariantProps] = vcn({
  base: "flex flex-col gap-2",
  variants: {},
  defaults: {},
});

interface DrawerHeaderProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof drawerHeaderVariant>,
    AsChild {}

const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  (props, ref) => {
    const [variantProps, restPropsCompressed] =
      resolveDrawerHeaderVariantProps(props);
    const { asChild, ...restPropsExtracted } = restPropsCompressed;

    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        {...restPropsExtracted}
        className={drawerHeaderVariant(variantProps)}
        ref={ref}
      />
    );
  },
);
DrawerHeader.displayName = "DrawerHeader";

const [drawerBodyVariant, resolveDrawerBodyVariantProps] = vcn({
  base: "grow",
  variants: {},
  defaults: {},
});

interface DrawerBodyProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof drawerBodyVariant>,
    AsChild {}

const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>((props, ref) => {
  const [variantProps, restPropsCompressed] =
    resolveDrawerBodyVariantProps(props);
  const { asChild, ...restPropsExtracted } = restPropsCompressed;

  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      {...restPropsExtracted}
      className={drawerBodyVariant(variantProps)}
      ref={ref}
    />
  );
});
DrawerBody.displayName = "DrawerBody";

const [drawerFooterVariant, resolveDrawerFooterVariantProps] = vcn({
  base: "flex flex-row justify-end gap-2",
  variants: {},
  defaults: {},
});

interface DrawerFooterProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof drawerFooterVariant>,
    AsChild {}

const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  (props, ref) => {
    const [variantProps, restPropsCompressed] =
      resolveDrawerFooterVariantProps(props);
    const { asChild, ...restPropsExtracted } = restPropsCompressed;

    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        {...restPropsExtracted}
        className={drawerFooterVariant(variantProps)}
        ref={ref}
      />
    );
  },
);
DrawerFooter.displayName = "DrawerFooter";

export {
  DrawerRoot,
  DrawerTrigger,
  DrawerOverlay,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
};
