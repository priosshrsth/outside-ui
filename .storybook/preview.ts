/// <reference types="vite/client" />
import addonA11y from "@storybook/addon-a11y";
import docsAddon from "@storybook/addon-docs";
import vitestAddon from "@storybook/addon-vitest";
import { definePreview } from "@storybook/react-vite";
import React from "react";
import { INITIAL_VIEWPORTS } from "storybook/viewport";

import "../styles/index.css";
import "./theme-dark.css";

export default definePreview({
  // Generates an auto-docs page for every story whose meta sets
  // `component:`. Story files that deliberately omit `component:`
  // (hook / provider demos) are skipped. Hand-authored MDX pages
  // override / supplement the generated ones.
  tags: ["autodocs"],
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
    (Story, { globals, viewMode }) => {
      const theme = (globals.theme as string | undefined) ?? "light";
      // In docs (MDX) view, each <Canvas> embed sizes to its content —
      // a 100vh minHeight makes short stories leave a screenful of
      // white space below them. In standalone canvas view, fill the
      // viewport so stories look natural.
      const isDocs = viewMode === "docs";
      return React.createElement(
        "div",
        {
          "data-theme": theme,
          style: {
            padding: "1.25rem",
            minHeight: isDocs ? undefined : "100vh",
            boxSizing: "border-box",
          },
        },
        React.createElement(Story),
      );
    },
  ],
  addons: [docsAddon(), addonA11y(), vitestAddon()],
});
