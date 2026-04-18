import { createFormHookContexts } from "@tanstack/react-form";

/**
 * Shared field + form contexts for the library's form primitives.
 *
 * Consumers usually don't touch these directly — they just call
 * {@link useAppForm} and render `<form.AppField>{(field) => <field.FormInput />}`.
 *
 * They ARE exported for two advanced cases:
 *   1. Using a bare `useForm` + `<form.Field>` render prop — wrap
 *      the children in {@link FieldProvider} (which reads `fieldContext`)
 *      so `FormInput` / `FormSubmitButton` still see the right field.
 *   2. Building a custom form hook via `createFormHook` — pass
 *      `fieldContext` and `formContext` in so your custom components
 *      and the library's components share the same provider tree.
 */
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
