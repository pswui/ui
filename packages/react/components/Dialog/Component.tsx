import {
  ServerSideDocumentFallback,
  Slot,
  type VariantProps,
  vcn,
} from "@pswui-lib";
import React, { type ReactNode, useState } from "react";
import ReactDOM from "react-dom";

import {
  DialogContext,
  type IDialogContext,
  initialDialogContext,
  useDialogContext,
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
  const state = useState<IDialogContext>(initialDialogContext);
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
  const [_, setState] = useDialogContext();
  const onClick = () => setState((p) => ({ ...p, opened: true }));

  const slotProps = {
    onClick,
    children,
  };

  return <Slot {...slotProps} />;
};

/**
 * =========================
 * DialogOverlay
 * =========================
 */

const [dialogOverlayVariant, resolveDialogOverlayVariant] = vcn({
  base: "fixed inset-0 z-50 w-full h-screen overflow-y-auto max-w-screen transition-all duration-300",
  variants: {
    opened: {
      true: "pointer-events-auto opacity-100",
      false: "pointer-events-none opacity-0",
    },
    blur: {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
    },
    darken: {
      sm: "backdrop-brightness-90",
      md: "backdrop-brightness-75",
      lg: "backdrop-brightness-50",
    },
    padding: {
      sm: "[&>div]:p-4",
      md: "[&>div]:p-6",
      lg: "[&>div]:p-8",
    },
  },
  defaults: {
    opened: false,
    blur: "md",
    darken: "md",
    padding: "md",
  },
});

interface DialogOverlay
  extends React.ComponentPropsWithoutRef<"div">,
    Omit<VariantProps<typeof dialogOverlayVariant>, "opened"> {
  closeOnClick?: boolean;
}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlay>(
  (props, ref) => {
    const [{ opened }, setContext] = useDialogContext();
    const [variantProps, otherPropsCompressed] = resolveDialogOverlayVariant({
      ...props,
      opened,
    });
    const { children, closeOnClick, onClick, ...otherPropsExtracted } =
      otherPropsCompressed;

    return (
      <ServerSideDocumentFallback>
        {ReactDOM.createPortal(
          <div
            {...otherPropsExtracted}
            ref={ref}
            className={dialogOverlayVariant(variantProps)}
            onClick={(e) => {
              if (closeOnClick) {
                setContext((p) => ({ ...p, opened: false }));
              }
              onClick?.(e);
            }}
          >
            <div
              className={
                "w-screen max-w-full min-h-screen flex flex-col justify-center items-center"
              }
            >
              {/* Layer for overflow positioning */}
              {children}
            </div>
          </div>,
          document.body,
        )}
      </ServerSideDocumentFallback>
    );
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
    const [{ opened }] = useDialogContext();
    const [variantProps, otherPropsCompressed] = resolveDialogContentVariant({
      ...props,
      opened,
    });
    const { children, onClick, ...otherPropsExtracted } = otherPropsCompressed;
    return (
      <div
        {...otherPropsExtracted}
        ref={ref}
        className={dialogContentVariant(variantProps)}
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
  base: "flex flex-col",
  variants: {
    gap: {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    },
  },
  defaults: {
    gap: "sm",
  },
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
  variants: {
    size: {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
    },
    weight: {
      sm: "font-medium",
      md: "font-semibold",
      lg: "font-bold",
    },
  },
  defaults: {
    size: "md",
    weight: "lg",
  },
});

interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<"h1">,
    VariantProps<typeof dialogTitleVariant> {}

const [dialogSubtitleVariant, resolveDialogSubtitleVariant] = vcn({
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
    opacity: {
      sm: "opacity-60",
      md: "opacity-70",
      lg: "opacity-80",
    },
    weight: {
      sm: "font-light",
      md: "font-normal",
      lg: "font-medium",
    },
  },
  defaults: {
    size: "sm",
    opacity: "sm",
    weight: "md",
  },
});

interface DialogSubtitleProps
  extends React.ComponentPropsWithoutRef<"h2">,
    VariantProps<typeof dialogSubtitleVariant> {}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveDialogTitleVariant(props);
    const { children, ...otherPropsExtracted } = otherPropsCompressed;
    return (
      <h1
        {...otherPropsExtracted}
        ref={ref}
        className={dialogTitleVariant(variantProps)}
      >
        {children}
      </h1>
    );
  },
);
DialogTitle.displayName = "DialogTitle";

const DialogSubtitle = React.forwardRef<
  HTMLHeadingElement,
  DialogSubtitleProps
>((props, ref) => {
  const [variantProps, otherPropsCompressed] =
    resolveDialogSubtitleVariant(props);
  const { children, ...otherPropsExtracted } = otherPropsCompressed;
  return (
    <h2
      {...otherPropsExtracted}
      ref={ref}
      className={dialogSubtitleVariant(variantProps)}
    >
      {children}
    </h2>
  );
});
DialogSubtitle.displayName = "DialogSubtitle";

/**
 * =========================
 * DialogFooter
 * =========================
 */

const [dialogFooterVariant, resolveDialogFooterVariant] = vcn({
  base: "flex flex-col items-end sm:flex-row sm:items-center sm:justify-end",
  variants: {
    gap: {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    },
  },
  defaults: {
    gap: "md",
  },
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
      <div
        {...otherPropsExtracted}
        ref={ref}
        className={dialogFooterVariant(variantProps)}
      >
        {children}
      </div>
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
  DialogFooter,
  DialogController,
};
