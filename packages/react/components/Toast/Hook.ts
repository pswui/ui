import { addToast, update, close } from "./Store";

export function useToast() {
  return {
    toast: addToast,
    update,
    close,
  };
}
