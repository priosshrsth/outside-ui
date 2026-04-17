# outside-ui — TASKS

Prioritised backlog surfaced by integrating `@anitshrsth/ui@0.1.2` into the
c1-apps Appendix toolbar. Each task references the concrete regression it
unblocks and proposes a non-breaking API path where possible.

---

## [TASK-1] Select.Trigger hardcodes `width: 100%` + `min-width: 10rem`

**Priority:** P0
**Why:** In c1-apps `apps/appendix/src/components/appendix-list.tsx` the
filter row (`flex flex-wrap items-center gap-2`) wraps into a vertical
stack because every `[data-slot="select-trigger"]` claims the full row
width. Consumers had to add a `[data-slot="select-trigger"] { min-width: 0 }`
override in `packages/common/src/theme/_ou-tokens.css` AND pass
`className="h-8 w-auto min-w-0 text-xs px-3 gap-1"` to every trigger to
beat the `@layer outside-ui.components` defaults.
**Proposal:**

- Default to `width: auto`. Form-field usage opts in explicitly via
  `className="w-full"` (Tailwind) or a new `data-variant="field"` preset
  that restores `width: 100%` + `min-width: 10rem`.
- Expose layout tokens:
  - `--ou-select-trigger-width` (default `auto`)
  - `--ou-select-trigger-min-width` (default `0`)
  - `--ou-select-trigger-height-xs` / `-sm` / `-md` / `-lg`
- Add a dedicated `size="xs"` preset for dense toolbars (h-7, 12px).
  **Migration:** Non-breaking if defaults become permissive (`auto`/`0`) and
  the filled-width behaviour moves behind an opt-in. Form consumers add
  `className="w-full"` — most likely they already wrap Select in a grid/flex
  parent, so this usually already works.

---

## [TASK-2] Add `./styles/toggle-group.css` to `package.json#exports`

**Priority:** P0
**Why:** `styles/toggle-group.css` ships in the tarball (verified in the
installed 0.1.2 payload) but the `exports` map only lists
accordion/base/button/combobox/dialog/pagination/select/table/tabs. A
consumer doing selective imports (`@anitshrsth/ui/styles/toggle-group.css`)
hits a resolution error. `styles/index.css` still bundles it, so the
regression is latent — only bites tree-shaken setups.
**Proposal:** Add the missing subpath entries for every CSS file that
exists in `styles/` (`toggle-group.css`, `checkbox-group.css`,
`radio-group.css`, `index.css`).
**Migration:** Pure addition. No-op for existing consumers.

---

## [TASK-3] Expose a `data-has-value` affordance on Select.Trigger

**Priority:** P1
**Why:** Filter-bar pills (the "1 status", "Hotels" chips in the c1
Appendix toolbar) read as active only because c1 hand-derives
`hasValue = selectedArray.length > 0` in both `filter-select.tsx` and
`filter-multi-select.tsx` and conditionally appends
`border-primary/25 text-primary bg-primary/5 hover:bg-primary/10`. Every
consumer that builds a filter toolbar re-implements this.
**Proposal:**

- Auto-set `data-has-value` on `[data-slot="select-trigger"]` when the
  root's value is truthy (non-empty string, non-empty array).
- Ship default styles keyed off the attribute, driven by new tokens:
  - `--ou-select-trigger-active-bg`
  - `--ou-select-trigger-active-border`
  - `--ou-select-trigger-active-fg`
- Defaults can be unset/transparent so the affordance is opt-in via
  tokens — zero visual change if the consumer doesn't set them.
  **Migration:** Non-breaking. Consumers can delete their ad-hoc
  `hasValue` branches once they set the three tokens.

---

## [TASK-4] Table density presets

**Priority:** P1
**Why:** Table rows are form-field scale — `[data-slot="table-cell"]`
uses `0.875rem 1.25rem` padding, `[data-slot="table-head-cell"]` uses
`0.75rem 1.25rem`. The c1 Appendix list is a dense data view (6-column
rows, 50+ rows visible). It reads "chunky" next to the old `DataTable`
which had compact cells.
**Proposal:**

