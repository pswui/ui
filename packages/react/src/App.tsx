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

import DocsIntroduction, {
  tableOfContents as docsIntroductionToc,
} from "./docs/docs/introduction.mdx";
import DocsInstallation, {
  tableOfContents as docsInstallationToc,
} from "./docs/docs/installation.mdx";

import ComponentsButton, {
  tableOfContents as componentsButtonToc,
} from "./docs/components/Button.mdx";
import ComponentsCheckbox, {
  tableOfContents as componentsCheckboxToc,
} from "./docs/components/Checkbox.mdx";
import ComponentsDialog, {
  tableOfContents as componentsDialogToc,
} from "./docs/components/Dialog.mdx";
import ComponentsDrawer, {
  tableOfContents as componentsDrawerToc,
} from "./docs/components/Drawer.mdx";
import ComponentsLabel, {
  tableOfContents as componentsLabelToc,
} from "./docs/components/Label.mdx";
import ComponentsSwitch, {
  tableOfContents as componentsSwitchToc,
} from "./docs/components/Switch.mdx";
import ComponentsTabs, {
  tableOfContents as componentsTabsToc,
} from "./docs/components/Tabs.mdx";
import ComponentsToast, {
  tableOfContents as componentsToastToc,
} from "./docs/components/Toast.mdx";
import ComponentsTooltip, {
  tableOfContents as componentsTooltipToc,
} from "./docs/components/Tooltip.mdx";

import { ForwardedRef, forwardRef, useContext, useEffect, useRef } from "react";
import { HeadingContext } from "./HeadingContext";

function buildThresholdList() {
  let thresholds = [];
  let numSteps = 20;

  for (let i = 1.0; i <= numSteps; i++) {
    let ratio = i / numSteps;
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
        }
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
  pre: forwardRef<HTMLPreElement, any>((props: any, ref) => (
    <pre ref={ref} {...props} className={`${props.className} hljs`} />
  )),
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />} errorElement={<ErrorBoundary />}>
      <Route index element={<Home />} />
      <Route path="docs" element={<DocsLayout />}>
        <Route
          index
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
          <Route index loader={() => redirect("/docs/components/button")} />
          <Route
            path="button"
            element={
              <DynamicLayout toc={componentsButtonToc}>
                <ComponentsButton components={overrideComponents} />
              </DynamicLayout>
            }
          />
          <Route
            path="checkbox"
            element={
              <DynamicLayout toc={componentsCheckboxToc}>
                <ComponentsCheckbox components={overrideComponents} />
              </DynamicLayout>
            }
          />
          <Route
            path="dialog"
            element={
              <DynamicLayout toc={componentsDialogToc}>
                <ComponentsDialog components={overrideComponents} />
              </DynamicLayout>
            }
          />
          <Route
            path="drawer"
            element={
              <DynamicLayout toc={componentsDrawerToc}>
                <ComponentsDrawer components={overrideComponents} />
              </DynamicLayout>
            }
          />
          <Route
            path="label"
            element={
              <DynamicLayout toc={componentsLabelToc}>
                <ComponentsLabel components={overrideComponents} />
              </DynamicLayout>
            }
          />
          <Route
            path="switch"
            element={
              <DynamicLayout toc={componentsSwitchToc}>
                <ComponentsSwitch components={overrideComponents} />
              </DynamicLayout>
            }
          />
          <Route
            path="tabs"
            element={
              <DynamicLayout toc={componentsTabsToc}>
                <ComponentsTabs components={overrideComponents} />
              </DynamicLayout>
            }
          />
          <Route
            path="toast"
            element={
              <DynamicLayout toc={componentsToastToc}>
                <ComponentsToast components={overrideComponents} />
              </DynamicLayout>
            }
          />
          <Route
            path="tooltip"
            element={
              <DynamicLayout toc={componentsTooltipToc}>
                <ComponentsTooltip components={overrideComponents} />
              </DynamicLayout>
            }
          />
        </Route>
      </Route>
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
