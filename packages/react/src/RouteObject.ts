export default {
  mainNav: [
    {
      path: "/docs",
      name: "Docs",
      eq: (pathname: string) => pathname.startsWith("/docs") && !pathname.startsWith("/docs/components")
    },
    {
      path: "/docs/components",
      name: "Components",
      eq: (pathname: string) => pathname.startsWith("/docs/components")
    },
    {
      path: "https://github.com/p-sw/ui",
      name: "Github",
      eq: () => false
    }
  ],
  sideNav: {
    "Documents": [
      {
        path: "/docs",
        name: "Introduction",
        eq: (pathname: string) => pathname === "/docs"
      },
      {
        path: "/docs/installation",
        name: "Installation",
        eq: (pathname: string) => pathname === "/docs/installation"
      }
    ],
    "Components": [
      {
        path: "/docs/components/button",
        name: "Button",
        eq: (pathname: string) => pathname === "/docs/components/button"
      },
      {
        path: "/docs/components/checkbox",
        name: "Checkbox",
        eq: (pathname: string) => pathname === "/docs/components/checkbox"
      }
    ]
  }
}

