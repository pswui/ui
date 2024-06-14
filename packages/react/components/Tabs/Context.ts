import React from "react";

export interface Tab {
  name: string;
}

export interface TabContextBody {
  tabs: Tab[];
  active: [number, string] /* index, name */;
}

export const TabContext = React.createContext<
  [TabContextBody, React.Dispatch<React.SetStateAction<TabContextBody>>]
>([
  {
    tabs: [],
    active: [0, ""],
  },
  () => {
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
      console.warn(
        "It seems like you're using TabContext outside of provider.",
      );
    }
  },
]);
