import path from "node:path";

import { defineConfig } from "vite-plus";

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(import.meta.dirname, "src"),
    },
  },
  staged: {
    "*": "vp check --fix",
  },
  pack: {
    entry: [
      "src/index.ts",
      "src/accordion/index.ts",
      "src/button/index.ts",
      "src/combobox/index.ts",
      "src/dialog/index.ts",
      "src/checkbox-group/index.ts",
      "src/radio-group/index.ts",
      "src/select/index.ts",
      "src/tabs/index.ts",
      "src/table/index.ts",
      "src/toggle-group/index.ts",
      "src/search-query/index.ts",
      "src/lazy-search/index.ts",
      "src/use-deferred-change/index.ts",
    ],
    unbundle: true,
    exports: false,
    sourcemap: true,
    dts: {
      tsgo: true,
    },
    deps: {
      neverBundle: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@base-ui/react",
        "@base-ui/react/accordion",
        "@base-ui/react/checkbox",
        "@base-ui/react/checkbox-group",
        "@base-ui/react/combobox",
        "@base-ui/react/dialog",
        "@base-ui/react/popover",
        "@base-ui/react/radio",
        "@base-ui/react/radio-group",
        "@base-ui/react/separator",
        "@base-ui/react/select",
        "@base-ui/react/tabs",
        "@base-ui/react/toggle",
        "@base-ui/react/toggle-group",
        "@tanstack/react-table",
        "clsx",
      ],
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      "oxc/no-barrel-file": "off",
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
      "typescript/consistent-type-imports": "error",
      "import/no-duplicates": ["error", { preferInline: true }],
    },
  },
  fmt: {
    oxfmtrc: {
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: false,
      quoteProps: "as-needed",
      jsxSingleQuote: false,
      trailingComma: "es5",
      bracketSpacing: true,
      bracketSameLine: false,
      arrowParens: "always",
      endOfLine: "lf",
      experimentalSortPackageJson: true,
      experimentalSortImports: {
        ignoreCase: true,
        newlinesBetween: true,
        order: "asc",
      },
    },
  },
});
