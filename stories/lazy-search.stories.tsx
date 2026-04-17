import { type ReactNode, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import preview from "../.storybook/preview";
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
        aria-label="Search"
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

const meta = preview.meta({
  title: "Hooks/useLazySearch",
  component: Demo,
  tags: ["autodocs"],
});

export default meta;

export const Default = meta.story({
  args: { debounceMs: 300 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId<HTMLInputElement>("search");

    await userEvent.type(input, "hello");

    await expect(canvas.getByTestId("current")).toHaveTextContent("hello");

    // debounced value has not updated yet — assert on the input's cleared
    // label text rather than using toHaveTextContent("") which always matches.
    await expect(canvas.getByTestId("debounced").textContent).toBe("Debounced: ");

    await waitFor(() => expect(canvas.getByTestId("debounced")).toHaveTextContent("hello"), {
      timeout: 2000,
    });
  },
});

export const InitialQuery = meta.story({
  args: { initialQuery: "preset", debounceMs: 300 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId("current")).toHaveTextContent("preset");
    await expect(canvas.getByTestId("debounced")).toHaveTextContent("preset");
  },
});

export const ClearImmediate = meta.story({
  args: { initialQuery: "abc", debounceMs: 300 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByTestId("current")).toHaveTextContent("abc");

    await userEvent.click(canvas.getByTestId("clear"));

    // After clear, the input value resets and the "Immediate:" label stays
    // alone. Use textContent rather than toHaveTextContent("") which matches
    // any string.
    await expect(canvas.getByTestId("current").textContent).toBe("Immediate: ");
  },
});

export const DebounceCoalescesKeystrokes = meta.story({
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
});
