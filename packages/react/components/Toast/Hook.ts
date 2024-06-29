import { addToast, close, update } from "./Store";

export function useToast() {
  return {
    toast: addToast,
    update,
    close,
  };
}
