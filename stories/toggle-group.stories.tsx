import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import preview from "../.storybook/preview";
import { Toggle, ToggleGroup, type ToggleSize } from "src/toggle-group";

type Args = { size: ToggleSize; debounceMs: number };

const meta = preview.meta({
  title: "Components/ToggleGroup",
  parameters: { layout: "centered" },
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"] satisfies ToggleSize[],
    },
    debounceMs: {
      control: { type: "number", min: 0, max: 2000, step: 100 },
      description: "If > 0, onValueChange fires only after the user pauses for this long (ms).",
    },
  },
  args: { size: "md", debounceMs: 0 } satisfies Args,
});

export default meta;

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "inactive", label: "Inactive" },
];

export const Segmented = meta.story({
  render: (args) => {
    const { size, debounceMs } = args as Args;
    const [committed, setCommitted] = useState<string[]>(["active"]);
    return (
      <div>
        <ToggleGroup
          value={committed}
          onValueChange={setCommitted}
          size={size}
          debounceMs={debounceMs || undefined}
        >
          {STATUSES.map((s) => (
            <Toggle key={s.value} value={s.value}>
              {s.label}
            </Toggle>
          ))}
        </ToggleGroup>
        <p data-testid="committed" style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
          Committed: {committed.join(", ") || "(none)"}
          {debounceMs ? ` — fires ${debounceMs}ms after last click` : ""}
        </p>
      </div>
    );
  },
});

export const Sizes = meta.story({
  render: () => {
    const [value, setValue] = useState<string[]>(["md"]);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {(["sm", "md", "lg"] satisfies ToggleSize[]).map((size) => (
          <ToggleGroup key={size} size={size} value={value} onValueChange={setValue}>
            <Toggle value="sm">Small</Toggle>
            <Toggle value="md">Medium</Toggle>
            <Toggle value="lg">Large</Toggle>
          </ToggleGroup>
        ))}
      </div>
    );
  },
});

export const MultiSelect = meta.story({
  render: () => {
    const [value, setValue] = useState<string[]>(["bold", "italic"]);
    return (
      <div>
        <ToggleGroup multiple value={value} onValueChange={setValue} aria-label="Text formatting">
          <Toggle value="bold" aria-label="Bold">
            <strong>B</strong>
          </Toggle>
          <Toggle value="italic" aria-label="Italic">
            <em>I</em>
          </Toggle>
          <Toggle value="underline" aria-label="Underline">
            <u>U</u>
          </Toggle>
        </ToggleGroup>
        <p style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>
          Selected: {value.join(", ") || "(none)"}
        </p>
      </div>
    );
  },
});

export const Disabled = meta.story({
  render: () => (
    <ToggleGroup defaultValue={["draft"]} disabled>
      {STATUSES.map((s) => (
        <Toggle key={s.value} value={s.value}>
          {s.label}
        </Toggle>
      ))}
    </ToggleGroup>
  ),
});

export const WithDebounce = meta.story({
  args: { debounceMs: 600 },
  render: (args) => {
    const { size, debounceMs } = args as Args;
    const [committed, setCommitted] = useState<string[]>(["active"]);
    return (
      <div>
        <ToggleGroup
          value={committed}
          onValueChange={setCommitted}
          size={size}
          debounceMs={debounceMs || undefined}
        >
          {STATUSES.map((s) => (
            <Toggle key={s.value} value={s.value}>
              {s.label}
            </Toggle>
          ))}
        </ToggleGroup>
        <p data-testid="committed" style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>
          Committed: {committed.join(", ") || "(none)"} — fires {debounceMs ?? 0}ms after last click
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const committed = canvas.getByTestId("committed");

    await expect(committed).toHaveTextContent(/^Committed: active/);

    const draft = canvas.getByRole("button", { name: "Draft" });
    await userEvent.click(draft);

    await expect(draft).toHaveAttribute("data-pressed");
    await expect(committed).toHaveTextContent(/^Committed: active/);

    await waitFor(() => expect(committed).toHaveTextContent(/^Committed: draft/), {
      timeout: 2000,
    });
  },
});
