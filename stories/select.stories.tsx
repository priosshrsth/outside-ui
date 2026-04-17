import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import preview from "../.storybook/preview";
import { Select, type SelectSize } from "src/select";

type Args = { size: SelectSize; debounceMs: number };

const meta = preview.meta({
  title: "Components/Select",
  parameters: { layout: "centered" },
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"] satisfies SelectSize[],
    },
    debounceMs: {
      control: { type: "number", min: 0, max: 2000, step: 100 },
      description: "If > 0, onValueChange fires only after the user pauses for this long (ms).",
    },
  },
  args: { size: "md", debounceMs: 0 } satisfies Args,
});

export default meta;

const FRUITS = ["Apple", "Banana", "Cherry", "Durian", "Elderberry"];

export const Single = meta.story({
  render: (args) => {
    const { size, debounceMs } = args as Args;
    const [committed, setCommitted] = useState<string | null>(null);
    return (
      <div style={{ width: 240 }}>
        <Select.Root
          value={committed}
          onValueChange={setCommitted}
          debounceMs={debounceMs || undefined}
        >
          <Select.Trigger aria-label="Select option" size={size}>
            <Select.Value placeholder="Pick a fruit" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={4} align="start">
              <Select.Popup>
                <Select.List>
                  {FRUITS.map((f) => (
                    <Select.Item key={f} value={f}>
                      {f}
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        <p data-testid="committed" style={{ fontSize: 12, opacity: 0.6, marginTop: 12 }}>
          Committed: {committed ?? "(none)"}
          {debounceMs ? ` — onValueChange fires after ${debounceMs}ms` : ""}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement, args }) => {
    const { debounceMs } = args as Args;
    if (!debounceMs) return; // only assert debounce behaviour when enabled
    const canvas = within(canvasElement);
    const committed = canvas.getByTestId("committed");
    const trigger = canvas.getByRole("combobox");

    trigger.focus();
    await userEvent.keyboard("{Enter}{ArrowDown}{Enter}");

    // Trigger text shows the internal selection immediately
    await waitFor(() => expect(trigger).not.toHaveTextContent("Pick a fruit"));
    // Committed still (none) until debounce elapses
    await expect(committed).toHaveTextContent(/\(none\)/);

    await waitFor(() => expect(committed).not.toHaveTextContent(/\(none\)/), {
      timeout: debounceMs * 3,
    });
  },
});

export const Grouped = meta.story({
  render: (args) => {
    const { size } = args as Args;
    return (
      <div style={{ width: 260 }}>
        <Select.Root>
          <Select.Trigger aria-label="Select option" size={size}>
            <Select.Value placeholder="Pick a food" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={4}>
              <Select.Popup>
                <Select.List>
                  <Select.Group>
                    <Select.GroupLabel>Fruits</Select.GroupLabel>
                    {FRUITS.map((f) => (
                      <Select.Item key={f} value={f}>
                        {f}
                      </Select.Item>
                    ))}
                  </Select.Group>
                  <Select.Group>
                    <Select.GroupLabel>Vegetables</Select.GroupLabel>
                    {["Carrot", "Broccoli", "Spinach"].map((v) => (
                      <Select.Item key={v} value={v}>
                        {v}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
    );
  },
});

export const Multiple = meta.story({
  render: (args) => {
    const { size } = args as Args;
    const [value, setValue] = useState<string[]>(["Submitted", "Approved"]);
    const statuses = ["Submitted", "Approved", "Declined", "Revised"];
    return (
      <div style={{ width: 180 }}>
        <Select.Root multiple value={value} onValueChange={setValue}>
          <Select.Trigger aria-label="Status" size={size}>
            <Select.Value>
              {(v) => {
                const list = v as string[];
                if (list.length === 0) return "Status";
                if (list.length === 1) return list[0];
                return `${list.length} selected`;
              }}
            </Select.Value>
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={4} align="start">
              <Select.Popup itemStyle="checkbox">
                <Select.List>
                  {statuses.map((s) => (
                    <Select.Item key={s} value={s}>
                      {s}
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        <p style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
          Selected: {value.join(", ") || "(none)"}
        </p>
      </div>
    );
  },
});

export const WithLeadingIcons = meta.story({
  render: (args) => {
    const { size } = args as Args;
    const Dot = ({ color }: { color: string }) => (
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: 10,
          height: 10,
          borderRadius: 999,
          background: color,
        }}
      />
    );
    return (
      <div style={{ width: 240 }}>
        <Select.Root>
          <Select.Trigger aria-label="Select option" size={size}>
            <Select.Value placeholder="Status" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={4}>
              <Select.Popup>
                <Select.List>
                  <Select.Item value="active" leading={<Dot color="#22c55e" />}>
                    Active
                  </Select.Item>
                  <Select.Item value="pending" leading={<Dot color="#f59e0b" />}>
                    Pending
                  </Select.Item>
                  <Select.Item value="blocked" leading={<Dot color="#ef4444" />}>
                    Blocked
                  </Select.Item>
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
    );
  },
});

export const Disabled = meta.story({
  render: (args) => {
    const { size } = args as Args;
    return (
      <div style={{ width: 240 }}>
        <Select.Root disabled>
          <Select.Trigger aria-label="Select option" size={size}>
            <Select.Value placeholder="Unavailable" />
            <Select.Icon />
          </Select.Trigger>
        </Select.Root>
      </div>
    );
  },
});

export const WithDebounce = meta.story({
  args: { debounceMs: 600 },
  render: (args) => {
    const { size, debounceMs } = args as Args;
    const [committed, setCommitted] = useState<string | null>("Apple");
    return (
      <div style={{ width: 260 }}>
        <Select.Root
          value={committed}
          onValueChange={setCommitted}
          debounceMs={debounceMs || undefined}
        >
          <Select.Trigger aria-label="Fruit" size={size}>
            <Select.Value placeholder="Pick a fruit" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={4} align="start">
              <Select.Popup>
                <Select.List>
                  {FRUITS.map((f) => (
                    <Select.Item key={f} value={f}>
                      {f}
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        <p data-testid="committed" style={{ fontSize: 12, opacity: 0.6, marginTop: 12 }}>
          Committed: {committed ?? "(none)"} — onValueChange fires {debounceMs ?? 0}ms after last
          pick
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const committed = canvas.getByTestId("committed");
    const trigger = canvas.getByRole("combobox");

    await expect(committed).toHaveTextContent(/^Committed: Apple/);

    trigger.focus();
    await userEvent.keyboard("{Enter}{ArrowDown}{Enter}");

    await waitFor(() => expect(trigger).toHaveTextContent(/Banana/));
    await expect(committed).toHaveTextContent(/^Committed: Apple/);

    await waitFor(() => expect(committed).toHaveTextContent(/^Committed: Banana/), {
      timeout: 2000,
    });
  },
});
