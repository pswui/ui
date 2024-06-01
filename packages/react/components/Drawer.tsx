import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AsChild, Slot, VariantProps, vcn } from "../shared";
import { createPortal } from "react-dom";

interface IDrawerContext {
  opened: boolean;
  closeThreshold: number;
  movePercentage: number;
  isDragging: boolean;
  leaveWhileDragging: boolean;
}
const DrawerContextInitial: IDrawerContext = {
  opened: false,
  closeThreshold: 0.3,
  movePercentage: 0,
  isDragging: false,
  leaveWhileDragging: false,
};
const DrawerContext = React.createContext<
  [IDrawerContext, React.Dispatch<React.SetStateAction<IDrawerContext>>]
>([
  DrawerContextInitial,
  () => {
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
      console.warn(
        "It seems like you're using DrawerContext outside of a provider."
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

  useEffect(() => {
    state[1]((prev) => ({
      ...prev,
      opened: opened ?? prev.opened,
      closeThreshold: closeThreshold ?? prev.closeThreshold,
    }));
  }, [closeThreshold, opened]);

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
  base: "fixed inset-0",
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

interface DrawerOverlayProps
  extends VariantProps<typeof drawerOverlayVariant>,
    AsChild,
    ComponentPropsWithoutRef<"div"> {}

const DrawerOverlay = forwardRef<HTMLDivElement, DrawerOverlayProps>(
  (props, ref) => {
    const [state, setState] = useContext(DrawerContext);

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

    return createPortal(
      <Comp
        {...restPropsExtracted}
        className={drawerOverlayVariant({
          ...variantProps,
          opened: state.isDragging ? true : state.opened,
        })}
        onClick={onOutsideClick}
        style={/*{ backdropFilter: "brightness(0.5)" }*/ undefined}
        ref={ref}
      />,
      document.body
    );
  }
);

const drawerContentColors = {
  background: "bg-white dark:bg-black",
  border: "border-neutral-200 dark:border-neutral-800",
};

const [drawerContentVariant, resolveDrawerContentVariantProps] = vcn({
  base: `fixed ${drawerContentColors.background} ${drawerContentColors.border} transition-all p-4`,
  variants: {
    position: {
      top: "top-0 inset-x-0 rounded-t-lg border-b-2",
      bottom: "bottom-0 inset-x-0 rounded-b-lg border-t-2",
      left: "left-0 inset-y-0 rounded-l-lg border-r-2",
      right: "right-0 inset-y-0 rounded-r-lg border-l-2",
    },
    opened: {
      true: "",
      false:
        "-[&.top-0]:translate-y-full [&.bottom-0]:translate-y-full [&.left-0]:-translate-x-full [&.right-0]:translate-x-full",
    },
  },
  defaults: {
    position: "left",
    opened: false,
  },
});

interface DrawerContentProps
  extends Omit<VariantProps<typeof drawerContentVariant>, "opened">,
    AsChild,
    ComponentPropsWithoutRef<"div"> {}

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  (props, ref) => {
    const [state, setState] = useContext(DrawerContext);
    const [dragState, setDragState] = useState({
      isDragging: false,
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
      });
    }

    useEffect(() => {
      function onMouseUp(e: MouseEvent) {
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
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isDragging: false,
          }));
        }
        setDragState({
          isDragging: false,
          delta: 0,
        });
      }

      function onMouseMove(e: MouseEvent) {
        if (dragState.isDragging) {
          setDragState((prev) => {
            let movement = ["top", "bottom"].includes(position)
              ? e.movementY
              : e.movementX;
            if (
              (["top", "left"].includes(position) &&
                dragState.delta >= 0 &&
                movement > 0) ||
              (["bottom", "right"].includes(position) &&
                dragState.delta <= 0 &&
                movement < 0)
            ) {
              movement =
                movement / (dragState.delta === 0 ? 1 : dragState.delta);
            }
            return {
              ...prev,
              delta: prev.delta + movement,
            };
          });
        }
      }

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }, [state, dragState]);

    return (
      <div
        className={drawerContentVariant({
          ...variantProps,
          opened: true,
          className: dragState.isDragging
            ? "transition-[width_0ms]"
            : variantProps.className,
        })}
        style={
          state.opened
            ? ["top", "bottom"].includes(position)
              ? {
                  height:
                    (internalRef.current?.getBoundingClientRect?.()?.height ??
                      0) + dragState.delta,
                  padding: 0,
                }
              : {
                  width:
                    (internalRef.current?.getBoundingClientRect?.()?.width ??
                      0) + dragState.delta,
                  padding: 0,
                }
            : { width: 0, height: 0, padding: 0 }
        }
      >
        <Comp
          {...restPropsExtracted}
          className={drawerContentVariant({
            ...variantProps,
            opened: state.opened,
          })}
          style={{
            transform: dragState.isDragging
              ? `translate${["top", "bottom"].includes(position) ? "Y" : "X"}(${
                  dragState.delta
                }px)`
              : undefined,
            transitionDuration: dragState.isDragging ? "0s" : undefined,
            userSelect: dragState.isDragging ? "none" : undefined,
          }}
          ref={(el) => {
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
        />
      </div>
    );
  }
);

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

export { DrawerRoot, DrawerTrigger, DrawerOverlay, DrawerContent, DrawerClose };
