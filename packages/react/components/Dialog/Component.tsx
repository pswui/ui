import {
  Slot,
  type VariantProps,
  useAnimatedMount,
  useDocument,
  vcn,
} from "@pswui-lib";
import React, { type ReactNode, useId, useRef, useState } from "react";
import ReactDOM from "react-dom";

import {
  DialogContext,
  type IDialogContext,
  InnerDialogContext,
  initialDialogContext,
  useDialogContext,
  useInnerDialogContext,
} from "./Context";

/**
 * =========================
 * DialogRoot
 * =========================
 */

interface DialogRootProps {
  children: React.ReactNode;
}

const DialogRoot = ({ children }: DialogRootProps) => {
  const state = useState<IDialogContext>({
    ...initialDialogContext,
    ids: { dialog: useId(), title: useId(), description: useId() },
  });
  return (
    <DialogContext.Provider value={state}>{children}</DialogContext.Provider>
  );
};

/**
 * =========================
 * DialogTrigger
 * =========================
 */

interface DialogTriggerProps {
  children: React.ReactNode;
}

const DialogTrigger = ({ children }: DialogTriggerProps) => {
  const [{ ids }, setState] = useDialogContext();
  const onClick = () => setState((p) => ({ ...p, opened: true }));

  return (
    <Slot
      onClick={onClick}
      aria-controls={ids.dialog}
    >
      {children}
    </Slot>
  );
};

/**
 * =========================
 * DialogOverlay
 * =========================
 */

const [dialogOverlayVariant, resolveDialogOverlayVariant] = vcn({
  base: "fixed inset-0 z-50 w-full h-screen overflow-y-auto max-w-screen transition-all duration-300 backdrop-blur-md backdrop-brightness-75 [&>div]:p-6",
  variants: {
    opened: {
      true: "pointer-events-auto opacity-100",
      false: "pointer-events-none opacity-0",
    },
  },
  defaults: {
    opened: false,
  },
});

interface DialogOverlay
  extends React.ComponentPropsWithoutRef<"div">,
    Omit<VariantProps<typeof dialogOverlayVariant>, "opened"> {
  closeOnClick?: boolean;
}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlay>(
  (props, ref) => {
    const [{ opened, ids }, setContext] = useDialogContext();
    const [variantProps, otherPropsCompressed] =
      resolveDialogOverlayVariant(props);
    const { children, closeOnClick, onClick, ...otherPropsExtracted } =
      otherPropsCompressed;

    const internalRef = useRef<HTMLDivElement | null>(null);

    const { isMounted, isRendered } = useAnimatedMount(opened, internalRef);

    const document = useDocument();
    if (!document) return null;

    return isMounted
      ? ReactDOM.createPortal(
          <div
            {...otherPropsExtracted}
            id={ids.dialog}
            ref={(el) => {
              internalRef.current = el;
              if (typeof ref === "function") {
                ref(el);
              } else if (ref) {
                ref.current = el;
              }
            }}
            className={dialogOverlayVariant({
              ...variantProps,
              opened: isRendered,
            })}
            onClick={(e) => {
              if (closeOnClick) {
                setContext((p) => ({ ...p, opened: false }));
              }
              onClick?.(e);
            }}
          >
            {/* Layer for overflow positioning */}
            <div
              className={
                "w-screen max-w-full min-h-screen flex flex-col justify-center items-center"
              }
            >
              <InnerDialogContext.Provider value={{ isMounted, isRendered }}>
                {children}
              </InnerDialogContext.Provider>
            </div>
          </div>,
          document.body,
        )
      : null;
  },
);
DialogOverlay.displayName = "DialogOverlay";

/**
 * =========================
 * DialogContent
 * =========================
 */

const [dialogContentVariant, resolveDialogContentVariant] = vcn({
  base: "transition-transform duration-300 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-6 w-full max-w-xl rounded-md flex flex-col justify-start items-start gap-6",
  variants: {
    opened: {
      true: "scale-100",
      false: "scale-50",
    },
  },
  defaults: {
    opened: false,
  },
});

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<"div">,
    Omit<VariantProps<typeof dialogContentVariant>, "opened"> {}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (props, ref) => {
    const [{ ids }] = useDialogContext();
    const [variantProps, otherPropsCompressed] =
      resolveDialogContentVariant(props);
    const { isRendered } = useInnerDialogContext();
    const { children, onClick, ...otherPropsExtracted } = otherPropsCompressed;
    return (
      <div
        {...otherPropsExtracted}
        ref={ref}
        role="dialog"
        aria-labelledby={ids.title}
        aria-describedby={ids.description}
        className={dialogContentVariant({
          ...variantProps,
          opened: isRendered,
        })}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
      >
        {children}
      </div>
    );
  },
);
DialogContent.displayName = "DialogContent";

