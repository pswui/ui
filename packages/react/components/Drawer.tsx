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
  useId,
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
  ids: {
    content: string;
  };
}
const DrawerContextInitial: IDrawerContext = {
  opened: false,
  closeThreshold: 0.3,
  movePercentage: 0,
  isDragging: false,
  isMounted: false,
  isRendered: false,
  leaveWhileDragging: false,
  ids: {
    content: "",
  },
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
    ids: {
      content: useId(),
    },
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
  const [state, setState] = useContext(DrawerContext);

  function onClick() {
    setState((prev) => ({ ...prev, opened: true }));
  }

  return (
    <Slot
      onClick={onClick}
      aria-controls={state.ids.content}
      aria-expanded={state.opened}
      aria-haspopup="dialog"
    >
      {children}
    </Slot>
  );
};

const [drawerOverlayVariant, resolveDrawerOverlayVariantProps] = vcn({
  base: "fixed inset-0 transition-[backdrop-filter] duration-75",
  variants: {
    opened: {
      true: "pointer-events-auto select-auto",
      false: "pointer-events-none select-none",
    },
  },
  defaults: {
    opened: false,
  },
});

const DRAWER_OVERLAY_BACKDROP_FILTER_BRIGHTNESS = 0.3;
const DRAWER_INITIAL_FOCUS_SELECTOR = [
  "[autofocus]",
  "button:not([disabled])",
  "[href]",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
].join(", ");
const DRAWER_TOUCH_DRAG_INTENT_OFFSET = 8;

type DrawerPosition = "top" | "bottom" | "left" | "right";

function isVerticalDrawer(position: DrawerPosition) {
  return ["top", "bottom"].includes(position);
}

function isScrollableOverflow(overflow: string) {
  return ["auto", "overlay", "scroll"].includes(overflow);
}

function canScrollableAncestorConsumeTouchGesture(
  target: EventTarget | null,
  container: HTMLElement,
  position: DrawerPosition,
  movement: number,
) {
  const vertical = isVerticalDrawer(position);
  let current = target instanceof Element ? target : null;

  while (current && container.contains(current)) {
    if (current instanceof HTMLElement) {
      const computedStyle = window.getComputedStyle(current);
      const axisOverflow = vertical
        ? computedStyle.overflowY
        : computedStyle.overflowX;
      const scrollSize = vertical
        ? current.scrollHeight - current.clientHeight
        : current.scrollWidth - current.clientWidth;

      if (
        scrollSize > 0 &&
        (isScrollableOverflow(axisOverflow) ||
          isScrollableOverflow(computedStyle.overflow))
      ) {
        const currentScroll = vertical ? current.scrollTop : current.scrollLeft;
        if (movement > 0 ? currentScroll > 0 : currentScroll < scrollSize) {
          return true;
        }
      }
    }

    if (current === container) {
      break;
    }
    current = current.parentElement;
  }

  return false;
}

function isCloseGesture(position: DrawerPosition, movement: number) {
  return ["top", "left"].includes(position) ? movement < 0 : movement > 0;
}

interface DrawerOverlayProps
  extends Omit<VariantProps<typeof drawerOverlayVariant>, "opened">,
    AsChild,
    ComponentPropsWithoutRef<"div"> {}

