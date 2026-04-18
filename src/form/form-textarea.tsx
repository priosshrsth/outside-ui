import type { ComponentProps, ReactNode } from "react";

import { useFieldContext } from "./form-contexts";
import { FormField, type FormFieldLayout } from "./form-field";
import { FormFieldWithContext } from "./form-field-with-context";
import type { FormFieldValidators } from "./form-text-field";

export type FormTextareaProps = Omit<
  ComponentProps<"textarea">,
  "value" | "onChange" | "onBlur" | "name" | "defaultValue"
> & {
  label?: ReactNode;
  description?: ReactNode;
  layout?: FormFieldLayout;
  labelWidth?: string;
  required?: boolean;
  className?: string;
};

/**
 * A multi-line text input wired to the nearest field context.
 *
 * Use via `<form.TextareaField>` for the one-liner API.
 */
export function FormTextarea({
  label,
  description,
  layout = "column",
  labelWidth = "10rem",
  required,
  id,
  className,
  style,
  disabled,
  rows = 3,
  ...rest
}: FormTextareaProps): ReactNode {
  const field = useFieldContext<string>();
  const value = (field.state.value ?? "") as string;

  return (
    <FormField
      label={label}
      description={description}
      layout={layout}
      labelWidth={labelWidth}
      required={required}
      disabled={disabled}
      id={id}
      className={className}
      style={style}
    >
      {({ inputId, describedBy, hasError }) => (
        <div data-slot="form-control" data-variant="textarea">
          <textarea
            {...rest}
            data-slot="form-textarea"
            id={inputId}
            name={field.name}
            value={value}
            rows={rows}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={() => field.handleBlur()}
          />
        </div>
      )}
    </FormField>
  );
}

export type FormTextareaFieldProps = FormTextareaProps & {
  /** Dotted field path in the form values. */
  name: string;
  /** Field-level validators. */
  validators?: FormFieldValidators;
};

/**
 * One-liner textarea field — reachable as `form.TextareaField`.
 */
export function FormTextareaField({
  name,
  validators,
  ...rest
}: FormTextareaFieldProps): ReactNode {
  return (
    <FormFieldWithContext name={name} validators={validators}>
      <FormTextarea {...rest} />
    </FormFieldWithContext>
  );
}
