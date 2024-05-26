import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { VariantProps, vcn } from "../shared";

interface ToastOption {
  closeButton: boolean;
  closeTimeout: number | null;
}

const defaultToastOption: ToastOption = {
  closeButton: true,
  closeTimeout: 3000,
};

const toastColors = {
  background: "bg-white dark:bg-black",
  borders: {
    default: "border-black/10 dark:border-white/20",
    error: "border-red-500/50",
    success: "border-green-500/50",
    warning: "border-yellow-500/50",
    loading: "border-black/50 dark:border-white/50 animate-pulse",
  },
};

const [toastVariant] = vcn({
  base: `flex flex-col gap-2 border p-4 rounded-lg pr-8 pointer-events-auto ${toastColors.background} relative transition-all duration-150`,
  variants: {
    status: {
      default: toastColors.borders.default,
      error: toastColors.borders.error,
      success: toastColors.borders.success,
      warning: toastColors.borders.warning,
      loading: toastColors.borders.loading,
    },
    life: {
      born: "translate-y-1/2 scale-90 ease-[cubic-bezier(0,.6,.7,1)]",
      normal: "translate-y-0 scale-100 ease-[cubic-bezier(0,.6,.7,1)]",
      dead: "translate-y-1/2 scale-90 ease-[cubic-bezier(.6,0,1,.7)]",
    },
  },
  defaults: {
    status: "default",
    life: "born",
  },
});

interface ToastBody extends Omit<VariantProps<typeof toastVariant>, "preset"> {
  title: string;
  description: string;
}

let index = 0;
let toasts: Record<
  `${number}`,
  ToastBody &
    Partial<ToastOption> & { subscribers: (() => void)[]; version: number }
> = {};
let subscribers: (() => void)[] = [];

/**
 * ====
 * Controls
 * ====
 */

function subscribe(callback: () => void) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter((subscriber) => subscriber !== callback);
  };
}

function getSnapshot() {
  return { ...toasts };
}

function subscribeSingle(id: `${number}`) {
  return (callback: () => void) => {
    toasts[id].subscribers.push(callback);
    return () => {
      toasts[id].subscribers = toasts[id].subscribers.filter(
        (subscriber) => subscriber !== callback
      );
    };
  };
}

function getSingleSnapshot(id: `${number}`) {
  return () => {
    return {
      ...toasts[id],
    };
  };
}

function notify() {
  subscribers.forEach((subscriber) => subscriber());
}

function notifySingle(id: `${number}`) {
  toasts[id].subscribers.forEach((subscriber) => subscriber());
}

function close(id: `${number}`) {
  toasts[id] = {
    ...toasts[id],
    life: "dead",
    version: toasts[id].version + 1,
  };
  notifySingle(id);
}

function update(
  id: `${number}`,
  toast: Partial<Omit<ToastBody, "life"> & Partial<ToastOption>>
) {
  toasts[id] = {
    ...toasts[id],
    ...toast,
    version: toasts[id].version + 1,
  };
  notifySingle(id);
}

function addToast(toast: Omit<ToastBody, "life"> & Partial<ToastOption>) {
  const id: `${number}` = `${index}`;
  toasts[id] = {
    ...toast,
    subscribers: [],
    life: "born",
    version: 0,
  };
  index += 1;
  notify();

  return {
    update: (toast: Partial<Omit<ToastBody, "life"> & Partial<ToastOption>>) =>
      update(id, toast),
    close: () => close(id),
  };
}

function useToast() {
  return {
    toast: addToast,
    update,
    close,
  };
}

const ToastTemplate = ({
  id,
  globalOption,
}: {
  id: `${number}`;
  globalOption: ToastOption;
}) => {
  const [toast, setToast] = React.useState<(typeof toasts)[`${number}`]>(
    toasts[id]
  );
  const ref = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    subscribeSingle(id)(() => {
      setToast(getSingleSnapshot(id)());
    });
  }, []);

  const toastData = {
    ...globalOption,
    ...toast,
  };

  React.useEffect(() => {
    if (toastData.life === "born") {
      toasts[id] = {
        ...toasts[id],
        life: "normal",
        version: toasts[id].version + 1,
      };
      notifySingle(id);
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
        console.log("not found current");
      } else if (ref.current.computedStyleMap !== undefined) {
        transitionDuration = ref.current
          .computedStyleMap()
          .get("transition-duration") as { value: number; unit: string };
        console.log(
          `calculated transition duration via computedStyleMap ${transitionDuration}`
        );
      } else {
        const style = /(\d+(\.\d+)?)(.+)/.exec(
          window.getComputedStyle(ref.current).transitionDuration
        );
        transitionDuration = style
          ? {
              value: parseFloat(style[1] ?? "0"),
              unit: style[3] ?? style[2] ?? "s",
            }
          : null;
        console.log(
          `calculated transition duration via getComputedStyle ${JSON.stringify(transitionDuration)}`
        );
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
      setTimeout(() => {
        delete toasts[id];
        notify();
      }, calculatedTransitionDuration);
    }
  }, [toastData.version]);

  return (
    <div
      className={toastVariant({
        status: toastData.status,
        life: toastData.life,
      })}
      ref={ref}
    >
      {toastData.closeButton && (
        <button className="absolute top-2 right-2" onClick={() => close(id)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.2rem"
            height="1.2rem"
            viewBox="0 0 24 24"
          >
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

const Toaster = ({
  defaultOption,
}: {
  defaultOption?: Partial<ToastOption>;
}) => {
  const [toastList, setToastList] = React.useState<typeof toasts>(toasts);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setToastList(getSnapshot());
    });
    return unsubscribe;
  }, []);

  const option = React.useMemo(() => {
    return {
      ...defaultToastOption,
      ...defaultOption,
    };
  }, [defaultOption]);

  return (
    <>
      {ReactDOM.createPortal(
        <div className="fixed p-4 flex flex-col gap-4 top-0 right-0 w-full md:max-w-md md:bottom-0 md:top-auto pointer-events-none z-40">
          {Object.entries(toastList).map(([id]) => (
            <ToastTemplate
              key={id}
              id={id as `${number}`}
              globalOption={option}
            />
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

export { Toaster, useToast };
