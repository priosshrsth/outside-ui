import { useStore } from "@tanstack/react-form";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

import { useFormContext } from "./form-contexts";

export type FormSubmitButtonProps = ComponentProps<"button"> & {
  /**
   * Content shown while the form is submitting. If omitted, the
   * button keeps its children and just becomes disabled+aria-busy.
   */
  pendingLabel?: ReactNode;
  /**
   * When `true`, disables the button while the form reports
   * `canSubmit = false` (e.g. a synchronous validator is failing).
   *
   * Defaults to `false` — the button stays clickable so the user's
   * first attempt triggers validation and surfaces field errors.
   * This matches the "validate on first submit, then eager" UX
   * that the rest of the library follows. Set to `true` to grey
   * the button out instead.
   */
  disableWhenInvalid?: boolean;
};

/**
 * A submit button bound to the nearest form context.
 *
 * Automatically disables + sets `aria-busy` while the form is
 * submitting. Requires a {@link useAppForm}-created form (or any
 * `<form.AppForm>`-wrapped tree that provides {@link formContext}).
 */
export function FormSubmitButton({
  type = "submit",
  pendingLabel,
  disableWhenInvalid = false,
  disabled,
  children,
  className,
  ...rest
}: FormSubmitButtonProps): ReactNode {
  const form = useFormContext();
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);
  const canSubmit = useStore(form.store, (s) => s.canSubmit);

  const isDisabled = disabled || isSubmitting || (disableWhenInvalid && !canSubmit);

  return (
    <button
      {...rest}
      type={type}
      data-slot="form-submit"
      aria-busy={isSubmitting || undefined}
      disabled={isDisabled}
      className={clsx(className)}
    >
      {isSubmitting && pendingLabel != null ? pendingLabel : children}
    </button>
  );
}