/**
 * =========================
 * DialogClose
 * =========================
 */

interface DialogCloseProps {
  children: React.ReactNode;
}

const DialogClose = ({ children }: DialogCloseProps) => {
  const [_, setState] = useDialogContext();
  const onClick = () => setState((p) => ({ ...p, opened: false }));

  const slotProps = {
    onClick,
    children,
  };

  return <Slot {...slotProps} />;
};

/**
 * =========================
 * DialogHeader
 * =========================
 */

const [dialogHeaderVariant, resolveDialogHeaderVariant] = vcn({
  base: "flex flex-col gap-2",
  variants: {},
  defaults: {},
});

interface DialogHeaderProps
  extends React.ComponentPropsWithoutRef<"header">,
    VariantProps<typeof dialogHeaderVariant> {}

const DialogHeader = React.forwardRef<HTMLElement, DialogHeaderProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveDialogHeaderVariant(props);
    const { children, ...otherPropsExtracted } = otherPropsCompressed;
    return (
      <header
        {...otherPropsExtracted}
        ref={ref}
        className={dialogHeaderVariant(variantProps)}
      >
        {children}
      </header>
    );
  },
);

DialogHeader.displayName = "DialogHeader";

/**
 * =========================
 * DialogTitle / DialogSubtitle
 * =========================
 */

const [dialogTitleVariant, resolveDialogTitleVariant] = vcn({
  base: "text-xl font-bold",
  variants: {},
  defaults: {},
});

interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<"h1">,
    VariantProps<typeof dialogTitleVariant> {}

const [dialogDescriptionVariant, resolveDialogDescriptionVariant] = vcn({
  base: "text-sm opacity-60 font-normal",
  variants: {},
  defaults: {},
});

interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<"h2">,
    VariantProps<typeof dialogDescriptionVariant> {}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveDialogTitleVariant(props);
    const { children, ...otherPropsExtracted } = otherPropsCompressed;
    const [{ ids }] = useDialogContext();
    return (
      <h1
        {...otherPropsExtracted}
        ref={ref}
        className={dialogTitleVariant(variantProps)}
        id={ids.title}
      >
        {children}
      </h1>
    );
  },
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLHeadingElement,
  DialogDescriptionProps
>((props, ref) => {
  const [variantProps, otherPropsCompressed] =
    resolveDialogDescriptionVariant(props);
  const { children, ...otherPropsExtracted } = otherPropsCompressed;
  const [{ ids }] = useDialogContext();
  return (
    <h2
      {...otherPropsExtracted}
      ref={ref}
      className={dialogDescriptionVariant(variantProps)}
      id={ids.description}
    >
      {children}
    </h2>
  );
});
DialogDescription.displayName = "DialogDescription";

// renamed DialogSubtitle -> DialogDescription
// keep DialogSubtitle for backward compatibility
const DialogSubtitle = DialogDescription;

/**
 * =========================
 * DialogFooter
 * =========================
 */

const [dialogFooterVariant, resolveDialogFooterVariant] = vcn({
  base: "flex w-full flex-col items-end sm:flex-row sm:items-center sm:justify-end gap-2",
  variants: {},
  defaults: {},
});

interface DialogFooterProps
  extends React.ComponentPropsWithoutRef<"footer">,
    VariantProps<typeof dialogFooterVariant> {}

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveDialogFooterVariant(props);
    const { children, ...otherPropsExtracted } = otherPropsCompressed;
    return (
      <footer
        {...otherPropsExtracted}
        ref={ref}
        className={dialogFooterVariant(variantProps)}
      >
        {children}
      </footer>
    );
  },
);
DialogFooter.displayName = "DialogFooter";

interface DialogControllers {
  context: IDialogContext;

  setContext: React.Dispatch<React.SetStateAction<IDialogContext>>;
  close: () => void;
}

interface DialogControllerProps {
  children: (controllers: DialogControllers) => ReactNode;
}

const DialogController = (props: DialogControllerProps) => {
  return (
    <DialogContext.Consumer>
      {([context, setContext]) =>
        props.children({
          context,
          setContext,
          close() {
            setContext((p) => ({ ...p, opened: false }));
          },
        })
      }
    </DialogContext.Consumer>
  );
};

export {
  DialogRoot,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogSubtitle,
  DialogDescription,
  DialogFooter,
  DialogController,
};
