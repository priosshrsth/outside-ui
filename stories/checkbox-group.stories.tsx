import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import preview from "../.storybook/preview";
import { Checkbox, CheckboxGroup } from "src/checkbox-group";

type Args = { debounceMs: number };

const meta = preview.meta({
  title: "Components/CheckboxGroup",
  parameters: { layout: "centered" },
  argTypes: {
    debounceMs: {
      control: { type: "number", min: 0, max: 2000, step: 100 },
      description: "If > 0, onValueChange fires only after the user pauses for this long (ms).",
    },
  },
  args: { debounceMs: 0 } satisfies Args,
});

export default meta;

export const Vertical = meta.story({
  render: (args) => {
    const { debounceMs } = args as Args;
    const [committed, setCommitted] = useState<string[]>(["email"]);
    return (
      <div>
        <CheckboxGroup
          value={committed}
          onValueChange={setCommitted}
          debounceMs={debounceMs || undefined}
        >
          <Checkbox name="email">Email notifications</Checkbox>
          <Checkbox name="sms">SMS notifications</Checkbox>
          <Checkbox name="push">Push notifications</Checkbox>
        </CheckboxGroup>
        <p data-testid="committed" style={{ fontSize: 12, opacity: 0.6, marginTop: 12 }}>
          Committed: {committed.join(", ") || "(none)"}
          {debounceMs ? ` — fires ${debounceMs}ms after last toggle` : ""}
        </p>
      </div>
    );
  },
});

export const Horizontal = meta.story({
  render: () => {
    const [value, setValue] = useState<string[]>(["mon", "wed", "fri"]);
    return (
      <CheckboxGroup value={value} onValueChange={setValue} orientation="horizontal">
        {["mon", "tue", "wed", "thu", "fri"].map((d) => (
          <Checkbox key={d} name={d}>
            {d.toUpperCase()}
          </Checkbox>
        ))}
      </CheckboxGroup>
    );
  },
});

export const Standalone = meta.story({
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox checked={checked} onCheckedChange={setChecked}>
        I agree to the terms and conditions
      </Checkbox>
    );
  },
});

export const Indeterminate = meta.story({
  render: () => {
    const [parent, setParent] = useState<boolean | "indeterminate">("indeterminate");
    const [a, setA] = useState(true);
    const [b, setB] = useState(false);

    const syncParent = (next: boolean) => {
      setParent(next);
      setA(next);
      setB(next);
    };

    const syncChild = (setter: (v: boolean) => void) => (next: boolean) => {
      setter(next);
      if (next && (setter === setA ? b : a)) setParent(true);
      else if (!next && !(setter === setA ? b : a)) setParent(false);
      else setParent("indeterminate");
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Checkbox
          checked={parent === true}
          indeterminate={parent === "indeterminate"}
          onCheckedChange={syncParent}
        >
          All features
        </Checkbox>
        <div style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
          <Checkbox checked={a} onCheckedChange={syncChild(setA)}>
            Feature A
          </Checkbox>
          <Checkbox checked={b} onCheckedChange={syncChild(setB)}>
            Feature B
          </Checkbox>
        </div>
      </div>
    );
  },
});

export const Disabled = meta.story({
  render: () => (
    <CheckboxGroup defaultValue={["a"]} disabled>
      <Checkbox name="a">Option A</Checkbox>
      <Checkbox name="b">Option B</Checkbox>
      <Checkbox name="c">Option C</Checkbox>
    </CheckboxGroup>
  ),
});

export const WithDebounce = meta.story({
  args: { debounceMs: 600 },
  render: (args) => {
    const { debounceMs } = args as Args;
    const [committed, setCommitted] = useState<string[]>(["email"]);
    return (
      <div>
        <CheckboxGroup
          value={committed}
          onValueChange={setCommitted}
          debounceMs={debounceMs || undefined}
        >
          <Checkbox name="email">Email notifications</Checkbox>
          <Checkbox name="sms">SMS notifications</Checkbox>
          <Checkbox name="push">Push notifications</Checkbox>
        </CheckboxGroup>
        <p data-testid="committed" style={{ fontSize: 12, opacity: 0.6, marginTop: 12 }}>
          Committed: {committed.join(", ") || "(none)"} — fires {debounceMs ?? 0}ms after last
          toggle
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const committed = canvas.getByTestId("committed");

    await expect(committed).toHaveTextContent(/^Committed: email/);

    const sms = canvas.getByRole("checkbox", { name: "SMS notifications" });
    await userEvent.click(sms);

    await expect(sms).toBeChecked();
    await expect(committed).toHaveTextContent(/^Committed: email/);

    await waitFor(() => expect(committed).toHaveTextContent(/^Committed: email, sms/), {
      timeout: 2000,
    });
  },
});
