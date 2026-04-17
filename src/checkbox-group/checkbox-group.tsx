import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

import { useDeferredChange } from "src/use-deferred-change";

export type CheckboxOrientation = "vertical" | "horizontal";

type BaseCheckboxGroupProps = ComponentProps<typeof BaseCheckboxGroup>;
type BaseCheckboxRootProps = ComponentProps<typeof BaseCheckbox.Root>;
type BaseCheckboxIndicatorProps = ComponentProps<typeof BaseCheckbox.Indicator>;

export type CheckboxGroupProps = BaseCheckboxGroupProps & {
  orientation?: CheckboxOrientation;
  /**
   * When set to a positive number, selection updates the internal state
   * immediately but `onValueChange` only fires after the user pauses for
   * this many ms — batches rapid toggling into a single commit.
   */
  debounceMs?: number;
};

export type CheckboxProps = Omit<BaseCheckboxRootProps, "children"> & {
  /** Visible label rendered next to the indicator. */
  children?: ReactNode;
  /** Override the indicator markup (rare). */
  indicator?: ReactNode;
};

export function CheckboxGroup({
  orientation = "vertical",
  className,
  value,
  onValueChange,
  debounceMs,
  ...rest
}: CheckboxGroupProps): ReactNode {
  const [deferredValue, deferredChange] = useDeferredChange<string[]>({
    value: (value ?? []) as string[],
    onChange: (next) => onValueChange?.(next, {} as never),
    delayMs: debounceMs ?? 0,
  });
  const debounced = (debounceMs ?? 0) > 0 && !!onValueChange;
  const finalValue = debounced ? deferredValue : value;
  const finalOnChange = debounced ? (next: string[]) => deferredChange(next) : onValueChange;

  return (
    <BaseCheckboxGroup
      data-slot="checkbox-group"
      data-orientation={orientation}
      className={clsx(className)}
      value={finalValue}
      onValueChange={finalOnChange}
      {...rest}
    />
  );
}

export function Checkbox({ className, children, indicator, ...rest }: CheckboxProps): ReactNode {
  return (
    <BaseCheckbox.Root data-slot="checkbox" className={clsx(className)} {...rest}>
      <span data-slot="checkbox-control" aria-hidden="true">
        {indicator ?? (
          <BaseCheckbox.Indicator data-slot="checkbox-indicator">
            <CheckIcon />
            <IndeterminateIcon />
          </BaseCheckbox.Indicator>
        )}
      </span>
      {children == null ? null : <span data-slot="checkbox-label">{children}</span>}
    </BaseCheckbox.Root>
  );
}

export type CheckboxIndicatorProps = BaseCheckboxIndicatorProps;

export function CheckboxIndicator({ className, ...rest }: CheckboxIndicatorProps): ReactNode {
  return (
    <BaseCheckbox.Indicator data-slot="checkbox-indicator" className={clsx(className)} {...rest} />
  );
}

function CheckIcon(): ReactNode {
  return (
    <svg
      data-check-icon=""
      width="0.875em"
      height="0.875em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IndeterminateIcon(): ReactNode {
  return (
    <svg
      data-indeterminate-icon=""
      width="0.875em"
      height="0.875em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
