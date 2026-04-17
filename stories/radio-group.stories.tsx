import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import preview from "../.storybook/preview";
import { Radio, RadioGroup } from "src/radio-group";

type Args = { debounceMs: number };

const meta = preview.meta({
  title: "Components/RadioGroup",
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
    const [value, setValue] = useState<unknown>("card");
    return (
      <RadioGroup value={value} onValueChange={setValue} debounceMs={debounceMs || undefined}>
        <Radio value="card">Credit card</Radio>
        <Radio value="paypal">PayPal</Radio>
        <Radio value="invoice">Invoice</Radio>
      </RadioGroup>
    );
  },
});

export const Horizontal = meta.story({
  render: () => {
    const [value, setValue] = useState<unknown>("day");
    return (
      <RadioGroup value={value} onValueChange={setValue} orientation="horizontal">
        <Radio value="day">Day</Radio>
        <Radio value="week">Week</Radio>
        <Radio value="month">Month</Radio>
      </RadioGroup>
    );
  },
});

export const Disabled = meta.story({
  render: () => (
    <RadioGroup defaultValue="b" disabled>
      <Radio value="a">Option A</Radio>
      <Radio value="b">Option B</Radio>
      <Radio value="c">Option C</Radio>
    </RadioGroup>
  ),
});

export const DisabledSingleOption = meta.story({
  render: () => {
    const [value, setValue] = useState<unknown>("free");
    return (
      <RadioGroup value={value} onValueChange={setValue}>
        <Radio value="free">Free plan</Radio>
        <Radio value="pro">Pro plan</Radio>
        <Radio value="enterprise" disabled>
          Enterprise (contact sales)
        </Radio>
      </RadioGroup>
    );
  },
});

export const WithDebounce = meta.story({
  args: { debounceMs: 600 },
  render: (args) => {
    const { debounceMs } = args as Args;
    const [committed, setCommitted] = useState<unknown>("card");
    return (
      <div>
        <RadioGroup
          value={committed}
          onValueChange={setCommitted}
          debounceMs={debounceMs || undefined}
        >
          <Radio value="card">Credit card</Radio>
          <Radio value="paypal">PayPal</Radio>
          <Radio value="invoice">Invoice</Radio>
        </RadioGroup>
        <p data-testid="committed" style={{ fontSize: 12, opacity: 0.6, marginTop: 12 }}>
          Committed: {String(committed)} — fires {debounceMs ?? 0}ms after last change
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const committed = canvas.getByTestId("committed");

    await expect(committed).toHaveTextContent(/^Committed: card/);

    const paypal = canvas.getByRole("radio", { name: "PayPal" });
    await userEvent.click(paypal);

    await expect(paypal).toBeChecked();
    await expect(committed).toHaveTextContent(/^Committed: card/);

    await waitFor(() => expect(committed).toHaveTextContent(/^Committed: paypal/), {
      timeout: 2000,
    });
  },
});
