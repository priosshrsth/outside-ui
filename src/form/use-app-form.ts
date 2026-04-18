import { createFormHook } from "@tanstack/react-form";

import { fieldContext, formContext } from "./form-contexts";
import { FormCheckbox, FormCheckboxField } from "./form-checkbox";
import { FormCheckboxGroup, FormCheckboxGroupField } from "./form-checkbox-group";
import {
  FormCombobox,
  FormComboboxField,
  FormMultiCombobox,
  FormMultiComboboxField,
} from "./form-combobox";
import { FormInput } from "./form-input";
import { FormRadioGroup, FormRadioGroupField } from "./form-radio-group";
import { FormSelect, FormSelectField } from "./form-select";
import { FormSubmitButton } from "./form-submit-button";
import { FormTextField } from "./form-text-field";
import { FormTextarea, FormTextareaField } from "./form-textarea";

/**
 * The library's pre-wired form hook.
 *
 * One-liner field components (accessed as `form.*Field`) take a `name`
 * and render the full control + label + description + error chrome:
 *
 *   | Component                  | Field value type | Notes                       |
 *   | -------------------------- | ---------------- | --------------------------- |
 *   | `form.TextField`           | `string`         | Single-line text input      |
 *   | `form.TextareaField`       | `string`         | Multi-line                  |
 *   | `form.SelectField`         | `T` (generic)    | Single-select dropdown      |
 *   | `form.RadioGroupField`     | `string`         |                             |
 *   | `form.CheckboxGroupField`  | `string[]`       | Multi-select checkboxes     |
 *   | `form.CheckboxField`       | `boolean`        | Single toggle/agree box     |
 *
 * Low-level field components (accessed as `field.Form*` inside
 * `<form.AppField>`) are the same components without the `name`
 * prop — use them when you need to read field state for conditional
 * rendering, or compose a custom layout.
 *
 * To add project-specific fields (e.g. a `DatePicker`), use
 * {@link extendForm} — your extension shares this library's
 * `fieldContext` and `formContext`, so built-ins and your customs
 * can coexist.
 *
 * @example
 * ```tsx
 * const form = useAppForm({
 *   defaultValues: { email: "", plan: "free", agree: false },
 *   validators: { onSubmit: schema, onChange: schema },
 *   onSubmit: async ({ value }) => { ... },
 * });
 *
 * <form.AppForm>
 *   <form onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }}>
 *     <form.TextField name="email" label="Email" />
 *     <form.RadioGroupField name="plan" label="Plan" options={...} />
 *     <form.CheckboxField name="agree" label="I agree" />
 *     <form.SubmitButton>Sign up</form.SubmitButton>
 *   </form>
 * </form.AppForm>
 * ```
 */
export const { useAppForm, withForm, withFieldGroup, useTypedAppFormContext, extendForm } =
  createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      FormInput,
      FormTextarea,
      FormSelect,
      FormCombobox,
      FormMultiCombobox,
      FormRadioGroup,
      FormCheckboxGroup,
      FormCheckbox,
    },
    formComponents: {
      SubmitButton: FormSubmitButton,
      TextField: FormTextField,
      TextareaField: FormTextareaField,
      SelectField: FormSelectField,
      ComboboxField: FormComboboxField,
      MultiComboboxField: FormMultiComboboxField,
      RadioGroupField: FormRadioGroupField,
      CheckboxGroupField: FormCheckboxGroupField,
      CheckboxField: FormCheckboxField,
    },
  });
