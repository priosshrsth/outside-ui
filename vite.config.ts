import { readdirSync } from "node:fs";
import path from "node:path";

import { defineConfig } from "vite-plus";

const STYLES_DIR = path.resolve(import.meta.dirname, "styles");

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
      "src/form/index.ts",
      "src/input/index.ts",
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
    // tsdown writes JS + DTS subpath exports into package.json based on the
    // `entry` list above. Adding a new entry automatically exposes it — no
    // manual package.json edit needed. CSS lives outside `dist/` (shipped via
    // the `files` field) so we mix it in via `customExports`: every file in
    // `styles/` becomes `./styles/<file>.css`, and `styles/index.css` maps to
    // the `./styles.css` barrel consumers import.
    exports: {
      packageJson: true,
      customExports(exports) {
        // tsdown collapses ESM-only entries to a bare string
        // (`"./accordion": "./dist/accordion/index.mjs"`). That works for
        // `moduleResolution: "bundler"` consumers via sibling .d.mts lookup,
        // but `nodenext` + some bundlers' strict mode need the explicit
        // `types` condition. Re-shape every JS subpath into a conditions
        // object pointing to both types and default.
        for (const [key, value] of Object.entries(exports)) {
          if (typeof value === "string" && value.endsWith(".mjs")) {
            exports[key] = {
              types: value.replace(/\.mjs$/, ".d.mts"),
              default: value,
            };
          }
        }
        // CSS subpaths (files live outside dist/, shipped via the `files`
        // field). Dropping a new file into styles/ auto-exports it.
        const cssFiles = readdirSync(STYLES_DIR).filter((f) => f.endsWith(".css"));
        for (const file of cssFiles) {
          const key = file === "index.css" ? "./styles.css" : `./styles/${file}`;
          exports[key] = `./styles/${file}`;
        }
        exports["./package.json"] = "./package.json";
        return exports;
      },
    },
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
