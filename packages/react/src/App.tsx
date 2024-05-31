import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "./Home";
import DocsLayout from "./DocsLayout";
import ErrorBoundary from "./ErrorHandler";

import Introduction from "./docs/getting-started/introduction.mdx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />} errorElement={<ErrorBoundary />}>
      <Route index element={<Home />} />
      <Route path="/docs" element={<DocsLayout />}>
        <Route index element={<Introduction />} />
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
