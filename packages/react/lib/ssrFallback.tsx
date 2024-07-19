import { type ReactNode, useEffect, useState } from "react";

/**
 * This component allows components to use `document` as like they're always in the client side.
 * Return null if there is no `document` (which represents it's server side) or initial render(to avoid hydration error).
 */
function ServerSideDocumentFallback({
  children,
}: { children: () => ReactNode }) {
  const [initialRender, setInitialRender] = useState<boolean>(true);

  useEffect(() => {
    setInitialRender(false);
  }, []);

  if (typeof document === "undefined" /* server side */ || initialRender)
    return null;

  return children();
}

export { ServerSideDocumentFallback };
