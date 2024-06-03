import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import RouteObject from "./RouteObject";
import { Toaster } from "@components/Toast";
import { Popover, PopoverContent, PopoverTrigger } from "@components/Popover";
import {
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerRoot,
  DrawerTrigger,
} from "@components/Drawer";

type Theme = "light" | "dark" | "system";

function ThemeButton() {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "system"
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("system", theme === "system");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Popover>
      <PopoverTrigger>
        <Button preset="ghost" size="icon">
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
      </PopoverTrigger>
      <PopoverContent anchor="bottomLeft" className="w-32">
        <Button
          preset="ghost"
          onClick={() => setTheme("light")}
          className="w-full px-2 py-1.5 text-sm"
        >
          Light
        </Button>
        <Button
          preset="ghost"
          onClick={() => setTheme("dark")}
          className="w-full px-2 py-1.5 text-sm"
        >
          Dark
        </Button>
        <Button
          preset="ghost"
          onClick={() => setTheme("system")}
          className="w-full px-2 py-1.5 text-sm"
        >
          System
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function TopNav() {
  const location = useLocation();

  return (
    <>
      <nav className="sticky top-0 z-20 bg-transparent backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800 w-full max-w-screen px-8 flex flex-row justify-center items-center h-16">
        <div
          data-role="wrapper"
          className="flex flex-row items-center justify-between w-full max-w-6xl text-lg"
        >
          <div
            data-role="links"
            className="hidden md:flex flex-row items-center gap-3"
          >
            <Link to="/" className="font-bold">
              PSW/UI
            </Link>
            {RouteObject.mainNav.map((link) => {
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  data-active={link.eq(location.pathname)}
                  className="font-light text-base data-[active=true]:text-current text-neutral-500 hover:text-neutral-700"
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div data-role="mobile-links" className="flex md:hidden">
            <DrawerRoot>
              <DrawerTrigger>
                <Button preset="ghost" size="icon">
                  {/* mdi:menu */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"
                    />
                  </svg>
                </Button>
              </DrawerTrigger>
              <DrawerOverlay className="z-[99]">
                <DrawerContent className="w-[300px] overflow-auto">
                  <DrawerClose className="float-right sticky top-0 right-0">
                    <Button preset="default" size="icon">
                      {/* mdi:close */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.2em"
                        height="1.2em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M19 6.41L17.59 5 12 9.27 6.41 5 5 6.41 9.27 11 5 17.59 6.41 19 12 14.73 17.59 19 19 17.59 13.41 12 19 6.41"
                        />
                      </svg>
                    </Button>
                  </DrawerClose>
                  <div className="flex flex-col justify-start items-start gap-6 text-lg">
                    <div className="flex flex-col justify-start items-start gap-3">
                      <DrawerClose>
                        <Link to="/" className="font-extrabold">
                          PSW/UI
                        </Link>
                      </DrawerClose>
                      {RouteObject.mainNav.map((link) => {
                        return (
                          <DrawerClose key={link.path}>
                            <Link to={link.path}>{link.name}</Link>
                          </DrawerClose>
                        );
                      })}
                    </div>
                    {Object.entries(RouteObject.sideNav).map(
                      ([categoryName, links]) => {
                        return (
                          <div
                            className="flex flex-col justify-start items-start gap-3"
                            key={categoryName}
                          >
                            <h2 className="font-bold">{categoryName}</h2>
                            {links.map((link) => {
                              return (
                                <DrawerClose key={link.path}>
                                  <Link
                                    to={link.path}
                                    className="text-base opacity-75"
                                  >
                                    {link.name}
                                  </Link>
                                </DrawerClose>
                              );
                            })}
                          </div>
                        );
                      }
                    )}
                  </div>
                </DrawerContent>
              </DrawerOverlay>
            </DrawerRoot>
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
      <Toaster className="top-16" />
      <TopNav />
      <Outlet />
    </>
  );
}

export default MainLayout;
