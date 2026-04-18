import { useStore } from "@tanstack/react-form";
import clsx from "clsx";
import { type ReactNode, useId } from "react";

import { Checkbox } from "src/checkbox-group";

import { useFieldContext } from "./form-contexts";
import { FormFieldWithContext } from "./form-field-with-context";
import type { FormFieldValidators } from "./form-text-field";

export type FormCheckboxProps = {
  /** The label rendered next to the checkbox. */
  label?: ReactNode;
  /** Optional helper text rendered below the row. */
  description?: ReactNode;
  /** Mark the label with a visual required indicator. */
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
};

function toMessage(err: unknown): string | undefined {
  if (err == null || err === false) return undefined;
  if (typeof err === "string") return err;
  if (
    typeof err === "object" &&
    "message" in err &&
    typeof (err as { message?: unknown }).message === "string"
  ) {
    return (err as { message: string }).message;
  }
  return undefined;
}

/**
 * A single boolean checkbox wired to the nearest field context.
 *
 * Layout is different from other form controls — the checkbox is
 * inline with its label, not stacked below. Description and error
 * rendering follow the standard chrome.
 *
 * Use via `<form.CheckboxField>` for the one-liner API.
 */
export function FormCheckbox({
  label,
  description,
  required,
  disabled,
  id,
  className,
}: FormCheckboxProps): ReactNode {
  const field = useFieldContext<boolean>();
  const reactId = useId();
  const inputId = id ?? `${reactId}-${field.name}`;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  const submissionAttempts = useStore(field.form.store, (s) => s.submissionAttempts);
  const shouldDisplayError = submissionAttempts > 0;
  const firstError = shouldDisplayError ? toMessage(field.state.meta.errors[0]) : undefined;
  const hasError = Boolean(firstError);

  const describedBy =
    clsx(description ? descriptionId : undefined, hasError ? errorId : undefined) || undefined;

  return (
    <div
      data-slot="form-field"
      data-variant="checkbox"
      data-invalid={hasError ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      className={clsx(className)}
    >
      <Checkbox
        id={inputId}
        name={field.name}
        checked={Boolean(field.state.value)}
        onCheckedChange={(next) => field.handleChange(Boolean(next))}
        onBlur={() => field.handleBlur()}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
      >
        {label}
        {required ? (
          <span data-slot="form-required" aria-hidden="true">
            {" *"}
          </span>
        ) : null}
      </Checkbox>

      {description == null ? null : (
        <div data-slot="form-description" id={descriptionId}>
          {description}
        </div>
      )}

      {firstError ? (
        <div data-slot="form-message" id={errorId} role="alert">
          {firstError}
        </div>
      ) : null}
    </div>
  );
}

export type FormCheckboxFieldProps = FormCheckboxProps & {
  name: string;
  validators?: FormFieldValidators;
};

/**
 * One-liner single-checkbox field — reachable as `form.CheckboxField`.
 *
 * Field value is `boolean`. Use for agreement checkboxes, toggles,
 * "remember me" switches, etc.
 *
 * @example
 * ```tsx
 * <form.CheckboxField name="agree" label="I agree to the terms" required />
 * ```
 */
export function FormCheckboxField({
  name,
  validators,
  ...rest
}: FormCheckboxFieldProps): ReactNode {
  return (
    <FormFieldWithContext name={name} validators={validators}>
      <FormCheckbox {...rest} />
    </FormFieldWithContext>
  );
}
