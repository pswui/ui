import { createContext, useContext } from "react";

export interface IAccordionContext {
  value: string | null;
  collapsible: boolean;
  onItemToggle: (value: string) => void;
}

export const initialAccordionContext: IAccordionContext = {
  value: null,
  collapsible: false,
  onItemToggle: () => {
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
      console.warn(
        "It seems like you're using AccordionContext outside of a provider.",
      );
    }
  },
};

export const AccordionContext = createContext<IAccordionContext>(
  initialAccordionContext,
);

export const useAccordionContext = () => useContext(AccordionContext);

export interface IAccordionItemContext {
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
  onToggle: () => void;
}

export const initialAccordionItemContext: IAccordionItemContext = {
  value: "",
  open: false,
  disabled: false,
  triggerId: "",
  contentId: "",
  onToggle: () => {
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
      console.warn(
        "It seems like you're using AccordionItemContext outside of a provider.",
      );
    }
  },
};

export const AccordionItemContext = createContext<IAccordionItemContext>(
  initialAccordionItemContext,
);

export const useAccordionItemContext = () => useContext(AccordionItemContext);
