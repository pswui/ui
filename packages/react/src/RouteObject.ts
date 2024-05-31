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
  ]
}