import { type ComponentProps, type ReactNode } from "react";

import { useFieldContext } from "./form-contexts";
import { FormField, type FormFieldLayout } from "./form-field";

export type { FormFieldLayout };

export type FormInputProps = Omit<
  ComponentProps<"input">,
  "value" | "onChange" | "onBlur" | "name" | "defaultValue"
> & {
  label?: ReactNode;
  description?: ReactNode;
  prepend?: ReactNode;
  append?: ReactNode;
  layout?: FormFieldLayout;
  labelWidth?: string;
  required?: boolean;
  className?: string;
};

/**
 * A text input wired to the nearest TanStack Form field context.
 *
 * Reads its value, name, error state, and handlers from `useFieldContext`.
 * Use via `<form.TextField>` (see `use-app-form.ts`) for the one-liner
 * API, or render it inside `<form.AppField>` with `field.FormInput`.
 */
export function FormInput({
  label,
  description,
  prepend,
  append,
  layout = "column",
  labelWidth = "10rem",
  required,
  id,
  className,
  style,
  disabled,
  ...inputProps
}: FormInputProps): ReactNode {
  const field = useFieldContext<string>();
  const rawValue = field.state.value;
  const inputValue = rawValue == null ? "" : (rawValue as string | number | readonly string[]);

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
        <div data-slot="form-control">
          {prepend == null ? null : (
            <span data-slot="form-prepend" aria-hidden="true">
              {prepend}
            </span>
          )}
          <input
            {...inputProps}
            data-slot="form-input"
            id={inputId}
            name={field.name}
            value={inputValue}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={() => field.handleBlur()}
          />
          {append == null ? null : (
            <span data-slot="form-append" aria-hidden="true">
              {append}
            </span>
          )}
        </div>
      )}
    </FormField>
  );
}
