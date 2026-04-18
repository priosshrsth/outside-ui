import type { ReactNode } from "react";

import preview from "../.storybook/preview";
import { useAppForm } from "src/form";

const meta = preview.meta({
  title: "Components/FormFields",
  parameters: { layout: "padded" },
});

export default meta;

function Panel({ children }: { children: ReactNode }): ReactNode {
  return <div style={{ maxWidth: 520, display: "grid", gap: 20 }}>{children}</div>;
}

export const Textarea = meta.story({
  render: () => {
    const form = useAppForm({
      defaultValues: { bio: "" },
      onSubmit: async () => {},
    });
    return (
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <Panel>
            <form.TextareaField
              name="bio"
              label="Bio"
              description="Tell us about yourself. Markdown is supported."
              placeholder="A short introduction…"
              rows={4}
            />
          </Panel>
        </form>
      </form.AppForm>
    );
  },
});

export const Select = meta.story({
  render: () => {
    const form = useAppForm({
      defaultValues: { country: "" },
      onSubmit: async () => {},
    });
    return (
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <Panel>
            <form.SelectField
              name="country"
              label="Country"
              placeholder="Choose a country…"
              options={[
                { value: "us", label: "United States" },
                { value: "ca", label: "Canada" },
                { value: "mx", label: "Mexico" },
                { value: "uk", label: "United Kingdom" },
                { value: "np", label: "Nepal" },
              ]}
            />
          </Panel>
        </form>
      </form.AppForm>
    );
  },
});

export const RadioGroup = meta.story({
  render: () => {
    const form = useAppForm({
      defaultValues: { plan: "free" },
      onSubmit: async () => {},
    });
    return (
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <Panel>
            <form.RadioGroupField
              name="plan"
              label="Plan"
              description="Change anytime."
              options={[
                { value: "free", label: "Free" },
                { value: "pro", label: "Pro" },
                { value: "enterprise", label: "Enterprise", disabled: true },
              ]}
            />
          </Panel>
        </form>
      </form.AppForm>
    );
  },
});

export const CheckboxGroup = meta.story({
  render: () => {
    const form = useAppForm({
      defaultValues: { interests: ["react"] as string[] },
      onSubmit: async () => {},
    });
    return (
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <Panel>
            <form.CheckboxGroupField
              name="interests"
              label="Interests"
              description="Pick all that apply."
              orientation="horizontal"
              options={[
                { value: "react", label: "React" },
                { value: "vue", label: "Vue" },
                { value: "svelte", label: "Svelte" },
                { value: "solid", label: "Solid" },
              ]}
            />
          </Panel>
        </form>
      </form.AppForm>
    );
  },
});

const COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "mx", label: "Mexico" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "in", label: "India" },
  { value: "np", label: "Nepal" },
  { value: "au", label: "Australia" },
];

const TAGS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "angular", label: "Angular" },
  { value: "qwik", label: "Qwik" },
  { value: "astro", label: "Astro" },
];

export const Combobox = meta.story({
  render: () => {
    const form = useAppForm({
      defaultValues: { country: "" },
      onSubmit: async () => {},
    });
    return (
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <Panel>
            <form.ComboboxField
              name="country"
              label="Country"
              placeholder="Search countries…"
              options={COUNTRIES}
            />
          </Panel>
        </form>
      </form.AppForm>
    );
  },
});

const PRODUCTS = [
  {
    id: "P-201",
    name: "Aurora Backpack",
    sku: "BAG-AUR-30",
    price: "$129",
    thumbnail: "https://picsum.photos/seed/aurora/80/80",
  },
  {
    id: "P-202",
    name: "Basalt Jacket",
    sku: "JKT-BAS-M",
    price: "$249",
    thumbnail: "https://picsum.photos/seed/basalt/80/80",
  },
  {
    id: "P-203",
    name: "Cirrus Runner",
    sku: "SHO-CIR-42",
    price: "$159",
    thumbnail: "https://picsum.photos/seed/cirrus/80/80",
  },
  {
    id: "P-204",
    name: "Driftwood Beanie",
    sku: "HAT-DRI-OS",
    price: "$34",
    thumbnail: "https://picsum.photos/seed/drift/80/80",
  },
  {
    id: "P-205",
    name: "Ember Glove",
    sku: "GLV-EMB-L",
    price: "$89",
    thumbnail: "https://picsum.photos/seed/ember/80/80",
  },
];

function ProductThumb({ src, alt }: { src: string; alt: string }): ReactNode {
  return (
    <img
      src={src}
      alt={alt}
      width={28}
      height={28}
      style={{ borderRadius: 4, objectFit: "cover" }}
    />
  );
}

export const ProductPicker = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "Rich option rows in a Combobox — thumbnail + product name + SKU + price. " +
          "Uses `leading` for the image and `subtitle` / `trailing` for the extra lines " +
          "(default renderer). Filter matches the `label` field.",
      },
    },
  },
  render: () => {
    const form = useAppForm({
      defaultValues: { product: "" },
      onSubmit: async () => {},
    });
    return (
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <Panel>
            <form.ComboboxField
              name="product"
              label="Product"
              placeholder="Search products…"
              options={PRODUCTS.map((p) => ({
                value: p.id,
                label: p.name,
                leading: <ProductThumb src={p.thumbnail} alt="" />,
                subtitle: `SKU ${p.sku}`,
                trailing: p.price,
              }))}
            />
          </Panel>
        </form>
      </form.AppForm>
    );
  },
});

