import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { useLazySearch } from "src/lazy-search";

type DemoProps = {
  debounceMs?: number;
  initialQuery?: string;
};

function Demo({ debounceMs = 300, initialQuery = "" }: DemoProps): ReactNode {
  const [debouncedValue, setDebouncedValue] = useState(initialQuery);

  const { searchQuery, handleInputChangeDebounced, setQueryImmediate } = useLazySearch({
    initialQuery,
    debounceMs,
    onDebouncedChange: setDebouncedValue,
  });

  return (
    <div>
      <input
        data-testid="search"
        onChange={handleInputChangeDebounced}
        placeholder="Type to search"
        type="search"
        value={searchQuery}
      />
      <div data-testid="current">Immediate: {searchQuery}</div>
      <div data-testid="debounced">Debounced: {debouncedValue}</div>
      <button data-testid="clear" onClick={() => setQueryImmediate("")} type="button">
        Clear
      </button>
    </div>
  );
}

const meta: Meta<typeof Demo> = {
  title: "Hooks/useLazySearch",
  component: Demo,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { debounceMs: 300 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId<HTMLInputElement>("search");

    await userEvent.type(input, "hello");

    await expect(canvas.getByTestId("current")).toHaveTextContent("hello");

    await expect(canvas.getByTestId("debounced")).toHaveTextContent("");

    await waitFor(() => expect(canvas.getByTestId("debounced")).toHaveTextContent("hello"), {
      timeout: 2000,
    });
  },
};

export const InitialQuery: Story = {
  args: { initialQuery: "preset", debounceMs: 300 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("current")).toHaveTextContent("preset");
    await expect(canvas.getByTestId("debounced")).toHaveTextContent("preset");
  },
};

export const ClearImmediate: Story = {
  args: { initialQuery: "abc", debounceMs: 300 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByTestId("current")).toHaveTextContent("abc");

    await userEvent.click(canvas.getByTestId("clear"));

    await expect(canvas.getByTestId("current")).toHaveTextContent("");
  },
};

export const DebounceCoalescesKeystrokes: Story = {
  args: { debounceMs: 500 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId<HTMLInputElement>("search");

    await userEvent.type(input, "abc");

    await expect(canvas.getByTestId("current")).toHaveTextContent("abc");

    await waitFor(() => expect(canvas.getByTestId("debounced")).toHaveTextContent("abc"), {
      timeout: 2000,
    });
  },
};