- Add `density="compact" | "comfortable" | "spacious"` on `<Table>` /
  `<VirtualTable>`, projected as `data-density` on `[data-slot="table"]`.
- Drive padding from `--ou-table-cell-padding-y|x` and
  `--ou-table-head-padding-y|x` with per-density defaults.
- Suggested compact: cell `0.5rem 0.875rem`, head `0.5rem 0.875rem`.
  **Migration:** Default stays `"comfortable"` → no visual change. New
  prop is additive.

---

## [TASK-5] Document / expose layout tokens (bridge friction)

**Priority:** P1
**Why:** The c1 `_ou-tokens.css` bridge maps ~25 colour tokens cleanly
(`--ou-button-primary-bg`, `--ou-table-header-bg`, etc.), but hits a wall
for layout/density. There are no `--ou-*-height`, `--ou-*-padding-x`,
`--ou-*-radius` tokens for most components, forcing either `!important`,
unlayered selector wars, or Tailwind utility overrides. Select's
`--ou-select-trigger-padding-x` is the right pattern — it just needs to
be generalised.
**Proposal:**

- Audit every component stylesheet for hardcoded lengths
  (`height`, `padding-inline`, `min-width`, `border-radius`,
  `font-size`) and promote them to `--ou-<component>-<prop>` vars with
  the current literal as the default.
- Publish a `docs/theming.md` table: token name, fallback, affected
  slot. c1's bridge already exercises the colour half of this; the
  layout half would let host apps theme density without writing
  component-specific CSS overrides.
  **Migration:** Pure addition — existing users who don't set the vars see
  the exact same numbers.

---

## [TASK-6] Button: ship "primary filled action" recipe in Storybook

**Priority:** P2
**Why:** `@anitshrsth/ui/button` already supports
`variant="primary" size="sm"` — c1 uses this for the row-level Review
button (`appendix-list-columns.tsx`). But the surface-level docs don't
call it out as the canonical dense-table CTA. Without a recipe in
Storybook, consumers reach for `link` or roll a bespoke `<button>`.
**Proposal:** Add a `<Button.PrimaryActionRecipe>` story that shows the
pattern at `size="sm"` inside a mock table row, plus a story showing
`iconOnly` inside a toolbar. Cross-link from Table docs.
**Migration:** Docs only. No runtime change.

---

## [TASK-7] ToggleGroup: document the c1 "segmented filter" pattern

**Priority:** P2
**Why:** The c1 Appendix toolbar uses ToggleGroup as a 3-segment
filter (Active / Draft / Inactive) with `debounceMs={1000}` for
API-call batching, `value={[currentMode]}` to clamp to single-select
behaviour, and falls back to `"default"` when the value array is empty
(so exactly one option always reads as pressed). This is a useful
recipe — worth a story.
**Proposal:** Add `ToggleGroup.SegmentedFilterRecipe` story showing
the clamp-to-default pattern + debounce. Not a new API, just
documentation of how to use what's already there. Also document that
`role="toolbar"` is the default (important for axe compliance when
`aria-orientation` is set).
**Migration:** Docs only.

---

## [TASK-8] Select popup can overflow viewport on narrow filter triggers

**Priority:** P2
**Why:** `[data-slot="select-popup"]` uses
`min-width: var(--anchor-width)` which works great for form fields
(popup matches the trigger) but feels tight for a 7rem compact toolbar
pill showing multi-line labels. The existing
`--ou-select-popup-max-width: 24rem` ceiling is fine; the floor needs a
token.
**Proposal:** Add `--ou-select-popup-min-width` (default
`var(--anchor-width)`) so toolbar consumers can set
`min-width: max(var(--anchor-width), 12rem)`.
**Migration:** Non-breaking.

---

## Not library bugs (c1-side only)

Captured here so they don't get re-filed:

- c1's `hasValue` tint logic in `filter-select.tsx` /
  `filter-multi-select.tsx` becomes a no-op once TASK-3 ships.
- c1's `[data-slot="select-trigger"] { min-width: 0 }` escape hatch in
  `_ou-tokens.css` becomes unnecessary once TASK-1 ships.
