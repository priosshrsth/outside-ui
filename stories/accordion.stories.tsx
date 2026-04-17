import preview from "../.storybook/preview";
import { Accordion, type AccordionVariant } from "src/accordion";

type Args = { variant: AccordionVariant; multiple: boolean };

const meta = preview.meta({
  title: "Components/Accordion",
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["default", "flush"] satisfies AccordionVariant[],
    },
    multiple: { control: { type: "boolean" } },
  },
  args: { variant: "default", multiple: false } satisfies Args,
});

export default meta;

const items = [
  {
    value: "what",
    title: "What is outside-ui?",
    body: "A React component library for data-rich UIs. Base UI primitives, zero CVA, vanilla CSS in cascade layers.",
  },
  {
    value: "why",
    title: "Why not shadcn?",
    body: "Shadcn copies source into your repo — every project diverges. This library ships one artifact, overridden via CSS variables or Tailwind utilities.",
  },
  {
    value: "how",
    title: "How do I theme it?",
    body: "Set CSS custom properties on :root, scope them to a subtree, or override via Tailwind classes on individual instances. Three ways, no lock-in.",
  },
];

function Demo({ variant, multiple }: Args) {
  return (
    <Accordion.Root variant={variant} multiple={multiple}>
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Header>
            <Accordion.Trigger>
              {item.title}
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <div>{item.body}</div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

export const Default = meta.story({
  render: (a) => <Demo {...(a as Args)} />,
});

export const Flush = meta.story({
  args: { variant: "flush" },
  render: (a) => <Demo {...(a as Args)} />,
});

export const OpenMultiple = meta.story({
  args: { multiple: true },
  render: (a) => <Demo {...(a as Args)} />,
});

const PlusIcon = () => (
  <svg
    width="1rem"
    height="1rem"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const IndicatorOnLeft = meta.story({
  render: () => (
    <Accordion.Root variant="default">
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Header>
            <Accordion.Trigger>
              <Accordion.Indicator />
              <span style={{ flex: 1 }}>{item.title}</span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <div>{item.body}</div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
});

export const CustomIcon = meta.story({
  render: () => (
    <Accordion.Root variant="default">
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Header>
            <Accordion.Trigger>
              {item.title}
              <Accordion.Indicator>
                <PlusIcon />
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <div>{item.body}</div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
});

export const NoIndicator = meta.story({
  render: () => (
    <Accordion.Root variant="default">
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Header>
            <Accordion.Trigger>{item.title}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <div>{item.body}</div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
});
