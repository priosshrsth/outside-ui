import { useStore } from "@tanstack/react-form";
import clsx from "clsx";
import { type CSSProperties, type ReactNode, useId } from "react";

import { useFieldContext } from "./form-contexts";

export type FormFieldLayout = "column" | "row";

export type FormFieldProps = {
  /** Visible label. */
  label?: ReactNode;
  /** Helper text rendered below the control. */
  description?: ReactNode;
  /** Layout orientation. Default `"column"` (label above control). */
  layout?: FormFieldLayout;
  /**
   * For `layout="row"`, the width reserved for the label column.
   * Accepts any CSS length. Default `"10rem"`.
   */
  labelWidth?: string;
  /** Mark the label with a visual required indicator. */
  required?: boolean;
  /** Marks the container as disabled (visual only — the control itself must still be disabled). */
  disabled?: boolean;
  /** Override the generated control id (forwarded to the label's `htmlFor`). */
  id?: string;
  /** Container className (applied to the outermost grid element). */
  className?: string;
  /** Inline style forwarded to the container. */
  style?: CSSProperties;
  /**
   * Render prop for the actual control. Receives the ids the label /
   * description / error-message refer to, so the control can wire up
   * its `id` and `aria-describedby` correctly.
   */
  children: (ctx: FormFieldRenderContext) => ReactNode;
};

export type FormFieldRenderContext = {
  inputId: string;
  /** Id of the rendered `<label>`. Use `aria-labelledby` on the control
   * when there's no single focusable input to target with `htmlFor`
   * (e.g. radio groups, checkbox groups). */
  labelId: string;
  describedBy: string | undefined;
  hasError: boolean;
  disabled: boolean | undefined;
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
 * Shared chrome for every form field adapter in this library.
 *
 * Handles:
 *   - grid layout (column vs row) via `data-layout`
 *   - label, description, and error message rendering
 *   - the "lazy then eager" error gate (suppresses error display
 *     until the form has been submitted at least once)
 *   - ARIA wiring between control, description, and error message
 *
 * The actual control is provided via the render-prop children, which
 * receive the generated `inputId` and a combined `aria-describedby`.
 *
 * Must be rendered inside a TanStack Form field context (via
 * `<form.AppField>` or `<FieldProvider>`).
 */
export function FormField({
  label,
  description,
  layout = "column",
  labelWidth = "10rem",
  required,
  disabled,
  id,
  className,
  style,
  children,
}: FormFieldProps): ReactNode {
  const field = useFieldContext<unknown>();
  const reactId = useId();
  const inputId = id ?? `${reactId}-${field.name}`;
  const labelId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  const submissionAttempts = useStore(field.form.store, (s) => s.submissionAttempts);
  const shouldDisplayError = submissionAttempts > 0;
  const firstError = shouldDisplayError ? toMessage(field.state.meta.errors[0]) : undefined;
  const hasError = Boolean(firstError);

  const containerStyle =
    layout === "row"
      ? ({
          ...style,
          ["--ou-form-label-width" as string]: labelWidth,
        } as CSSProperties)
      : style;

  const describedBy =
    clsx(description ? descriptionId : undefined, hasError ? errorId : undefined) || undefined;

  return (
    <div
      data-slot="form-field"
      data-layout={layout}
      data-invalid={hasError ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      className={clsx(className)}
      style={containerStyle}
    >
      {label == null ? null : (
        <label data-slot="form-label" id={labelId} htmlFor={inputId}>
          {label}
          {required ? (
            <span data-slot="form-required" aria-hidden="true">
              {" *"}
            </span>
          ) : null}
        </label>
      )}

      {children({ inputId, labelId, describedBy, hasError, disabled })}

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
