import React from "react";
import type { Preview } from "@storybook/react";
import type { DecoratorFunction, Renderer } from "@storybook/types";
import { useEffect, addons, useParameter } from "@storybook/preview-api";
import "../src/tailwind.css";
import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from "@storybook/blocks";

const classStringToArray = (classString: string) =>
  classString.split(" ").filter(Boolean);

const withThemeByClassName = <TRenderer extends Renderer = any>(
  themes: Record<string, string>,
  defaultTheme: string,
  parentSelector: string
): DecoratorFunction<TRenderer> => {
  addons.getChannel().emit("storybook/themes/REGISTER_THEMES", {
    defaultTheme,
    themes: Object.keys(themes),
  });

  return (storyFn, context) => {
    const { themeOverride } = useParameter<{ themeOverride?: string }>(
      "themes",
      {}
    ) as { themeOverride?: string };
    const selected = context.globals["theme"] || "";

    useEffect(() => {
      const selectedThemeName = themeOverride || selected || defaultTheme;
      const parentElement = document.querySelectorAll(parentSelector);

      if (!parentElement) {
        return;
      }

      Object.entries(themes)
        .filter(([themeName]) => themeName !== selectedThemeName)
        .forEach(([_, className]) => {
          const classes = classStringToArray(className);
          if (classes.length > 0) {
            parentElement.forEach((element) =>
              element.classList.remove(...classes)
            );
          }
        });

      const newThemeClasses = classStringToArray(themes[selectedThemeName]);

      if (newThemeClasses.length > 0) {
        parentElement.forEach((element) => {
          console.log(element);
          element.classList.add(...newThemeClasses);
        });
      }
    }, [themeOverride, selected, parentSelector]);

    return storyFn();
  };
};

export const decorators = [
  withThemeByClassName(
    {
      light: "light",
      dark: "dark",
    },
    "dark",
    "html,.sbdocs.sbdocs-preview"
  ),
];

const autoDocsTemplate = () => (
  <>
    <Title />
    <Subtitle />
    <Description />
    <Primary />
    <Controls />
    <Stories />
  </>
);

const preview: Preview = {
  parameters: {
    /*controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },*/
    docs: {
      page: autoDocsTemplate,
    },
  },
  tags: ["autodocs"],
};

export default preview;
