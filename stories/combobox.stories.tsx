import { useMemo, useState } from "react";
import { expect } from "storybook/test";

import preview from "../.storybook/preview";
import { Combobox } from "src/combobox";

const meta = preview.meta({
  title: "Components/Combobox",
  parameters: { layout: "centered" },
});

export default meta;

const FRUITS = [
  "Apple",
  "Apricot",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Durian",
  "Elderberry",
  "Fig",
  "Grape",
  "Guava",
  "Kiwi",
  "Lemon",
  "Lime",
  "Mango",
];

export const Single = meta.story({
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector<HTMLInputElement>('[data-slot="combobox-input"]');
    if (!input) throw new Error("input missing");
    const rect = input.getBoundingClientRect();
    const style = getComputedStyle(input);
    // standalone input should match data-size=md height (2.5rem = 40px)
    await expect(rect.height).toBeGreaterThanOrEqual(36);
    await expect(parseFloat(style.fontSize)).toBeGreaterThanOrEqual(12);
  },
  render: () => (
    <div style={{ width: 260 }}>
      <Combobox.Root items={FRUITS}>
        <Combobox.Input aria-label="Fruit" placeholder="Search a fruit" />
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4} align="start" collisionPadding={12}>
            <Combobox.Popup>
              <Combobox.List>
                {(item: string) => (
                  <Combobox.Item key={item} value={item}>
                    {item}
                  </Combobox.Item>
                )}
              </Combobox.List>
              <Combobox.Empty>No fruits match.</Combobox.Empty>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  ),
});

export const Multiple = meta.story({
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector<HTMLInputElement>(
      '[data-slot="combobox-chips"] [data-slot="combobox-input"]',
    );
    if (!input) throw new Error("chips input missing");
    const rect = input.getBoundingClientRect();
    const style = getComputedStyle(input);
    // caret needs meaningful vertical room — checking for regressions
    await expect(rect.height).toBeGreaterThanOrEqual(20);
    await expect(parseFloat(style.lineHeight)).toBeGreaterThanOrEqual(16);
    await expect(parseFloat(style.fontSize)).toBeGreaterThanOrEqual(12);
  },
  render: () => {
    const [value, setValue] = useState<string[]>(["Apple", "Mango"]);
    return (
      <div style={{ width: 320 }}>
        <Combobox.Root multiple items={FRUITS} value={value} onValueChange={setValue}>
          <Combobox.Chips>
            {value.map((v) => (
              <Combobox.Chip key={v}>
                {v}
                <Combobox.ChipRemove />
              </Combobox.Chip>
            ))}
            <Combobox.Input aria-label="Fruits" placeholder={value.length ? "" : "Pick fruits"} />
          </Combobox.Chips>
          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} align="start" collisionPadding={12}>
              <Combobox.Popup>
                <Combobox.List>
                  {(item: string) => (
                    <Combobox.Item key={item} value={item}>
                      {item}
                    </Combobox.Item>
                  )}
                </Combobox.List>
                <Combobox.Empty>Nothing matched.</Combobox.Empty>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
        <p style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
          Selected: {value.join(", ") || "(none)"}
        </p>
      </div>
    );
  },
});

export const MultipleWithMaxChips = meta.story({
  render: () => {
    const [value, setValue] = useState<string[]>([
      "Apple",
      "Mango",
      "Banana",
      "Blueberry",
      "Grape",
    ]);
    return (
      <div style={{ width: 320 }}>
        <Combobox.Root multiple items={FRUITS} value={value} onValueChange={setValue}>
          <Combobox.Chips max={3}>
            {value.map((v) => (
              <Combobox.Chip key={v}>
                {v}
                <Combobox.ChipRemove />
              </Combobox.Chip>
            ))}
            <Combobox.Input aria-label="Fruits" placeholder={value.length ? "" : "Pick fruits"} />
          </Combobox.Chips>
          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} align="start" collisionPadding={12}>
              <Combobox.Popup>
                <Combobox.List>
                  {(item: string) => (
                    <Combobox.Item key={item} value={item}>
                      {item}
                    </Combobox.Item>
                  )}
                </Combobox.List>
                <Combobox.Empty>Nothing matched.</Combobox.Empty>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
        <p style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
          Selected: {value.join(", ") || "(none)"} — chip limit is 3
        </p>
      </div>
    );
  },
});

