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
      "src/table/index.ts",
      "src/search-query/index.ts",
      "src/lazy-search/index.ts",
    ],
    unbundle: true,
    exports: true,
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
