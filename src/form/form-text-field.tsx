import type { ReactNode } from "react";

import { FormFieldWithContext } from "./form-field-with-context";
import { FormInput, type FormInputProps } from "./form-input";

/**
 * Loose validator shape mirroring TanStack Form's field-level `validators`.
 * Typed loosely on purpose — each entry accepts either a Standard Schema
 * (zod / valibot) or a plain function; strict typing comes from the schema.
 */
export type FormFieldValidators = {
  onMount?: unknown;
  onChange?: unknown;
  onChangeAsync?: unknown;
  onChangeAsyncDebounceMs?: number;
  onBlur?: unknown;
  onBlurAsync?: unknown;
  onBlurAsyncDebounceMs?: number;
  onSubmit?: unknown;
  onSubmitAsync?: unknown;
  onDynamic?: unknown;
  onDynamicAsync?: unknown;
};

export type FormTextFieldProps = FormInputProps & {
  /** Dotted field path in the form values (e.g. `"user.email"`). */
  name: string;
  /** Optional field-level validators. */
  validators?: FormFieldValidators;
};

/**
 * One-liner text field — reachable as `form.TextField`.
 *
 * @example
 * ```tsx
 * <form.TextField name="email" label="Email" prepend={<MailIcon />} />
 * ```
 */
export function FormTextField({ name, validators, ...inputProps }: FormTextFieldProps): ReactNode {
  return (
    <FormFieldWithContext name={name} validators={validators}>
      <FormInput {...inputProps} />
    </FormFieldWithContext>
  );
}
