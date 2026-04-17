# CLAUDE.md

## Overview

`@rnt-lib/core` — A React component library for building data-rich UIs. Single-repo with Storybook for docs and Playwright for testing.

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

## Release

Uses **bumpp** for version management:

1. `bun run release` — bumps version, commits, pushes, creates git tag
2. CI triggers on `v*` tags — runs check, test, build, publishes to npm with provenance
