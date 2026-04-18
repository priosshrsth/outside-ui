import type { ReactNode } from "react";

import { fieldContext, useFormContext } from "./form-contexts";
import type { FormFieldValidators } from "./form-text-field";

type FieldRenderProp = (field: unknown) => ReactNode;

type InnerFieldProps = {
  name: string;
  validators?: FormFieldValidators;
  children: FieldRenderProp;
};

/**
 * Internal: wraps `form.Field` + `fieldContext.Provider` so the
 * one-liner `form.*Field` components (TextField, TextareaField,
 * SelectField, RadioGroupField, CheckboxGroupField, CheckboxField)
 * can hide the render prop from consumers.
 *
 * Not part of the public API — consumers should use the `form.*Field`
 * components registered on `useAppForm`.
 */
export function FormFieldWithContext({
  name,
  validators,
  children,
}: {
  name: string;
  validators?: FormFieldValidators;
  children: ReactNode;
}): ReactNode {
  const form = useFormContext();
  const Field = form.Field as unknown as React.ComponentType<InnerFieldProps>;
  return (
    <Field name={name} validators={validators}>
      {(field) => <fieldContext.Provider value={field as never}>{children}</fieldContext.Provider>}
    </Field>
  );
}
