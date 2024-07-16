import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
} from "react";

/**
 * =========================
 * DialogContext
 * =========================
 */

export interface IDialogContext {
  opened: boolean;
  ids: {
    dialog: string;
    title: string;
    description: string;
  };
}

export const initialDialogContext: IDialogContext = {
  opened: false,
  ids: { title: "", dialog: "", description: "" },
};
export const DialogContext = createContext<
  [IDialogContext, Dispatch<SetStateAction<IDialogContext>>]
>([
  initialDialogContext,
  () => {
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
      console.warn(
        "It seems like you're using DialogContext outside of a provider.",
      );
    }
  },
]);

export const useDialogContext = () => useContext(DialogContext);
