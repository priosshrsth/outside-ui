import path from "node:path";

import storybookTest from "@storybook/addon-vitest/vitest-plugin";
// Runtime + type imports BOTH go through vite-plus, not upstream vitest.
// Reason: `vitest` is aliased via `pnpm.overrides` in package.json to
// `@voidzero-dev/vite-plus-test` (version 0.1.18). Physically,
// `node_modules/vitest` still contains real upstream vitest@4.1.4 — bun's
// resolver follows the override at runtime, but TypeScript just reads the
// folder contents. Importing from `vitest/config` would therefore give us
// TS types from the real 4.1.4 package, but the `playwright()` provider
// returns a `BrowserProviderOption` branded by the aliased 0.1.18 package.
// Structurally identical, nominally different — TS2769 "no overload
// matches" on `provider: playwright()`. Routing both imports through
// vite-plus's own re-exports keeps runtime and types on the same tree.
// Two symptoms this fixes:
//   (a) the silent browser-handshake hang ("Running mixed versions is
//       not supported") — fixed already for `playwright`; keeping config
//       import consistent prevents the same drift elsewhere.
//   (b) TS2769 on `provider: playwright()`.
import { playwright } from "vite-plus/test/browser-playwright";
import { defineConfig } from "vite-plus/test/config";

export default defineConfig({
  resolve: {
    alias: [
      { find: /^src$/, replacement: path.resolve(import.meta.dirname, "src") },
      {
        find: /^src\/(.*)$/,
        replacement: path.resolve(import.meta.dirname, "src") + "/$1",
      },
      // `@storybook/addon-vitest` imports `@vitest/browser/context` and
      // `@vitest/browser-playwright` directly, which would pull in real
      // `@vitest/browser@4.1.4` alongside the aliased `vitest@0.1.18`
      // (see `pnpm.overrides` in package.json). That mismatch triggers
      // "Running mixed versions is not supported" and the browser handshake
      // silently hangs. These aliases route the Storybook plugin's imports
      // through `@voidzero-dev/vite-plus-test`, which bundles compatible
      // copies of both packages.
      // NOTE: `@voidzero-dev/vite-plus-test/browser/context` (with the
      // `/context` suffix) resolves to an internal dist file missing the
      // `server` export. The bare `/browser` subpath resolves to the
      // canonical browser-mode stub (with `server`, `page`, `userEvent`
      // etc. as virtual exports) — that's what Storybook's addon-vitest
      // needs. Both aliases therefore point to the same stub file.
      {
        find: /^@vitest\/browser\/context$/,
        replacement: "@voidzero-dev/vite-plus-test/browser",
      },
      {
        find: /^@vitest\/browser$/,
        replacement: "@voidzero-dev/vite-plus-test/browser",
      },
      {
        find: /^@vitest\/browser-playwright$/,
        replacement: "@voidzero-dev/vite-plus-test/browser-playwright",
      },
    ],
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.resolve(".storybook") })],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
