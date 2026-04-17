import addonA11y from "@storybook/addon-a11y";
import docsAddon from "@storybook/addon-docs";
import vitestAddon from "@storybook/addon-vitest";
import { definePreview } from "@storybook/react-vite";
import React from "react";
import { INITIAL_VIEWPORTS } from "storybook/viewport";

import "../styles/index.css";
import "./theme-dark.css";

export default definePreview({
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      /**
       * Strict: axe runs on every story and violations fail tests.
       * Levels: "todo" (panel only), "warn"/"error" (both block), "off".
       */
      test: "error",
    },
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
    backgrounds: {
      disable: true,
    },
  },
  globalTypes: {
    theme: {
      description: "Preview theme (toggles --ou-* CSS variables)",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, { globals }) => {
      const theme = (globals.theme as string | undefined) ?? "light";
      return React.createElement(
        "div",
        {
          "data-theme": theme,
          style: {
            padding: "1.25rem",
            minHeight: "100vh",
            boxSizing: "border-box",
          },
        },
        React.createElement(Story),
      );
    },
  ],
  addons: [docsAddon(), addonA11y(), vitestAddon()],
});
