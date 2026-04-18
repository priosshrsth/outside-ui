import path from "node:path";

import { defineMain } from "@storybook/react-vite/node";
import remarkGfm from "remark-gfm";

export default defineMain({
  framework: "@storybook/react-vite",
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    {
      name: "@storybook/addon-docs",
      // remark-gfm enables GitHub-flavoured markdown in MDX:
      // pipe tables, strikethrough, task lists. Without it, a
      // table written with `|` is rendered as raw text.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@chromatic-com/storybook",
  ],
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
