import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "../components/Button";

type Theme = "light" | "dark";

function ThemeButton() {
  const [theme, _setTheme] = useState<Theme>("light");
  function setTheme(t: Theme) {
    _setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }

  return (
    <Button
      preset="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {/* material-symbols:light-mode */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.2em"
        height="1.2em"
        viewBox="0 0 24 24"
        className="dark:hidden"
      >
        <path
          fill="currentColor"
          d="M12 17q-2.075 0-3.537-1.463T7 12t1.463-3.537T12 7t3.538 1.463T17 12t-1.463 3.538T12 17m-7-4H1v-2h4zm18 0h-4v-2h4zM11 5V1h2v4zm0 18v-4h2v4zM6.4 7.75L3.875 5.325L5.3 3.85l2.4 2.5zm12.3 12.4l-2.425-2.525L17.6 16.25l2.525 2.425zM16.25 6.4l2.425-2.525L20.15 5.3l-2.5 2.4zM3.85 18.7l2.525-2.425L7.75 17.6l-2.425 2.525z"
        />
      </svg>
      {/* material-symbols:dark-mode */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.2em"
        height="1.2em"
        viewBox="0 0 24 24"
        className="hidden dark:block"
      >
        <path
          fill="currentColor"
          d="M12 21q-3.75 0-6.375-2.625T3 12t2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21"
        />
      </svg>
    </Button>
  );
}

function TopNav() {
  const location = useLocation();

  return (
    <>
      <nav className="bg-transparent backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800 w-full max-w-screen px-2 flex flex-row justify-center items-center h-16">
        <div
          data-role="wrapper"
          className="flex flex-row items-center justify-between w-full max-w-6xl text-lg"
        >
          <div data-role="links" className="flex flex-row items-center gap-3">
            <Link to="/" className="font-bold">
              PSW/UI
            </Link>
            <Link
              to="/docs"
              data-active={
                location.pathname.startsWith("/docs") &&
                !location.pathname.startsWith("/docs/components")
              }
              className="font-light text-base data-[active=true]:text-current text-neutral-500 hover:text-neutral-700"
            >
              Docs
            </Link>
            <Link
              to="/docs/components"
              data-active={location.pathname.startsWith("/docs/components")}
              className="font-light text-base data-[active=true]:text-current text-neutral-500 hover:text-neutral-700"
            >
              Components
            </Link>
            <Link
              data-comment="external"
              to="/github"
              className="font-light text-base text-neutral-500 hover:text-neutral-700"
            >
              Github
            </Link>
          </div>
          <div data-role="controls" className="flex flex-row items-center">
            <ThemeButton />
          </div>
        </div>
      </nav>
    </>
  );
}

function MainLayout() {
  return (
    <>
      <TopNav />
      <Outlet />
    </>
  );
}

export default MainLayout;
