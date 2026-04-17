import { expect, fn, userEvent, within } from "storybook/test";

import preview from "../.storybook/preview";
import { Button, type ButtonVariant } from "src/button";

const meta = preview.meta({
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Button",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outline", "ghost", "danger", "link"] as ButtonVariant[],
    },
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
  },
});

export default meta;

export const Primary = meta.story({
  args: { variant: "primary" },
});

export const Variants = meta.story({
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Danger
      </Button>
      <Button {...args} variant="link">
        Link
      </Button>
    </div>
  ),
});

export const Sizes = meta.story({
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
});

const PlusIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const WithIcons = meta.story({
  args: {
    leadingIcon: <PlusIcon />,
    children: "Add item",
  },
});

export const IconOnly = meta.story({
  args: {
    iconOnly: true,
    "aria-label": "Add item",
    children: <PlusIcon />,
  },
});

export const Loading = meta.story({
  args: { isLoading: true, children: "Saving…" },
});

export const Disabled = meta.story({
  args: { disabled: true, children: "Disabled" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole("button", { name: "Disabled" });
    await expect(btn).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(btn);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
});

export const AsAnchor = meta.story({
  args: {
    asChild: true,
    children: (
      <a href="https://example.com" target="_blank" rel="noreferrer">
        External link
      </a>
    ),
  },
});

export const TokenOverride = meta.story({
  render: (args) => (
    <div
      style={
        {
          "--ou-button-primary-bg": "#15803d",
          "--ou-button-primary-bg-hover": "#14532d",
          "--ou-button-radius": "9999px",
        } as React.CSSProperties
      }
    >
      <Button {...args} variant="primary">
        Branded button
      </Button>
    </div>
  ),
});

/* ========== Recipes ========== */

const ROWS = [
  { id: "row-1", name: "Acme Corp", status: "Active" },
  { id: "row-2", name: "Globex", status: "Pending" },
  { id: "row-3", name: "Initech", status: "Inactive" },
];

/**
 * The canonical CTA for a dense data-table row: `variant="primary" size="sm"`.
 * Pair with the Table component's `density="compact"` prop for filter-heavy
 * listings. Icon-only actions use `iconOnly` + `aria-label` for a11y.
 */
export const PrimaryActionRecipe = meta.story({
  name: "Recipe: Primary action in dense row",
  parameters: { layout: "padded" },
  render: () => (
    <table style={{ width: 420, borderCollapse: "collapse", fontSize: 14 }}>
      <thead>
        <tr style={{ borderBottom: "1px solid rgb(0 0 0 / 0.08)" }}>
          <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Customer</th>
          <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Status</th>
          <th style={{ padding: "8px 12px" }}>
            <span
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: 0,
              }}
            >
              Actions
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((r) => (
          <tr key={r.id} style={{ borderBottom: "1px solid rgb(0 0 0 / 0.06)" }}>
            <td style={{ padding: "8px 12px" }}>{r.name}</td>
            <td style={{ padding: "8px 12px", opacity: 0.7 }}>{r.status}</td>
            <td style={{ padding: "8px 12px", textAlign: "right" }}>
              <Button variant="primary" size="sm">
                Review
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
});

const FilterIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/**
 * Icon-only ghost buttons inside a toolbar. `iconOnly` gives the button a
 * square aspect ratio; `aria-label` is required (axe will fail without it).
 */
export const ToolbarIconOnlyRecipe = meta.story({
  name: "Recipe: Icon-only toolbar actions",
  parameters: { layout: "padded" },
  render: () => (
    <div
      role="toolbar"
      aria-label="List actions"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: 4,
        border: "1px solid rgb(0 0 0 / 0.08)",
        borderRadius: 8,
      }}
    >
      <Button variant="ghost" size="sm" iconOnly aria-label="Filter">
        <FilterIcon />
      </Button>
      <Button variant="ghost" size="sm" iconOnly aria-label="Download">
        <DownloadIcon />
      </Button>
      <div style={{ width: 1, height: 20, background: "rgb(0 0 0 / 0.08)", margin: "0 4px" }} />
      <Button variant="primary" size="sm">
        New
      </Button>
    </div>
  ),
});
