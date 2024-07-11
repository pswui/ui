import type { ComponentType } from "react";
import { ServerSideDocumentFallback } from "./ssrFallback";

function withServerSideDocument<P extends {}>(
  Component: ComponentType<P>,
): ComponentType<P> {
  return (props) => {
    return (
      <ServerSideDocumentFallback>
        <Component {...props} />
      </ServerSideDocumentFallback>
    );
  };
}

export { withServerSideDocument };
