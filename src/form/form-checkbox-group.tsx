import type { ReactNode } from "react";

import { Checkbox, CheckboxGroup, type CheckboxOrientation } from "src/checkbox-group";

import { useFieldContext } from "./form-contexts";
import { FormField, type FormFieldLayout } from "./form-field";
import { FormFieldWithContext } from "./form-field-with-context";
import type { FormFieldValidators } from "./form-text-field";

export type FormCheckboxOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type FormCheckboxGroupProps = {
  options: FormCheckboxOption[];
  orientation?: CheckboxOrientation;
  label?: ReactNode;
  description?: ReactNode;
  layout?: FormFieldLayout;
  labelWidth?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  debounceMs?: number;
};

/**
 * A multi-select checkbox group wired to the nearest field context.
 *
 * Field value is `string[]` — each selected option's value is
 * included. Use via `<form.CheckboxGroupField>` for the one-liner API.
 */
export function FormCheckboxGroup({
  options,
  orientation = "vertical",
  label,
  description,
  layout = "column",
  labelWidth = "10rem",
  required,
  disabled,
  id,
  className,
  debounceMs,
}: FormCheckboxGroupProps): ReactNode {
  const field = useFieldContext<string[]>();
  const value = (field.state.value ?? []) as string[];

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
    >
      {({ inputId, labelId, describedBy, hasError }) => (
        <CheckboxGroup
          id={inputId}
          value={value}
          onValueChange={(next) => field.handleChange(next)}
          orientation={orientation}
          disabled={disabled}
          debounceMs={debounceMs}
          aria-labelledby={label == null ? undefined : labelId}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
        >
          {options.map((o) => (
            <Checkbox
              key={o.value}
              name={o.value}
              disabled={o.disabled}
              onBlur={() => field.handleBlur()}
            >
              {o.label}
            </Checkbox>
          ))}
        </CheckboxGroup>
      )}
    </FormField>
  );
}

export type FormCheckboxGroupFieldProps = FormCheckboxGroupProps & {
  name: string;
  validators?: FormFieldValidators;
};

/**
 * One-liner checkbox group field — reachable as `form.CheckboxGroupField`.
 *
 * @example
 * ```tsx
 * <form.CheckboxGroupField
 *   name="interests"
 *   label="Interests"
 *   options={[
 *     { value: "react", label: "React" },
 *     { value: "vue", label: "Vue" },
 *   ]}
 * />
 * ```
 */
export function FormCheckboxGroupField({
  name,
  validators,
  ...rest
}: FormCheckboxGroupFieldProps): ReactNode {
  return (
    <FormFieldWithContext name={name} validators={validators}>
      <FormCheckboxGroup {...rest} />
    </FormFieldWithContext>
  );
}
