import { Popover, PopoverTrigger, PopoverContent } from "@components/Popover.tsx";
import { Button } from "@components/Button.tsx";
import { useState } from "react";

const DarkIcon = () => {
  // ic:baseline-dark-mode
  return <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
    <path fill="currentColor"
          d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26a5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1"/>
  </svg>
}

const LightIcon = () => {
  // ic:baseline-light-mode
  return <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
    <path fill="currentColor"
          d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5M2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1m18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1M11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1m0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1M5.99 4.58a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41zm12.37 12.37a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41zm1.06-10.96a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0zM7.05 18.36a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0z"/>
  </svg>
}

export const ThemeSelector = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  return <Popover>
    <PopoverTrigger>
      <Button preset={"default"} size={"icon"}>
        {
          theme === "light" ? <LightIcon /> : <DarkIcon />
        }
      </Button>
    </PopoverTrigger>
    <PopoverContent anchor={"bottomCenter"}>
      <Button onClick={() => setTheme("dark")} preset={"ghost"} className={"gap-2"}>
        <DarkIcon />
        <span className={"whitespace-nowrap"}>Dark Mode</span>
      </Button>
      <Button onClick={() => setTheme("light")} preset={"ghost"} className={"gap-2"}>
        <LightIcon />
        <span className={"whitespace-nowrap"}>Light Mode</span>
      </Button>
    </PopoverContent>
  </Popover>
}