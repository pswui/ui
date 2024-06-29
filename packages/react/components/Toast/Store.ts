import type { ToastBody } from "./Variant";

export interface ToastOption {
  closeButton: boolean;
  closeTimeout: number | null;
}

export const defaultToastOption: ToastOption = {
  closeButton: true,
  closeTimeout: 3000,
};

let index = 0;
export const toasts: Record<
  `${number}`,
  ToastBody & Partial<ToastOption> & { subscribers: (() => void)[] }
> = {};
let subscribers: (() => void)[] = [];

/**
 * ====
 * Controls
 * ====
 */

export function subscribe(callback: () => void) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter((subscriber) => subscriber !== callback);
  };
}

export function getSnapshot() {
  return { ...toasts };
}

export function subscribeSingle(id: `${number}`) {
  return (callback: () => void) => {
    toasts[id].subscribers.push(callback);
    return () => {
      toasts[id].subscribers = toasts[id].subscribers.filter(
        (subscriber) => subscriber !== callback,
      );
    };
  };
}

export function getSingleSnapshot(id: `${number}`) {
  return () => {
    return {
      ...toasts[id],
    };
  };
}

export function notify() {
  for (const subscriber of subscribers) subscriber();
}

export function notifySingle(id: `${number}`) {
  for (const subscriber of toasts[id].subscribers) subscriber();
}

export function close(id: `${number}`) {
  toasts[id] = {
    ...toasts[id],
    life: "dead",
  };
  notifySingle(id);
}

export function update(
  id: `${number}`,
  toast: Partial<Omit<ToastBody, "life"> & Partial<ToastOption>>,
) {
  toasts[id] = {
    ...toasts[id],
    ...toast,
  };
  notifySingle(id);
}

export function addToast(
  toast: Omit<ToastBody, "life"> & Partial<ToastOption>,
) {
  const id: `${number}` = `${index}`;
  toasts[id] = {
    ...toast,
    subscribers: [],
    life: "born",
  };
  index += 1;
  notify();

  return {
    update: (toast: Partial<Omit<ToastBody, "life"> & Partial<ToastOption>>) =>
      update(id, toast),
    close: () => close(id),
  };
}
