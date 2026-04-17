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
