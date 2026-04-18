import type { ReactNode } from "react";

import { Radio, RadioGroup, type RadioOrientation } from "src/radio-group";

import { useFieldContext } from "./form-contexts";
import { FormField, type FormFieldLayout } from "./form-field";
import { FormFieldWithContext } from "./form-field-with-context";
import type { FormFieldValidators } from "./form-text-field";

export type FormRadioOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type FormRadioGroupProps = {
  options: FormRadioOption[];
  orientation?: RadioOrientation;
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
 * A radio group wired to the nearest field context.
 *
 * Field value is a single string matching one of `options[].value`.
 * Use via `<form.RadioGroupField>` for the one-liner API.
 */
export function FormRadioGroup({
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
}: FormRadioGroupProps): ReactNode {
  const field = useFieldContext<string>();

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
        <RadioGroup
          id={inputId}
          value={field.state.value ?? ""}
          onValueChange={(next) => field.handleChange(next as string)}
          orientation={orientation}
          disabled={disabled}
          debounceMs={debounceMs}
          aria-labelledby={label == null ? undefined : labelId}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
        >
          {options.map((o) => (
            <Radio
              key={o.value}
              value={o.value}
              disabled={o.disabled}
              onBlur={() => field.handleBlur()}
            >
              {o.label}
            </Radio>
          ))}
        </RadioGroup>
      )}
    </FormField>
  );
}

export type FormRadioGroupFieldProps = FormRadioGroupProps & {
  name: string;
  validators?: FormFieldValidators;
};

/**
 * One-liner radio group field — reachable as `form.RadioGroupField`.
 *
 * @example
 * ```tsx
 * <form.RadioGroupField
 *   name="plan"
 *   label="Plan"
 *   options={[
 *     { value: "free", label: "Free" },
 *     { value: "pro", label: "Pro" },
 *   ]}
 * />
 * ```
 */
export function FormRadioGroupField({
  name,
  validators,
  ...rest
}: FormRadioGroupFieldProps): ReactNode {
  return (
    <FormFieldWithContext name={name} validators={validators}>
      <FormRadioGroup {...rest} />
    </FormFieldWithContext>
  );
}
