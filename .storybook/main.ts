import path from "node:path";

import { defineMain } from "@storybook/react-vite/node";

export default defineMain({
  framework: "@storybook/react-vite",
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],
  viteFinal(config) {
    config.resolve ??= {};
    const existingAlias = config.resolve.alias;
    const baseAlias: Record<string, string> =
      existingAlias && !Array.isArray(existingAlias)
        ? (existingAlias as Record<string, string>)
        : {};
    config.resolve.alias = {
      ...baseAlias,
      src: path.resolve(import.meta.dirname, "../src"),
    };
    return config;
  },
});
