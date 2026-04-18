import clsx from "clsx";
import type { ReactNode } from "react";

import { Select, type SelectSize } from "src/select";

import { useFieldContext } from "./form-contexts";
import { FormField, type FormFieldLayout } from "./form-field";
import { FormFieldWithContext } from "./form-field-with-context";
import type { FormFieldValidators } from "./form-text-field";

export type FormSelectOption<T = string> = {
  value: T;
  label: ReactNode;
  disabled?: boolean;
};

export type FormSelectProps<T = string> = {
  options: FormSelectOption<T>[];
  placeholder?: ReactNode;
  size?: SelectSize;
  label?: ReactNode;
  description?: ReactNode;
  layout?: FormFieldLayout;
  labelWidth?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  /**
   * Debounce commits to `onValueChange` — useful when the form is
   * wired to URL / network state and you want to ignore pointless
   * flips between options. Default `0` (commit immediately).
   */
  debounceMs?: number;
};

/**
 * A single-select dropdown wired to the nearest field context.
 *
 * Takes a flat `options` array; renders the full Base UI Select tree
 * (Root → Trigger → Portal → Popup → Item) internally. Use via
 * `<form.SelectField>` for the one-liner API.
 */
export function FormSelect<T = string>({
  options,
  placeholder,
  size,
  label,
  description,
  layout = "column",
  labelWidth = "10rem",
  required,
  disabled,
  id,
  className,
  debounceMs,
}: FormSelectProps<T>): ReactNode {
  const field = useFieldContext<T>();
  const selected = options.find((o) => Object.is(o.value, field.state.value));

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
      {({ inputId, describedBy, hasError }) => (
        <Select.Root<T>
          value={field.state.value as T}
          onValueChange={(next) => field.handleChange(next as T)}
          disabled={disabled}
          debounceMs={debounceMs}
        >
          <Select.Trigger
            id={inputId}
            size={size}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            onBlur={() => field.handleBlur()}
            className={clsx("data-slot-form-select-trigger")}
          >
            <Select.Value placeholder={placeholder}>
              {selected ? selected.label : (placeholder as ReactNode)}
            </Select.Value>
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner>
              <Select.Popup>
                <Select.List>
                  {options.map((o, i) => (
                    <Select.Item key={i} value={o.value as never} disabled={o.disabled}>
                      {o.label}
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      )}
    </FormField>
  );
}

export type FormSelectFieldProps<T = string> = FormSelectProps<T> & {
  name: string;
  validators?: FormFieldValidators;
};

/**
 * One-liner select field — reachable as `form.SelectField`.
 *
 * @example
 * ```tsx
 * <form.SelectField
 *   name="country"
 *   label="Country"
 *   placeholder="Choose…"
 *   options={[
 *     { value: "us", label: "United States" },
 *     { value: "ca", label: "Canada" },
 *   ]}
 * />
 * ```
 */
export function FormSelectField<T = string>({
  name,
  validators,
  ...rest
}: FormSelectFieldProps<T>): ReactNode {
  return (
    <FormFieldWithContext name={name} validators={validators}>
      <FormSelect<T> {...rest} />
    </FormFieldWithContext>
  );
}
