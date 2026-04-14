import React from "react";

type AppLocation = {
  hash: string;
  pathname: string;
};

type RouterContextValue = {
  location: AppLocation;
  navigate: (href: string, options?: { replace?: boolean }) => void;
};

const RouterContext = React.createContext<RouterContextValue | null>(null);

const REDIRECTED_404 = /^\?(\/([a-zA-Z0-9\-_]+\/?)+)(&.*)*$/;

function normalizePath(pathname: string) {
  const cleanPath = pathname
    .replace(/\/index\.html$/, "/")
    .replace(/\/{2,}/g, "/");

  if (cleanPath === "") {
    return "/";
  }

  return cleanPath.length > 1 && cleanPath.endsWith("/")
    ? cleanPath.slice(0, -1)
    : cleanPath;
}

function getRedirectedPath(search: string) {
  const match = REDIRECTED_404.exec(search);

  return match?.[1] ? normalizePath(match[1]) : null;
}

function readLocation(): AppLocation {
  const redirectedPath = getRedirectedPath(window.location.search);

  return {
    pathname: normalizePath(redirectedPath ?? window.location.pathname),
    hash: window.location.hash,
  };
}

function isInternalHref(href: string) {
  try {
    const url = new URL(href, window.location.href);

    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

function RouterProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = React.useState<AppLocation>(() =>
    readLocation(),
  );

  React.useEffect(() => {
    const redirectedPath = getRedirectedPath(window.location.search);

    if (redirectedPath && redirectedPath !== window.location.pathname) {
      window.history.replaceState(
        window.history.state,
        "",
        `${redirectedPath}${window.location.hash}`,
      );
      setLocation(readLocation());
    }

    const onPopState = () => {
      setLocation(readLocation());
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const navigate = React.useCallback(
    (href: string, options?: { replace?: boolean }) => {
      if (!isInternalHref(href)) {
        window.location.assign(href);
        return;
      }

      const url = new URL(href, window.location.href);
      const nextHref = `${normalizePath(url.pathname)}${url.hash}`;
      const method = options?.replace ? "replaceState" : "pushState";

      if (
        nextHref === `${location.pathname}${location.hash}` &&
        method === "pushState"
      ) {
        return;
      }

      window.history[method](window.history.state, "", nextHref);
      setLocation(readLocation());
    },
    [location.hash, location.pathname],
  );

  const value = React.useMemo(
    () => ({
      location,
      navigate,
    }),
    [location, navigate],
  );

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

function useDocsRouter() {
  const context = React.useContext(RouterContext);

  if (!context) {
    throw new Error("useDocsRouter must be used inside RouterProvider.");
  }

  return context;
}

type DocsLinkProps = React.ComponentPropsWithoutRef<"a"> & {
  href: string;
};

const DocsLink = React.forwardRef<HTMLAnchorElement, DocsLinkProps>(
  ({ href, onClick, target, rel, download, ...props }, ref) => {
    const { navigate } = useDocsRouter();

    return (
      <a
        {...props}
        ref={ref}
        href={href}
        target={target}
        rel={rel}
        download={download}
        onClick={(event) => {
          onClick?.(event);

          if (
            event.defaultPrevented ||
            target === "_blank" ||
            download !== undefined ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0 ||
            !isInternalHref(href)
          ) {
            return;
          }

          event.preventDefault();
          navigate(href);
        }}
      />
    );
  },
);
DocsLink.displayName = "DocsLink";

export { DocsLink, RouterProvider, normalizePath, useDocsRouter };