const PEOPLE = [
  { id: "u-101", name: "Ada Lovelace", role: "Engineering", status: "online" },
  { id: "u-102", name: "Grace Hopper", role: "Engineering", status: "offline" },
  { id: "u-103", name: "Alan Turing", role: "Research", status: "online" },
  { id: "u-104", name: "Barbara Liskov", role: "Engineering", status: "away" },
];

function Avatar({ name, status }: { name: string; status?: string }): ReactNode {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  const ring = status === "online" ? "#16a34a" : status === "away" ? "#f59e0b" : "rgb(0 0 0 / 0.2)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "rgb(0 0 0 / 0.08)",
        color: "rgb(0 0 0 / 0.7)",
        fontSize: 10,
        fontWeight: 600,
        boxShadow: `0 0 0 2px ${ring}`,
      }}
    >
      {initials}
    </span>
  );
}

export const AssigneePickerWithExtras = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the generic extras pattern — options carry custom fields " +
          "(`status`, `role`) that flow through to `renderChip` with full type " +
          "safety. The chip uses a status-ringed avatar; the dropdown row uses the " +
          "default `leading / label / subtitle` layout.",
      },
    },
  },
  render: () => {
    const form = useAppForm({
      defaultValues: { assignees: [] as string[] },
      onSubmit: async () => {},
    });
    return (
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <Panel>
            <form.MultiComboboxField
              name="assignees"
              label="Assignees"
              description="Chip uses a status-ringed avatar; row shows role as subtitle."
              placeholder="Add someone…"
              options={PEOPLE.map((p) => ({
                value: p.id,
                label: p.name,
                leading: <Avatar name={p.name} status={p.status} />,
                subtitle: p.role,
                // extra fields flow through — typed inside renderChip
                status: p.status,
                role: p.role,
              }))}
              renderChip={(o) => (
                <>
                  <span data-slot="combobox-chip-leading" aria-hidden="true">
                    <Avatar name={o.label} status={o.status} />
                  </span>
                  {o.label}
                </>
              )}
            />
          </Panel>
        </form>
      </form.AppForm>
    );
  },
});

export const MultiProductPicker = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "Multi-select version — same rich rows in the dropdown, chips use the " +
          "product name by default. Pass `renderChip` for custom chip content.",
      },
    },
  },
  render: () => {
    const form = useAppForm({
      defaultValues: { cart: [] as string[] },
      onSubmit: async () => {},
    });
    return (
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <Panel>
            <form.MultiComboboxField
              name="cart"
              label="Cart"
              description="Pick products to add. Chips show the product name."
              placeholder="Add a product…"
              maxChips={4}
              options={PRODUCTS.map((p) => ({
                value: p.id,
                label: p.name,
                leading: <ProductThumb src={p.thumbnail} alt="" />,
                subtitle: `SKU ${p.sku}`,
                trailing: p.price,
              }))}
            />
          </Panel>
        </form>
      </form.AppForm>
    );
  },
});

export const MultiCombobox = meta.story({
  render: () => {
    const form = useAppForm({
      defaultValues: { tags: [] as string[] },
      onSubmit: async () => {},
    });
    return (
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <Panel>
            <form.MultiComboboxField
              name="tags"
              label="Tags"
              description="Pick your stack. Chips collapse to +N after 4."
              placeholder="Add a tag…"
              maxChips={4}
              options={TAGS}
            />
          </Panel>
        </form>
      </form.AppForm>
    );
  },
});

export const SingleCheckbox = meta.story({
  render: () => {
    const form = useAppForm({
      defaultValues: { agree: false, newsletter: true },
      onSubmit: async () => {},
    });
    return (
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <Panel>
            <form.CheckboxField
              name="agree"
              label="I agree to the terms and conditions"
              description="You can review them at any time in your account settings."
              required
            />
            <form.CheckboxField name="newsletter" label="Send me product updates" />
          </Panel>
        </form>
      </form.AppForm>
    );
  },
});

export const FullForm = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "A composed form mixing every field type. The Submit button " +
          "subscribes to form state; opening this story will not auto-submit.",
      },
    },
  },
  render: () => {
    const form = useAppForm({
      defaultValues: {
        name: "",
        email: "",
        bio: "",
        country: "",
        plan: "free",
        interests: [] as string[],
        agree: false,
      },
      onSubmit: async ({ value }) => {
        // eslint-disable-next-line no-console
        console.log("submitted", value);
      },
    });

    return (
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <div style={{ maxWidth: 560, display: "grid", gap: 20 }}>
            <form.TextField name="name" label="Full name" />
            <form.TextField name="email" label="Email" type="email" />
            <form.TextareaField name="bio" label="Bio" description="Optional." rows={3} />
            <form.SelectField
              name="country"
              label="Country"
              placeholder="Choose…"
              options={[
                { value: "us", label: "United States" },
                { value: "ca", label: "Canada" },
                { value: "np", label: "Nepal" },
              ]}
            />
            <form.RadioGroupField
              name="plan"
              label="Plan"
              options={[
                { value: "free", label: "Free" },
                { value: "pro", label: "Pro" },
              ]}
            />
            <form.CheckboxGroupField
              name="interests"
              label="Interests"
              orientation="horizontal"
              options={[
                { value: "react", label: "React" },
                { value: "vue", label: "Vue" },
                { value: "solid", label: "Solid" },
              ]}
            />
            <form.CheckboxField name="agree" label="I agree to the terms" required />
            <form.SubmitButton>Create account</form.SubmitButton>
          </div>
        </form>
      </form.AppForm>
    );
  },
});
