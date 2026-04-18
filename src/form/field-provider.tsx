import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

import { fieldContext } from "./form-contexts";

export type FieldProviderProps = {
  /** A field api — typically from a `<form.Field>` render prop. */
  field: AnyFieldApi;
  children: ReactNode;
};

/**
 * Bridges a bare `useForm` + `<form.Field>` render prop into the
 * library's field context so `FormInput` (and other field components)
 * can read it without an explicit `field` prop.
 *
 * @example
 * ```tsx
 * const form = useForm({ defaultValues: { email: "" } });
 *
 * <form.Field name="email">
 *   {(field) => (
 *     <FieldProvider field={field}>
 *       <FormInput label="Email" />
 *     </FieldProvider>
 *   )}
 * </form.Field>
 * ```
 *
 * Most consumers should prefer {@link useAppForm} + `<form.AppField>`,
 * which sets up this provider automatically.
 */
export function FieldProvider({ field, children }: FieldProviderProps): ReactNode {
  return <fieldContext.Provider value={field}>{children}</fieldContext.Provider>;
}
