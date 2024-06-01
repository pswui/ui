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

const overrideComponents = {
  pre: (props: any) => <pre {...props} className={`${props.className} hljs`} />,
  code: (props: any) => (
    <code
      {...props}
      className={`${props.className} rounded-md bg-neutral-800 text-orange-500 font-light p-1 before:content-none after:content-none`}
    />
  ),
  table: (props: any) => (
    <div className="overflow-auto">
      <table {...props} className={`${props.className}`} />
    </div>
  ),
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
