import React, {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useState,
} from "react";
import { VariantProps, vcn } from "..//shared";
import ReactDOM from "react-dom";

/**
 * =========================
 * DialogContext
 * =========================
 */

interface DialogContext {
  opened: boolean;
}

const initialDialogContext: DialogContext = { opened: false };
const DialogContext = React.createContext<
  [DialogContext, Dispatch<SetStateAction<DialogContext>>]
>([
  initialDialogContext,
  () => {
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
      console.warn(
        "It seems like you're using DialogContext outside of a provider."
      );
    }
  },
]);

const useDialogContext = () => React.useContext(DialogContext);

/**
 * =========================
 * DialogRoot
 * =========================
 */

interface DialogRootProps {
  children: React.ReactNode;
}

const DialogRoot = ({ children }: DialogRootProps) => {
  const state = useState<DialogContext>(initialDialogContext);
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
  children: Exclude<React.ReactNode, Iterable<React.ReactNode>>;
}

const DialogTrigger = ({ children }: DialogTriggerProps) => {
  const [_, setState] = useDialogContext();
  // const onClick = () => setState((p) => ({ ...p, opened: true }));

  const child = React.Children.only(children) as React.ReactElement;
  const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    child.props.onClick?.(e);
    setState((p) => ({ ...p, opened: true }));
  };
  return <>{React.cloneElement(child, { onClick })}</>;
};

/**
 * =========================
 * DialogOverlay
 * =========================
 */

const [dialogOverlayVariant, resolveDialogOverlayVariant] = vcn({
  base: "fixed inset-0 z-50 w-full h-full max-w-screen transition-all duration-300 flex flex-col justify-center items-center",
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
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
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
    const [variantProps, { children, closeOnClick, onClick, ...otherProps }] =
      resolveDialogOverlayVariant({ ...props, opened });
    return (
      <>
        {ReactDOM.createPortal(
          <div
            {...otherProps}
            ref={ref}
            className={dialogOverlayVariant(variantProps)}
            onClick={(e) => {
              if (closeOnClick) {
                setContext((p) => ({ ...p, opened: false }));
              }
              onClick?.(e);
            }}
          >
            {children}
          </div>,
          document.body
        )}
      </>
    );
  }
);

/**
 * =========================
 * DialogContent
 * =========================
 */

const [dialogContentVariant, resolveDialogContentVariant] = vcn({
  base: "transition-transform duration-300 bg-white dark:bg-black border border-black/10 dark:border-white/10",
  variants: {
    opened: {
      true: "scale-100",
      false: "scale-50",
    },
    size: {
      fit: "w-fit",
      fullSm: "w-full max-w-sm",
      fullMd: "w-full max-w-md",
      fullLg: "w-full max-w-lg",
      fullXl: "w-full max-w-xl",
      full2xl: "w-full max-w-2xl",
    },
    rounded: {
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
    padding: {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
    gap: {
      sm: "space-y-4",
      md: "space-y-6",
      lg: "space-y-8",
    },
  },
  defaults: {
    opened: false,
    size: "fit",
    rounded: "md",
    padding: "md",
    gap: "md",
  },
});

interface DialogContent
  extends React.ComponentPropsWithoutRef<"div">,
    Omit<VariantProps<typeof dialogContentVariant>, "opened"> {}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContent>(
  (props, ref) => {
    const [{ opened }] = useDialogContext();
    const [variantProps, { children, ...otherProps }] =
      resolveDialogContentVariant({ ...props, opened });
    return (
      <div
        {...otherProps}
        ref={ref}
        className={dialogContentVariant(variantProps)}
      >
        {children}
      </div>
    );
  }
);

/**
 * =========================
 * DialogClose
 * =========================
 */

interface DialogCloseProps {
  children: Exclude<React.ReactNode, Iterable<React.ReactNode>>;
}

const DialogClose = ({ children }: DialogCloseProps) => {
  const [_, setState] = useDialogContext();
  // const onClick = () => setState((p) => ({ ...p, opened: false }));

  const child = React.Children.only(children) as React.ReactElement;

  const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    child.props.onClick?.(e);
    setState((p) => ({ ...p, opened: false }));
  };

  return <>{React.cloneElement(child, { onClick })}</>;
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
    const [variantProps, { children, ...otherProps }] =
      resolveDialogHeaderVariant(props);
    return (
      <header
        {...otherProps}
        ref={ref}
        className={dialogHeaderVariant(variantProps)}
      >
        {children}
      </header>
    );
  }
);

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
    const [variantProps, { children, ...otherProps }] =
      resolveDialogTitleVariant(props);
    return (
      <h1
        {...otherProps}
        ref={ref}
        className={dialogTitleVariant(variantProps)}
      >
        {children}
      </h1>
    );
  }
);

const DialogSubtitle = React.forwardRef<
  HTMLHeadingElement,
  DialogSubtitleProps
>((props, ref) => {
  const [variantProps, { children, ...otherProps }] =
    resolveDialogSubtitleVariant(props);
  return (
    <h2
      {...otherProps}
      ref={ref}
      className={dialogSubtitleVariant(variantProps)}
    >
      {children}
    </h2>
  );
});

/**
 * =========================
 * DialogFooter
 * =========================
 */

const [dialogFooterVariant, resolveDialogFooterVariant] = vcn({
  base: "flex flex-col-reverse sm:flex-row sm:justify-end",
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
    const [variantProps, { children, ...otherProps }] =
      resolveDialogFooterVariant(props);
    return (
      <div
        {...otherProps}
        ref={ref}
        className={dialogFooterVariant(variantProps)}
      >
        {children}
      </div>
    );
  }
);

export {
  useDialogContext,
  DialogRoot,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogSubtitle,
  DialogFooter,
};
