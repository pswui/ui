"use client";

import { useEffect, useState } from "react";

/**
 * This hook allows components to use `document` as like they're always in the client side.
 * Return undefined if there is no `document` (which represents it's server side) or initial render(to avoid hydration error).
 */
function useDocument(): undefined | Document {
  const [initialRender, setInitialState] = useState(true);

  useEffect(() => {
    setInitialState(false);
  }, []);

  if (typeof document === "undefined" || initialRender) return undefined;

  return document;
}

export { useDocument };
