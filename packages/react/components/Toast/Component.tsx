import { type VariantProps, vcn } from "@pswui-lib";
import React, { useEffect, useId, useRef } from "react";
import ReactDOM from "react-dom";

import {
  type ToastOption,
  close,
  defaultToastOption,
  getSingleSnapshot,
  getSnapshot,
  notify,
  notifySingle,
  subscribe,
  subscribeSingle,
  toasts,
} from "./Store";
import { toastVariant } from "./Variant";

const ToastTemplate = ({
  id,
  globalOption,
}: {
  id: `${number}`;
  globalOption: ToastOption;
}) => {
  const [toast, setToast] = React.useState<(typeof toasts)[`${number}`]>(
    toasts[id],
  );
  const ref = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    subscribeSingle(id)(() => {
      setToast(getSingleSnapshot(id)());
    });
  }, [id]);

  const toastData = {
    ...globalOption,
    ...toast,
  };

  React.useEffect(() => {
    if (toastData.life === "born") {
      requestAnimationFrame(() => {
        // To make sure that the toast is rendered as "born" state
        // and then change to "normal" state
        toasts[id] = {
          ...toasts[id],
          life: "normal",
        };
        notifySingle(id);
      });
    }
    if (toastData.life === "normal" && toastData.closeTimeout !== null) {
      const timeout = setTimeout(() => {
        close(id);
      }, toastData.closeTimeout);
      return () => clearTimeout(timeout);
    }
    if (toastData.life === "dead") {
      let transitionDuration: {
        value: number;
        unit: string;
      } | null;
      if (!ref.current) {
        transitionDuration = null;
      } else if (ref.current.computedStyleMap !== undefined) {
        transitionDuration = ref.current
          .computedStyleMap()
          .get("transition-duration") as { value: number; unit: string };
      } else {
        const style = /(\d+(\.\d+)?)(.+)/.exec(
          window.getComputedStyle(ref.current).transitionDuration,
        );
        transitionDuration = style
          ? {
              value: Number.parseFloat(style[1] ?? "0"),
              unit: style[3] ?? style[2] ?? "s",
            }
          : null;
      }
      if (!transitionDuration) {
        delete toasts[id];
        notify();
        return;
      }
      const calculatedTransitionDuration =
        transitionDuration.value *
        ({
          s: 1000,
          ms: 1,
        }[transitionDuration.unit] ?? 1);
      const timeout = setTimeout(() => {
        delete toasts[id];
        notify();
      }, calculatedTransitionDuration);
      return () => clearTimeout(timeout);
    }
  }, [id, toastData.life, toastData.closeTimeout]);

  return (
    <div
      className={toastVariant({
        status: toastData.status,
        life: toastData.life,
      })}
      ref={ref}
    >
      {toastData.closeButton && (
        <button
          className="absolute top-2 right-2"
          onClick={() => close(id)}
          type={"button"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.2rem"
            height="1.2rem"
            viewBox="0 0 24 24"
          >
            <title>Close</title>
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
            />
          </svg>
        </button>
      )}
      <div className="text-sm font-bold">{toastData.title}</div>
      <div className="text-sm">{toastData.description}</div>
    </div>
  );
};

const [toasterVariant, resolveToasterVariantProps] = vcn({
  base: "fixed p-4 flex flex-col gap-4 top-0 right-0 w-full md:max-w-md md:bottom-0 md:top-auto pointer-events-none z-40",
  variants: {},
  defaults: {},
});

interface ToasterProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof toasterVariant> {
  defaultOption?: Partial<ToastOption>;
  muteDuplicationWarning?: boolean;
}

const Toaster = React.forwardRef<HTMLDivElement, ToasterProps>((props, ref) => {
  const id = useId();
  const [variantProps, otherPropsCompressed] =
    resolveToasterVariantProps(props);
  const { defaultOption, muteDuplicationWarning, ...otherPropsExtracted } =
    otherPropsCompressed;

  const [toastList, setToastList] = React.useState<typeof toasts>(toasts);
  const internalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return subscribe(() => {
      setToastList(getSnapshot());
    });
  }, []);

  const option = React.useMemo(() => {
    return {
      ...defaultToastOption,
      ...defaultOption,
    };
  }, [defaultOption]);

  const toasterInstance = document.querySelector("div[data-toaster-root]");
  if (toasterInstance && id !== toasterInstance.id) {
    if (process.env.NODE_ENV === "development" && !muteDuplicationWarning) {
      console.warn(
        "Multiple Toaster instances detected. Only one Toaster is allowed.",
      );
    }
    return null;
  }

  return (
    <>
      {ReactDOM.createPortal(
        <div
          {...otherPropsExtracted}
          data-toaster-root={true}
          className={toasterVariant(variantProps)}
          ref={(el) => {
            internalRef.current = el;
            if (typeof ref === "function") {
              ref(el);
            } else if (ref) {
              ref.current = el;
            }
          }}
          id={id}
        >
          {Object.entries(toastList).map(([id]) => (
            <ToastTemplate
              key={id}
              id={id as `${number}`}
              globalOption={option}
            />
          ))}
        </div>,
        document.body,
      )}
    </>
  );
});
Toaster.displayName = "Toaster";

export { Toaster };
