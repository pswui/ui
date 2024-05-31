import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import UnexpectedError from "./errors/Unexpected";
import PageNotFound from "./errors/PageNotFound";

function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <PageNotFound />;
    } else {
      return <UnexpectedError />;
    }
  } else {
    return <UnexpectedError />;
  }
}

export default ErrorBoundary;
