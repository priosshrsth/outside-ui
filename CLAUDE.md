# CLAUDE.md

## Overview

`@anitshrsth/ui` — A React component library for building data-rich UIs. Single-repo with Storybook for docs and Playwright for testing.

**Stack:** Bun, Vite+ (vp CLI), TypeScript, OXC (oxlint + oxfmt), TanStack Table.

## Commands

```sh
bun install              # Install dependencies
bun run build            # Build library (vp pack)
bun run dev              # Storybook dev server (port 6006)
bun run dev:lib          # Library watch mode (vp pack --watch)
bun run check            # Lint + format + type check (vp check)
bun run test             # Run tests (vp test)
bun run storybook:build  # Build static Storybook
bun run release          # Bump version + commit + push + tag (bumpp)
```

## Architecture

- **`src/`** — Library source code, built with `vp pack` (unbundled ESM + DTS via tsgo)
  - `src/table/` — Table + Pagination (wraps @tanstack/react-table), sort, error/empty states, data-slot pattern
  - `src/search-query/` — SearchQueryProvider context for page/limit/sort/search state
  - `src/lazy-search/` — Debounced search hook
  - `src/set-search-params/` — URL query string sync utility
- **`stories/`** — Storybook stories
- **`dist/`** — Build output (ESM `.mjs` + `.d.mts` declarations)

## Linting & Formatting

Uses **OXC** via Vite+. Config in `vite.config.ts`:

- **oxlint**: type-aware, kebab-case filenames, consistent type imports
- **oxfmt**: 80 chars, 2 spaces, semicolons, es5 trailing commas, sorted imports

Pre-commit hook runs `vp check --fix` on staged files.

## Code Style

- `type` keyword over `interface`
- `src/*` path alias for imports
- kebab-case filenames
- Consistent type imports (`import type { ... }`)
- React 19+ — `ref` as prop, no `forwardRef`
- `data-slot` attributes for styling hooks (no bundled CSS)

## Stories (Storybook 10 CSF Factories)

Every story in `stories/` uses the **CSF Factories API** (`preview.meta` +
`meta.story`) — not the classic `Meta<T>` / `StoryObj<T>` pattern. All new
story files MUST follow this shape:

```tsx
import preview from "../.storybook/preview";
import { X } from "src/x";

const meta = preview.meta({
  title: "Components/X",
  component: X,                 // omit for hook/provider/context stories
  parameters: { layout: "centered" | "padded" },
  argTypes: { ... },            // controls
  args: { ... } satisfies Args, // defaults
});
export default meta;

export const Primary = meta.story({
  args: { ... },
  render: (a) => <Demo {...(a as Args)} />,   // optional
  play: async ({ canvasElement, args }) => { ... },
});
```

**Do not:**

- `import type { Meta, StoryObj } from "@storybook/react-vite"` — dead pattern
- Declare a `type Story = StoryObj<typeof meta>` alias — `meta.story()`
  types the output directly
- Inline-define a meta object of type `Meta<T>` and default-export it —
  always flow through `preview.meta()`

**Notes:**

- `.storybook/preview.ts` default-exports the `definePreview` result — that's
  the `preview` object stories import.
- For generic components (Select / Combobox / Table), the Root itself is
  a generic function. Stories typically cast `args as Args` inside
  `render` rather than trying to narrow at the `meta` level.

## Stories: a11y enforcement

`a11y: { test: "error" }` is set in `.storybook/preview.ts`. Axe runs on
every story and violations FAIL the test suite. When adding stories:

- `<input>` / search-style elements need `aria-label`
- Buttons that render only icons need `aria-label` (see Pagination's
  `prevAriaLabel` / `nextAriaLabel` for the pattern)
- Check colour-contrast for any story demoing a custom brand palette
- Storybook's a11y panel in the UI previews the same rules per-story

## UI tests (Playwright via Vitest + play functions)

Tests run in headless Chromium under Storybook 10's `@storybook/addon-vitest`.
A story's `play` function doubles as a test — it runs automatically under
`bun run test`.

Pattern:

```tsx
play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const target = canvas.getByRole("tab", { name: "Activity" });

  await userEvent.click(target);

  await expect(target).toHaveAttribute("aria-selected", "true");
  await waitFor(
    () => expect(canvas.getByTestId("committed")).toHaveTextContent(/NEW/),
    { timeout: 1500 }
  );
},
```

**Key conventions:**

- Query by role first (`getByRole("button", { name: "..." })`). Fall back
  to `getByTestId` for internal-state readouts.
- Use `data-testid="committed"` (or similar) on any element showing
  state the test needs to assert against — avoids brittle text matching.
- For **portalled content** (Dialog, Select, Combobox, Popover popups),
  `within(canvasElement)` can't see them. Either:
  1. Drive via keyboard (`Enter` / `ArrowDown` / `Enter`) so you never
     query into the portal — see `Select > Debounced`, or
  2. Query `document.body` / `screen` for portalled items.
- `waitFor` timeouts: use 3–4× the debounce / animation delay you're
  waiting on, to absorb CI jitter.
- Don't use `toHaveTextContent("")` — that matches every element.
  Use exact text (`.textContent === "Immediate: "`) or a regex.

## Release

Uses **bumpp** for version management:

1. `bun run release` — bumps version, commits, pushes, creates git tag
2. CI triggers on `v*` tags — runs check, test, build, publishes to npm with provenance