const DrawerOverlay = forwardRef<HTMLDivElement, DrawerOverlayProps>(
  (props, ref) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const [state, setState] = useContext(DrawerContext);
    const document = useDocument();

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

    useEffect(() => {
      if (!document || !state.opened) return;

      function onKeyDown(event: KeyboardEvent) {
        if (event.key !== "Escape" || event.defaultPrevented) return;
        setState((prev) => (prev.opened ? { ...prev, opened: false } : prev));
      }

      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("keydown", onKeyDown);
      };
    }, [document, state.opened, setState]);

    useEffect(() => {
      const overlay = internalRef.current;
      if (!overlay || !state.opened || !isMounted) return;

      function onTouchMove(event: TouchEvent) {
        if (event.target !== overlay || !event.cancelable) return;
        event.preventDefault();
      }

      overlay.addEventListener("touchmove", onTouchMove, { passive: false });
      return () => {
        overlay.removeEventListener("touchmove", onTouchMove);
      };
    }, [isMounted, state.opened]);

    const Comp = asChild ? Slot : "div";
    const backdropFilter = `brightness(${
      state.isDragging
        ? state.movePercentage + DRAWER_OVERLAY_BACKDROP_FILTER_BRIGHTNESS
        : state.opened
          ? DRAWER_OVERLAY_BACKDROP_FILTER_BRIGHTNESS
          : 1
    })`;

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
    const {
      "aria-modal": ariaModal,
      asChild,
      id,
      onClick,
      onKeyDown,
      role,
      tabIndex,
      ...restPropsExtracted
    } = restPropsCompressed;

    const Comp = asChild ? Slot : "div";

    const internalRef = useRef<HTMLDivElement | null>(null);
    const isDraggingRef = useRef(false);
    const dragDeltaRef = useRef(0);
    const dragTouchRef = useRef({ x: 0, y: 0 });
    const touchGestureRef = useRef<{
      mode: "idle" | "pending" | "dragging" | "scrolling";
      startTouch: { x: number; y: number };
      target: EventTarget | null;
    }>({
      mode: "idle",
      startTouch: { x: 0, y: 0 },
      target: null,
    });

    function onEscapeKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      setState((prev) => (prev.opened ? { ...prev, opened: false } : prev));
    }

    useEffect(() => {
      if (!state.isRendered || !internalRef.current) return;

      const content = internalRef.current;
      const frame = window.requestAnimationFrame(() => {
        if (content.ownerDocument.activeElement instanceof Element) {
          if (content.contains(content.ownerDocument.activeElement)) return;
        }

        const focusTarget =
          content.querySelector<HTMLElement>(DRAWER_INITIAL_FOCUS_SELECTOR) ??
          content;
        focusTarget.focus();
      });

      return () => window.cancelAnimationFrame(frame);
    }, [state.isRendered]);

    function onMouseDown() {
      isDraggingRef.current = true;
      dragDeltaRef.current = 0;
      dragTouchRef.current = { x: 0, y: 0 };
      setState((prev) => ({ ...prev, isDragging: true }));
      setDragState({
        isDragging: true,
        delta: 0,
        prevTouch: { x: 0, y: 0 },
      });
    }

    function onTouchStart(e: ReactTouchEvent<HTMLDivElement>) {
      touchGestureRef.current = {
        mode: "pending",
        startTouch: { x: e.touches[0].pageX, y: e.touches[0].pageY },
        target: e.target,
      };
    }

    useEffect(() => {
      function onMouseUp(_: TouchEvent): void;
      function onMouseUp(_: MouseEvent): void;
      function onMouseUp(_e: TouchEvent | MouseEvent) {
        if (isDraggingRef.current && internalRef.current) {
          const size = isVerticalDrawer(position)
            ? internalRef.current.getBoundingClientRect().height
            : internalRef.current.getBoundingClientRect().width;
          setState((prev) => ({
            ...prev,
            isDragging: false,
            opened:
              Math.abs(dragDeltaRef.current) > state.closeThreshold * size
                ? false
                : prev.opened,
            movePercentage: 0,
          }));
        }

        isDraggingRef.current = false;
        dragDeltaRef.current = 0;
        dragTouchRef.current = { x: 0, y: 0 };
        touchGestureRef.current = {
          mode: "idle",
          startTouch: { x: 0, y: 0 },
          target: null,
        };
        setDragState({
          isDragging: false,
          delta: 0,
          prevTouch: { x: 0, y: 0 },
        });
      }

      function onMouseMove(e: TouchEvent): void;
      function onMouseMove(e: MouseEvent): void;
      function onMouseMove(e: MouseEvent | TouchEvent) {
        if ("touches" in e) {
          const currentTouch = { x: e.touches[0].pageX, y: e.touches[0].pageY };
          const touchGesture = touchGestureRef.current;

          if (touchGesture.mode === "pending") {
            const primaryMovement = isVerticalDrawer(position)
              ? currentTouch.y - touchGesture.startTouch.y
              : currentTouch.x - touchGesture.startTouch.x;
            const secondaryMovement = isVerticalDrawer(position)
              ? currentTouch.x - touchGesture.startTouch.x
              : currentTouch.y - touchGesture.startTouch.y;

            if (
              Math.abs(secondaryMovement) >= DRAWER_TOUCH_DRAG_INTENT_OFFSET &&
              Math.abs(secondaryMovement) > Math.abs(primaryMovement)
            ) {
              touchGestureRef.current = { ...touchGesture, mode: "scrolling" };
              return;
            }

            if (Math.abs(primaryMovement) < DRAWER_TOUCH_DRAG_INTENT_OFFSET) {
              return;
            }

            if (
              !internalRef.current ||
              !isCloseGesture(position, primaryMovement) ||
              canScrollableAncestorConsumeTouchGesture(
                touchGesture.target,
                internalRef.current,
                position,
                primaryMovement,
              )
            ) {
              touchGestureRef.current = { ...touchGesture, mode: "scrolling" };
              return;
            }

            touchGestureRef.current = { ...touchGesture, mode: "dragging" };
            isDraggingRef.current = true;
            dragDeltaRef.current = primaryMovement;
            dragTouchRef.current = currentTouch;

            if (internalRef.current) {
              const size = isVerticalDrawer(position)
                ? internalRef.current.getBoundingClientRect().height
                : internalRef.current.getBoundingClientRect().width;
              const movePercentage = primaryMovement / size;
              setState((prev) => ({
                ...prev,
                isDragging: true,
                movePercentage: ["top", "left"].includes(position)
                  ? -movePercentage
                  : movePercentage,
              }));
            }

            setDragState({
              isDragging: true,
              delta: primaryMovement,
              prevTouch: currentTouch,
            });

            if (e.cancelable) {
              e.preventDefault();
            }

            return;
          }

          if (touchGesture.mode !== "dragging" || !isDraggingRef.current) {
            return;
          }

          if (e.cancelable) {
            e.preventDefault();
          }
        }

        if (isDraggingRef.current) {
          const currentTouch =
            "touches" in e
              ? { x: e.touches[0].pageX, y: e.touches[0].pageY }
              : null;
          let movement = isVerticalDrawer(position)
            ? "movementY" in e
              ? e.movementY
              : (currentTouch?.y ?? 0) - dragTouchRef.current.y
            : "movementX" in e
              ? e.movementX
              : (currentTouch?.x ?? 0) - dragTouchRef.current.x;

          if (
            (["top", "left"].includes(position) &&
              dragDeltaRef.current >= 0 &&
              movement > 0) ||
            (["bottom", "right"].includes(position) &&
              dragDeltaRef.current <= 0 &&
              movement < 0)
          ) {
            movement =
              movement /
              Math.abs(dragDeltaRef.current === 0 ? 1 : dragDeltaRef.current);
          }

          const nextDelta = dragDeltaRef.current + movement;
          dragDeltaRef.current = nextDelta;
          if (currentTouch) {
            dragTouchRef.current = currentTouch;
          }

          setDragState((prev) => ({
            ...prev,
            delta: nextDelta,
            ...(currentTouch ? { prevTouch: currentTouch } : {}),
          }));

          if (internalRef.current) {
            const size = isVerticalDrawer(position)
              ? internalRef.current.getBoundingClientRect().height
              : internalRef.current.getBoundingClientRect().width;
            const movePercentage = nextDelta / size;
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
      window.addEventListener("touchmove", onMouseMove, { passive: false });
      window.addEventListener("touchend", onMouseUp);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("touchmove", onMouseMove);
        window.removeEventListener("touchend", onMouseUp);
      };
    }, [position, setState, state.closeThreshold]);

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
          id={id ?? state.ids.content}
          className={drawerContentVariant({
            ...variantProps,
            opened: state.isRendered,
            internal: true,
          })}
          role={role ?? "dialog"}
          aria-modal={ariaModal ?? true}
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
          tabIndex={tabIndex ?? -1}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(e);
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            onEscapeKeyDown(e);
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
