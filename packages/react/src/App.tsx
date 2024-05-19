import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import SideNav from "./SideNav";
import Home from "./Home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<SideNav />}>
      <Route index element={<Home />} />
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
