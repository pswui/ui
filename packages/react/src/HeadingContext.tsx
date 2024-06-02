import { Dispatch, SetStateAction, createContext } from "react";

export const HeadingContext = createContext<
  [string[], Dispatch<SetStateAction<string[]>>]
>([
  [],
  () => {
    if (process.env && process.env.NODE_ENV === "development") {
      console.log("HeadingContext outside");
    }
  },
]);
