import type { ReactNode } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import preview from "../.storybook/preview";
import { useAppForm } from "src/form";
import type { FormFieldLayout } from "src/form";

type Args = {
  layout: FormFieldLayout;
  labelWidth: string;
};

const meta = preview.meta({
  title: "Components/FormInput",
  parameters: { layout: "padded" },
  argTypes: {
    layout: {
      control: { type: "inline-radio" },
      options: ["column", "row"],
    },
    labelWidth: {
      control: { type: "text" },
      description: 'Label column width — only applies to `layout="row"`.',
    },
  },
  args: { layout: "column", labelWidth: "9rem" } satisfies Args,
});

export default meta;

function MailIcon(): ReactNode {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function ShieldIcon(): ReactNode {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  );
}

export const Default = meta.story({
  render: (args) => {
    const { layout, labelWidth } = args as Args;
    const form = useAppForm({
      defaultValues: { email: "" },
      onSubmit: async () => {},
    });
    return (
      <form.AppForm>
        <form
          style={{ maxWidth: 520, display: "grid", gap: 16 }}
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <form.TextField
            name="email"
            label="Email"
            description="We'll never share your email."
            placeholder="you@work.com"
            type="email"
            layout={layout}
            labelWidth={labelWidth}
          />
        </form>
      </form.AppForm>
    );
  },
});

export const WithPrependAndAppend = meta.story({
  render: (args) => {
    const { layout, labelWidth } = args as Args;
    const form = useAppForm({
      defaultValues: { url: "", password: "" },
      onSubmit: async () => {},
    });
    return (
      <form.AppForm>
        <form
          style={{ maxWidth: 520, display: "grid", gap: 20 }}
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <form.TextField
            name="url"
            label="Website"
            prepend="https://"
            append=".com"
            placeholder="acme"
            layout={layout}
            labelWidth={labelWidth}
          />
          <form.TextField
            name="password"
            label="Password"
            description="At least 8 characters."
            prepend={<ShieldIcon />}
            type="password"
            layout={layout}
            labelWidth={labelWidth}
          />
        </form>
      </form.AppForm>
    );
  },
});

export const Validation = meta.story({
  args: { layout: "column", labelWidth: "9rem" },
  parameters: {
    docs: {
      description: {
        story:
          "Errors stay hidden until the user clicks Submit at least once. " +
          "After that first submit attempt, validation updates eagerly on every change. " +
          "Use this story to manually verify the behaviour — it has no play function.",
      },
    },
  },
  render: (args) => {
    const { layout, labelWidth } = args as Args;
    const form = useAppForm({
      defaultValues: { email: "" },
      onSubmit: async ({ value }) => {
        // eslint-disable-next-line no-console
        console.log("submitted", value);
      },
    });

    const required = ({ value }: { value: string }) =>
      value.trim().length === 0 ? "Email is required" : undefined;

    return (
      <form.AppForm>
        <form
          style={{ maxWidth: 520, display: "grid", gap: 16 }}
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <form.TextField
            name="email"
            label="Email"
            description="Required — errors only appear after first submit."
            prepend={<MailIcon />}
            placeholder="you@work.com"
            type="email"
            required
            validators={{ onSubmit: required, onChange: required }}
            layout={layout}
            labelWidth={labelWidth}
          />
          <form.SubmitButton>Submit</form.SubmitButton>
        </form>
      </form.AppForm>
    );
  },
});

export const ValidationLazyThenEagerTest = meta.story({
  args: { layout: "column", labelWidth: "9rem" },
  // Hidden from the Storybook sidebar — this story only exists so the
  // play function below runs in CI. If it were shown in the dev sidebar,
  // navigating to it would auto-submit the form and leave every
  // subsequent manual interaction in post-submit "eager" mode.
  tags: ["!dev"],
  parameters: {
    docs: {
      description: {
        story:
          "Automated regression test for the lazy-then-eager flow. " +
          "Hidden from the dev sidebar — navigating to it auto-runs the play " +
          "function and submits the form. Use the `Validation` story for " +
          "manual exploration.",
      },
    },
  },
  render: (args) => {
    const { layout, labelWidth } = args as Args;
    const form = useAppForm({
      defaultValues: { email: "" },
      onSubmit: async ({ value }) => {
        // eslint-disable-next-line no-console
        console.log("submitted", value);
      },
    });

    const required = ({ value }: { value: string }) =>
      value.trim().length === 0 ? "Email is required" : undefined;

    return (
      <form.AppForm>
        <form
          style={{ maxWidth: 520, display: "grid", gap: 16 }}
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <form.TextField
            name="email"
            label="Email"
            description="Required — errors only appear after first submit."
            prepend={<MailIcon />}
            placeholder="you@work.com"
            type="email"
            required
            validators={{ onSubmit: required, onChange: required }}
            layout={layout}
            labelWidth={labelWidth}
          />
          <form.SubmitButton data-testid="submit">Submit</form.SubmitButton>
        </form>
      </form.AppForm>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: /email/i });
    const submit = canvas.getByTestId("submit");

    // Before submit: no error, even though field is empty.
    await userEvent.type(input, "x");
    await userEvent.clear(input);
    await expect(canvas.queryByRole("alert")).toBeNull();

    // Click submit: validation runs, error appears.
    await userEvent.click(submit);
    await waitFor(() => expect(canvas.getByRole("alert")).toHaveTextContent(/required/i));

    // Typing a valid value: error should clear (eager mode).
    await userEvent.type(input, "a@b.co");
    await waitFor(() => expect(canvas.queryByRole("alert")).toBeNull());
  },
});

export const Disabled = meta.story({
  render: (args) => {
    const { layout, labelWidth } = args as Args;
    const form = useAppForm({
      defaultValues: { email: "readonly@example.com" },
      onSubmit: async () => {},
    });
    return (
      <form.AppForm>
        <form style={{ maxWidth: 520 }} onSubmit={(e) => e.preventDefault()}>
          <form.TextField
            name="email"
            label="Email"
            description="This field is read-only."
            disabled
            layout={layout}
            labelWidth={labelWidth}
          />
        </form>
      </form.AppForm>
    );
  },
});
