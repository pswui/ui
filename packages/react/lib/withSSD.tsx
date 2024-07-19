import type { ComponentType } from "react";
import { ServerSideDocumentFallback } from "./ssrFallback";

function withServerSideDocument<P extends {}>(
  Component: ComponentType<P>,
): ComponentType<P> {
  const SSDocumentFallbackWrapper = (props: P) => {
    return (
      <ServerSideDocumentFallback>
        {() => <Component {...props} />}
      </ServerSideDocumentFallback>
    );
  };

  return SSDocumentFallbackWrapper;
}

export { withServerSideDocument };
