import React from "react";

import { Button } from "@components/Button";
import {
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerRoot,
  DrawerTrigger,
} from "@components/Drawer";
import { Toaster } from "@components/Toast";

import { DocsLink, RouterProvider, useDocsRouter } from "./docs/router";
import {
  componentPages,
  documentPages,
  notFoundPage,
  pagesByPath,
  topNavItems,
} from "./docs/site";

function useActiveToc(ids: string[], hash: string): string | undefined {
  const [activeId, setActiveId] = React.useState<string | undefined>(
    hash ? hash.slice(1) : ids[0],
  );

  React.useEffect(() => {
    setActiveId(hash ? hash.slice(1) : ids[0]);
  }, [hash, ids]);

  React.useEffect(() => {
    if (ids.length === 0) {
      return;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.boundingClientRect.top - right.boundingClientRect.top,
          );

        if (visibleEntries[0]) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-96px 0px -60% 0px",
        threshold: [0.15, 0.5, 1],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [ids]);

  return activeId;
}

function MobileNav() {
  return (
    <div className="md:hidden">
      <DrawerRoot>
        <DrawerTrigger>
          <Button
            preset="ghost"
            size="icon"
            aria-label="Open navigation"
          >
            <span aria-hidden="true">≡</span>
          </Button>
        </DrawerTrigger>
        <DrawerOverlay>
          <DrawerContent
            position="left"
            maxSize="sm"
            aria-labelledby="docs-nav-title"
            aria-describedby="docs-nav-description"
          >
            <DrawerHeader>
              <div className="flex flex-col gap-1">
                <h2
                  id="docs-nav-title"
                  className="text-lg font-semibold"
                >
                  PSW/UI Docs
                </h2>
                <p
                  id="docs-nav-description"
                  className="text-sm text-neutral-500 dark:text-neutral-400"
                >
                  Navigate the docs and component pages.
                </p>
              </div>
            </DrawerHeader>
            <DrawerBody className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Top Level
                </span>
                {topNavItems.map((item) =>
                  item.href.startsWith("http") ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <DrawerClose key={item.href}>
                      <DocsLink
                        href={item.href}
                        className="text-base"
                      >
                        {item.label}
                      </DocsLink>
                    </DrawerClose>
                  ),
                )}
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Documents
                </span>
                {documentPages.map((page) => (
                  <DrawerClose key={page.path}>
                    <DocsLink
                      href={page.path}
                      className="text-base"
                    >
                      {page.navLabel}
                    </DocsLink>
                  </DrawerClose>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Components
                </span>
                {componentPages.map((page) => (
                  <DrawerClose key={page.path}>
                    <DocsLink
                      href={page.path}
                      className="text-base"
                    >
                      {page.navLabel}
                    </DocsLink>
                  </DrawerClose>
                ))}
              </div>
            </DrawerBody>
            <DrawerFooter>
              <DrawerClose>
                <Button preset="ghost">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </DrawerRoot>
    </div>
  );
}

function TopNav({ pathname }: { pathname: string }) {
  const isDocs =
    pathname.startsWith("/docs") && !pathname.startsWith("/docs/components");
  const isComponents = pathname.startsWith("/docs/components");

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-white/85 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-black/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-4">
          <MobileNav />
          <DocsLink
            href="/"
            className="text-lg font-semibold tracking-tight"
          >
            PSW/UI
          </DocsLink>
          <nav className="hidden items-center gap-3 md:flex">
            <DocsLink
              href="/docs"
              data-active={isDocs}
              className="rounded-full px-3 py-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900 data-[active=true]:bg-neutral-900 data-[active=true]:text-white dark:text-neutral-400 dark:hover:text-neutral-50 dark:data-[active=true]:bg-neutral-100 dark:data-[active=true]:text-neutral-950"
            >
              Docs
            </DocsLink>
            <DocsLink
              href="/docs/components/accordion"
              data-active={isComponents}
              className="rounded-full px-3 py-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900 data-[active=true]:bg-neutral-900 data-[active=true]:text-white dark:text-neutral-400 dark:hover:text-neutral-50 dark:data-[active=true]:bg-neutral-100 dark:data-[active=true]:text-neutral-950"
            >
              Components
            </DocsLink>
            <a
              href="https://github.com/pswui/ui"
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-3 py-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
            >
              GitHub
            </a>
          </nav>
        </div>
        <div className="hidden md:flex">
          <Button
            asChild
            preset="ghost"
          >
            <DocsLink href="/docs/installation">Install</DocsLink>
          </Button>
        </div>
      </div>
    </header>
  );
}

function SideNav({ pathname }: { pathname: string }) {
  return (
    <nav className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-auto md:flex md:flex-col md:gap-8">
      <section className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Documents
        </span>
        {documentPages.map((page) => (
          <DocsLink
            key={page.path}
            href={page.path}
            data-active={pathname === page.path}
            className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 data-[active=true]:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50 dark:data-[active=true]:text-neutral-50"
          >
            {page.navLabel}
          </DocsLink>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Components
        </span>
        {componentPages.map((page) => (
          <DocsLink
            key={page.path}
            href={page.path}
            data-active={pathname === page.path}
            className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 data-[active=true]:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50 dark:data-[active=true]:text-neutral-50"
          >
            {page.navLabel}
          </DocsLink>
        ))}
      </section>
    </nav>
  );
}

function OnThisPage({
  activeId,
  pathname,
  toc,
}: {
  activeId?: string;
  pathname: string;
  toc: { id: string; title: string }[];
}) {
  if (toc.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-auto xl:flex xl:flex-col xl:gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
        On This Page
      </span>
      {toc.map((item) => (
        <DocsLink
          key={item.id}
          href={`${pathname}#${item.id}`}
          data-active={activeId === item.id}
          className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 data-[active=true]:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50 dark:data-[active=true]:text-neutral-50"
        >
          {item.title}
        </DocsLink>
      ))}
    </nav>
  );
}

function AppContent() {
  const { location, navigate } = useDocsRouter();

  React.useEffect(() => {
    if (location.pathname === "/docs/components") {
      navigate(componentPages[0].path, { replace: true });
    }
  }, [location.pathname, navigate]);

  const currentPage =
    location.pathname === "/docs/components"
      ? componentPages[0]
      : pagesByPath[location.pathname];
  const page = currentPage ?? notFoundPage;

  React.useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.slice(1);
      const target = document.getElementById(targetId);

      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ block: "start", behavior: "smooth" });
        });
      }

      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.hash]);

  const activeToc = useActiveToc(
    page.toc.map((item) => item.id),
    location.hash,
  );

  const inDocs = page.section === "document" || page.section === "component";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fafaf8_0%,#ffffff_28%,#f5f5f4_100%)] text-neutral-950 dark:bg-[linear-gradient(180deg,#020617_0%,#000000_28%,#111827_100%)] dark:text-neutral-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,211,209,0.55),transparent_35%),radial-gradient(circle_at_top_right,rgba(187,247,208,0.15),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(186,230,253,0.12),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(38,38,38,0.6),transparent_35%),radial-gradient(circle_at_top_right,rgba(20,83,45,0.3),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(30,41,59,0.55),transparent_30%)]" />
      <div className="relative flex min-h-screen flex-col">
        <Toaster />
        <TopNav pathname={location.pathname} />

        {inDocs ? (
          <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-10 px-6 py-10 md:grid-cols-[13rem_minmax(0,1fr)] md:px-8 xl:grid-cols-[13rem_minmax(0,1fr)_12rem]">
            <SideNav pathname={location.pathname} />
            <div className="min-w-0">{page.render()}</div>
            <OnThisPage
              activeId={activeToc}
              pathname={page.path}
              toc={page.toc}
            />
          </main>
        ) : (
          page.render()
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
