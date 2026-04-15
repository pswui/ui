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
  isRendered: boolean;
  ids: {
    content: string;
  };
}
const DrawerContextInitial: IDrawerContext = {
  opened: false,
  isRendered: false,
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
  opened?: boolean;
}

const DrawerRoot = ({ children, opened }: DrawerRootProps) => {
  const state = useState<IDrawerContext>({
    ...DrawerContextInitial,
    ids: {
      content: useId(),
    },
    opened: opened ?? DrawerContextInitial.opened,
  });
  const setState = state[1];

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      opened: opened ?? prev.opened,
    }));
  }, [opened, setState]);

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
  base: "fixed inset-0 transition-opacity duration-150 backdrop-blur-md backdrop-brightness-75",
  variants: {
    opened: {
      true: "pointer-events-auto select-auto opacity-100",
      false: "pointer-events-none select-none opacity-0",
    },
  },
  defaults: {
    opened: false,
  },
});

const DRAWER_INITIAL_FOCUS_SELECTOR = [
  "[autofocus]",
  "button:not([disabled])",
  "[href]",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
].join(", ");

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
      state.opened,
      internalRef,
    );

    const [variantProps, restPropsCompressed] =
      resolveDrawerOverlayVariantProps(props);
    const { asChild, onClick, ...restPropsExtracted } = restPropsCompressed;

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

    const Comp = asChild ? Slot : "div";

    if (!document) return null;

    return (
      <>
        <DrawerContext.Provider value={[{ ...state, isRendered }, setState]}>
          {isMounted
            ? createPortal(
                <Comp
                  {...restPropsExtracted}
                  className={drawerOverlayVariant({
                    ...variantProps,
                    opened: isRendered,
                  })}
                  onClick={(event) => {
                    setState((prev) => ({ ...prev, opened: false }));
                    onClick?.(event);
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
  base: `fixed ${drawerContentColors.background} ${drawerContentColors.border} transition-transform duration-300 p-4 flex flex-col justify-between gap-8 overflow-auto`,
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
  },
  defaults: {
    position: "left",
    opened: false,
    maxSize: "sm",
  },
  dynamics: [
    ({ position }) => {
      if (["top", "bottom"].includes(position)) {
        return "inset-x-0";
      }

      return "inset-y-0";
    },
  ],
});

interface DrawerContentProps
  extends Omit<VariantProps<typeof drawerContentVariant>, "opened">,
    AsChild,
    ComponentPropsWithoutRef<"div"> {}

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  (props, ref) => {
    const [state, setState] = useContext(DrawerContext);
    const [variantProps, restPropsCompressed] =
      resolveDrawerContentVariantProps(props);
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
    return (
      <Comp
        {...restPropsExtracted}
        id={id ?? state.ids.content}
        className={drawerContentVariant({
          ...variantProps,
          opened: state.isRendered,
        })}
        role={role ?? "dialog"}
        aria-modal={ariaModal ?? true}
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
      />
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
