/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{components,stories,src}/**/*.{js,jsx,ts,tsx,css,mdx}"],
  darkMode: [
    "variant",
    [
      "@media (prefers-color-scheme: dark) { &:is(.system *) }",
      "&:is(.dark *)",
    ],
  ],
  theme: {
    extend: {},
  },
};
