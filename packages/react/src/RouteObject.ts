const docsModules = import.meta.glob("./docs/components/*.mdx");

const mainNav = [
  {
    path: "/docs",
    name: "Docs",
    eq: (pathname: string) =>
      pathname.startsWith("/docs") && !pathname.startsWith("/docs/components"),
  },
  {
    path: "/docs/components",
    name: "Components",
    eq: (pathname: string) => pathname.startsWith("/docs/components"),
  },
  {
    path: "https://github.com/p-sw/ui",
    name: "Github",
    eq: () => false,
  },
];

const sideNav: Record<
  string,
  { path: string; name: string; eq: (path: string) => boolean }[]
> = {
  Documents: [
    {
      path: "/docs/introduction",
      name: "Introduction",
      eq: (pathname: string) => pathname === "/docs/introduction",
    },
    {
      path: "/docs/installation",
      name: "Installation",
      eq: (pathname: string) => pathname === "/docs/installation",
    },
    {
      path: "/docs/configuration",
      name: "Configuration",
      eq: (pathname: string) => pathname === "/docs/configuration",
    },
  ],
  Components: [],
};

Object.keys(docsModules).forEach((path) => {
  const name = (path.split("/").pop() ?? "").replace(".mdx", "");
  sideNav["Components"].push({
    path: path.replace("./docs", "/docs").replace(".mdx", ""),
    name: name.charAt(0).toUpperCase() + name.slice(1),
    eq: (pathname: string) =>
      pathname === path.replace("./docs", "/docs").replace(".mdx", ""),
  });
});

export default {
  mainNav,
  sideNav,
};
