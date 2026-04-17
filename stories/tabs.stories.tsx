import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import preview from "../.storybook/preview";
import { Tabs, type TabsVariant } from "src/tabs";

type Args = { variant: TabsVariant; debounceMs: number };

const meta = preview.meta({
  title: "Components/Tabs",
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["line", "solid", "pills"] satisfies TabsVariant[],
    },
    debounceMs: {
      control: { type: "number", min: 0, max: 2000, step: 100 },
      description: "If > 0, onValueChange fires only after the user pauses for this long (ms).",
    },
  },
  args: { variant: "line", debounceMs: 0 } satisfies Args,
});

export default meta;

function TabsDemo({ variant, debounceMs }: Args) {
  const [committed, setCommitted] = useState<unknown>("overview");
  return (
    <div>
      <Tabs.Root
        value={committed}
        onValueChange={setCommitted}
        debounceMs={debounceMs || undefined}
        variant={variant}
      >
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="activity">Activity</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
          <Tabs.Tab value="disabled" disabled>
            Disabled
          </Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Panel value="overview" style={{ padding: "1rem 0" }}>
          Overview content.
        </Tabs.Panel>
        <Tabs.Panel value="activity" style={{ padding: "1rem 0" }}>
          Activity content.
        </Tabs.Panel>
        <Tabs.Panel value="settings" style={{ padding: "1rem 0" }}>
          Settings content.
        </Tabs.Panel>
      </Tabs.Root>
      <p data-testid="committed" style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
        Committed: {String(committed)}
        {debounceMs ? ` — onValueChange fires ${debounceMs}ms after click` : ""}
      </p>
    </div>
  );
}

export const Line = meta.story({
  args: { variant: "line" },
  render: (a) => <TabsDemo {...(a as Args)} />,
});

export const Solid = meta.story({
  args: { variant: "solid" },
  render: (a) => <TabsDemo {...(a as Args)} />,
});

export const Pills = meta.story({
  args: { variant: "pills" },
  render: (a) => <TabsDemo {...(a as Args)} />,
});

export const Vertical = meta.story({
  render: () => (
    <Tabs.Root defaultValue="one" orientation="vertical" variant="line">
      <Tabs.List>
        <Tabs.Tab value="one">One</Tabs.Tab>
        <Tabs.Tab value="two">Two</Tabs.Tab>
        <Tabs.Tab value="three">Three</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one" style={{ padding: "0 1rem" }}>
        Panel one
      </Tabs.Panel>
      <Tabs.Panel value="two" style={{ padding: "0 1rem" }}>
        Panel two
      </Tabs.Panel>
      <Tabs.Panel value="three" style={{ padding: "0 1rem" }}>
        Panel three
      </Tabs.Panel>
    </Tabs.Root>
  ),
});

export const WithDebounce = meta.story({
  args: { variant: "pills", debounceMs: 600 },
  render: (a) => <TabsDemo {...(a as Args)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const committed = canvas.getByTestId("committed");

    await expect(committed).toHaveTextContent(/^Committed: overview/);

    const activityTab = canvas.getByRole("tab", { name: "Activity" });
    await userEvent.click(activityTab);

    await expect(activityTab).toHaveAttribute("aria-selected", "true");
    await expect(committed).toHaveTextContent(/^Committed: overview/);

    await waitFor(() => expect(committed).toHaveTextContent(/^Committed: activity/), {
      timeout: 2000,
    });
  },
});
