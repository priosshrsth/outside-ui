import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

export type InputSize = "sm" | "md" | "lg";

export type InputProps = Omit<ComponentProps<"input">, "size" | "prefix"> & {
  /** Content rendered before the input (icon, unit prefix, etc). */
  prepend?: ReactNode;
  /** Content rendered after the input. */
  append?: ReactNode;
  /**
   * Visual error state. Sets `data-invalid` on the container so CSS
   * picks up the invalid border / ring. The underlying `<input>` also
   * receives `aria-invalid="true"` for assistive tech.
   */
  invalid?: boolean;
  /** Size variant — controls padding and font-size. Default `"md"`. */
  size?: InputSize;
  /**
   * Class name applied to the outer container. Style the inner input
   * via the `[data-slot="form-input"]` selector.
   */
  className?: string;
};

type InputElementProps = Omit<InputProps, "ref"> & {
  ref?: React.Ref<HTMLInputElement>;
};

/**
 * A styled text input, no form-state library required.
 *
 * Uses the same `form-control` / `form-input` CSS slots as
 * {@link FormInput} — import `@anitshrsth/ui/styles/form.css` (or the
 * bundled `styles.css`) to get the default look. The container tracks
 * `data-invalid` / `data-disabled` / `data-size` attributes that
 * consumer CSS can target.
 *
 * For form fields with label + error chrome tied to TanStack Form, use
 * `form.TextField` / `FormInput` from `@anitshrsth/ui/form` instead.
 *
 * @example
 * ```tsx
 * <Input
 *   prepend={<SearchIcon />}
 *   placeholder="Search…"
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 * />
 * ```
 */
export function Input({
  prepend,
  append,
  invalid,
  size = "md",
  disabled,
  className,
  ref,
  ...rest
}: InputElementProps): ReactNode {
  return (
    <div
      data-slot="form-control"
      data-variant="input"
      data-size={size}
      data-invalid={invalid ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      className={clsx(className)}
    >
      {prepend == null ? null : (
        <span data-slot="form-prepend" aria-hidden="true">
          {prepend}
        </span>
      )}
      <input
        ref={ref}
        {...rest}
        data-slot="form-input"
        disabled={disabled}
        aria-invalid={invalid || undefined}
      />
      {append == null ? null : (
        <span data-slot="form-append" aria-hidden="true">
          {append}
        </span>
      )}
    </div>
  );
}
