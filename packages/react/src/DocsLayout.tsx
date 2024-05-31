import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import RouteObject from "./RouteObject";

function SideNav() {
  const location = useLocation();

  return (
    <nav className="flex flex-col justify-start items-start gap-8 p-8">
      {Object.entries(RouteObject.sideNav).map(([categoryName, links]) => {
        return (
          <section
            className="flex flex-col gap-2 justify-center items-start"
            key={categoryName}
          >
            <span className="font-bold">{categoryName}</span>
            {links.map((link) => (
              <Link
                to={link.path}
                key={link.path}
                className="text-sm text-neutral-500 hover:text-neutral-700 data-[active=true]:text-current"
                data-active={link.eq(location.pathname)}
              >
                {link.name}
              </Link>
            ))}
          </section>
        );
      })}
    </nav>
  );
}

function DocsLayout() {
  return (
    <div className="flex-grow grid grid-cols-[16rem_1fr] w-full max-w-5xl mx-auto">
      <SideNav />
      <main className="prose prose-lg p-8 dark:prose-invert">
        <Outlet />
      </main>
    </div>
  );
}

export default DocsLayout;
