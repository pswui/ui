import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  redirect,
} from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "./Home";
import DocsLayout from "./DocsLayout";
import ErrorBoundary from "./ErrorHandler";
import DynamicLayout from "./DynamicLayout";
import { Code } from "./components/LoadedCode";

import DocsIntroduction, {
  tableOfContents as docsIntroductionToc,
} from "./docs/introduction.mdx";
import DocsInstallation, {
  tableOfContents as docsInstallationToc,
} from "./docs/installation.mdx";

import { HeadingContext } from "./HeadingContext";
import React, {
  ForwardedRef,
  forwardRef,
  useContext,
  useEffect,
  useRef,
} from "react";

function buildThresholdList() {
  const thresholds: number[] = [];
  const numSteps = 20;

  for (let i = 1.0; i <= numSteps; i++) {
    const ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}

function HashedHeaders(Level: `h${1 | 2 | 3 | 4 | 5 | 6}`) {
  return (prop: any, ref: ForwardedRef<HTMLHeadingElement>) => {
    const internalRef = useRef<HTMLHeadingElement | null>(null);
    const [_, setActiveHeadings] = useContext(HeadingContext);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([{ target, intersectionRatio }]) => {
          if (intersectionRatio > 0.5) {
            setActiveHeadings((prev) => [...prev, target.id]);
          } else {
            setActiveHeadings((prev) => prev.filter((id) => id !== target.id));
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: buildThresholdList(),
        },
      );
      if (internalRef.current) {
        observer.observe(internalRef.current);
      }
      return () => {
        observer.disconnect();
      };
    }, [internalRef.current]);

    return (
      <Level
        {...prop}
        className={`${prop.className}`}
        ref={(el) => {
          internalRef.current = el;
          if (typeof ref === "function") {
            ref(el);
          } else if (el && ref) {
            ref.current = el;
          }
        }}
      />
    );
  };
}

const overrideComponents = {
  pre: forwardRef<HTMLDivElement, { children: React.ReactElement }>(
    (props, ref) => {
      const {
        props: { children, className },
      } = React.cloneElement(React.Children.only(props.children));

      const language =
        (typeof className !== "string" || !className.includes("language-")
          ? "typescript"
          : /language-([a-z]+)/.exec(className)![1]) ?? "typescript";

      return (
        <Code ref={ref} language={language}>
          {children as string}
        </Code>
      );
    },
  ),
  code: forwardRef<HTMLElement, any>((props: any, ref) => (
    <code
      ref={ref}
      {...props}
      className={`${props.className} rounded-md bg-neutral-800 text-orange-500 font-light p-1 before:content-none after:content-none`}
    />
  )),
  table: forwardRef<HTMLTableElement, any>((props: any, ref) => (
    <div className="overflow-auto">
      <table ref={ref} {...props} className={`${props.className}`} />
    </div>
  )),
  h1: forwardRef<HTMLHeadingElement, any>(HashedHeaders("h1")),
  h2: forwardRef<HTMLHeadingElement, any>(HashedHeaders("h2")),
  h3: forwardRef<HTMLHeadingElement, any>(HashedHeaders("h3")),
  h4: forwardRef<HTMLHeadingElement, any>(HashedHeaders("h4")),
  h5: forwardRef<HTMLHeadingElement, any>(HashedHeaders("h5")),
  h6: forwardRef<HTMLHeadingElement, any>(HashedHeaders("h6")),
};

const docsModules = import.meta.glob("./docs/components/*.mdx");

const routes = Object.keys(docsModules).map((path) => {
  const sfPath = path.split("/").pop()?.replace(".mdx", "");

  return (
    <Route
      key={path}
      path={sfPath}
      lazy={async () => {
        const { default: C, tableOfContents } = await import(
          `./docs/components/${sfPath}.mdx`
        );
        return {
          Component: () => (
            <DynamicLayout toc={tableOfContents}>
              <C components={overrideComponents} />
            </DynamicLayout>
          ),
        };
      }}
    />
  );
});

const REDIRECTED_404 = /^\?(\/([a-zA-Z0-9\-_]+\/?)+)(&.*)*$/;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />} errorElement={<ErrorBoundary />}>
      <Route
        index
        loader={() =>
          REDIRECTED_404.test(window.location.search)
            ? redirect(REDIRECTED_404.exec(window.location.search)?.[1] ?? "/")
            : true
        }
        element={<Home />}
      />
      <Route path="docs" element={<DocsLayout />}>
        <Route index loader={() => redirect("/docs/introduction")} />
        <Route
          path="introduction"
          element={
            <DynamicLayout toc={docsIntroductionToc}>
              <DocsIntroduction />
            </DynamicLayout>
          }
        />
        <Route
          path="installation"
          element={
            <DynamicLayout toc={docsInstallationToc}>
              <DocsInstallation />
            </DynamicLayout>
          }
        />
        <Route path="components">
          <Route
            index
            loader={() =>
              redirect(
                `/docs/components/${Object.keys(docsModules)[0]
                  .split("/")
                  .pop()
                  ?.replace(".mdx", "")}`,
              )
            }
          />
          {routes}
        </Route>
      </Route>
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