export const Async = meta.story({
  render: () => {
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (value: string) => {
      setQuery(value);
      setLoading(true);
      const id = setTimeout(() => {
        setItems(
          value.trim() === ""
            ? []
            : FRUITS.filter((f) => f.toLowerCase().includes(value.toLowerCase())),
        );
        setLoading(false);
      }, 350);
      return () => clearTimeout(id);
    };

    return (
      <div style={{ width: 280 }}>
        <Combobox.Root
          items={items}
          inputValue={query}
          onInputValueChange={handleInputChange}
          filter={null}
        >
          <Combobox.Input aria-label="Search" placeholder="Type to search..." />
          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} align="start" collisionPadding={12}>
              <Combobox.Popup>
                {loading ? (
                  <Combobox.Status>Searching…</Combobox.Status>
                ) : (
                  <>
                    <Combobox.List>
                      {(item: string) => (
                        <Combobox.Item key={item} value={item}>
                          {item}
                        </Combobox.Item>
                      )}
                    </Combobox.List>
                    <Combobox.Empty>{query ? "No results." : "Start typing..."}</Combobox.Empty>
                  </>
                )}
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </div>
    );
  },
});

export const Grouped = meta.story({
  render: () => {
    const groups = useMemo(
      () => [
        { label: "Fruits", items: ["Apple", "Banana", "Cherry"] },
        { label: "Vegetables", items: ["Broccoli", "Carrot", "Spinach"] },
      ],
      [],
    );
    return (
      <div style={{ width: 260 }}>
        <Combobox.Root items={groups}>
          <Combobox.Input aria-label="Food" placeholder="Search" />
          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} align="start" collisionPadding={12}>
              <Combobox.Popup>
                <Combobox.List>
                  {(group: { label: string; items: string[] }) => (
                    <Combobox.Group key={group.label} items={group.items}>
                      <Combobox.GroupLabel>{group.label}</Combobox.GroupLabel>
                      <Combobox.Collection>
                        {(item: string) => (
                          <Combobox.Item key={item} value={item}>
                            {item}
                          </Combobox.Item>
                        )}
                      </Combobox.Collection>
                    </Combobox.Group>
                  )}
                </Combobox.List>
                <Combobox.Empty>No matches.</Combobox.Empty>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </div>
    );
  },
});

export const Creatable = meta.story({
  render: () => {
    const [items, setItems] = useState<string[]>(["Apple", "Banana", "Cherry"]);
    const [inputValue, setInputValue] = useState("");
    const [value, setValue] = useState<string[]>([]);

    const normalized = inputValue.trim();
    const exists = items.some((i) => i.toLowerCase() === normalized.toLowerCase());
    const showCreate = normalized !== "" && !exists;

    const handleCreate = () => {
      if (!showCreate) return;
      setItems([...items, normalized]);
      setValue([...value, normalized]);
      setInputValue("");
    };

    return (
      <div style={{ width: 320 }}>
        <Combobox.Root
          multiple
          items={items}
          value={value}
          onValueChange={setValue}
          inputValue={inputValue}
          onInputValueChange={setInputValue}
        >
          <Combobox.Chips>
            {value.map((v) => (
              <Combobox.Chip key={v}>
                {v}
                <Combobox.ChipRemove />
              </Combobox.Chip>
            ))}
            <Combobox.Input aria-label="Tags" placeholder="Add a tag..." />
          </Combobox.Chips>
          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} align="start" collisionPadding={12}>
              <Combobox.Popup>
                <Combobox.List>
                  {(item: string) => (
                    <Combobox.Item key={item} value={item}>
                      {item}
                    </Combobox.Item>
                  )}
                </Combobox.List>
                {showCreate ? (
                  <Combobox.Item value={`__create__${normalized}`} onClick={handleCreate}>
                    <span style={{ opacity: 0.7 }}>Create</span>{" "}
                    <strong>&ldquo;{normalized}&rdquo;</strong>
                  </Combobox.Item>
                ) : null}
                {!showCreate ? <Combobox.Empty>Nothing matched.</Combobox.Empty> : null}
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </div>
    );
  },
});

export const Disabled = meta.story({
  render: () => (
    <div style={{ width: 260 }}>
      <Combobox.Root items={FRUITS} disabled>
        <Combobox.Input aria-label="Disabled combobox" placeholder="Disabled" />
      </Combobox.Root>
    </div>
  ),
});
