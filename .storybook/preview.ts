import addonA11y from "@storybook/addon-a11y";
import docsAddon from "@storybook/addon-docs";
import vitestAddon from "@storybook/addon-vitest";
import { definePreview } from "@storybook/react-vite";

export default definePreview({
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
  addons: [docsAddon(), addonA11y(), vitestAddon()],
});
