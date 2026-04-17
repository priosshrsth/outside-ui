import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

import { useDeferredChange } from "src/use-deferred-change";

export type RadioOrientation = "vertical" | "horizontal";

type BaseRadioGroupProps = ComponentProps<typeof BaseRadioGroup>;
type BaseRadioRootProps = ComponentProps<typeof BaseRadio.Root>;
type BaseRadioIndicatorProps = ComponentProps<typeof BaseRadio.Indicator>;

export type RadioGroupProps = BaseRadioGroupProps & {
  orientation?: RadioOrientation;
  /**
   * When set to a positive number, selection changes are applied to
   * internal state immediately but `onValueChange` only fires after this
   * many ms of no further change — useful for URL / network syncing on
   * intent rather than on every transient click.
   */
  debounceMs?: number;
};

export type RadioProps = Omit<BaseRadioRootProps, "children"> & {
  /** Visible label rendered next to the indicator. */
  children?: ReactNode;
  /** Override the indicator markup (rare — defaults to a filled dot). */
  indicator?: ReactNode;
};

export function RadioGroup({
  orientation = "vertical",
  className,
  value,
  onValueChange,
  debounceMs,
  ...rest
}: RadioGroupProps): ReactNode {
  const [deferredValue, deferredChange] = useDeferredChange({
    value: value as unknown,
    onChange: (onValueChange ?? (() => {})) as (v: unknown) => void,
    delayMs: debounceMs ?? 0,
  });
  const debounced = (debounceMs ?? 0) > 0 && !!onValueChange;
  const finalValue = debounced ? (deferredValue as typeof value) : value;
  const finalOnChange = debounced ? (deferredChange as typeof onValueChange) : onValueChange;

  return (
    <BaseRadioGroup
      data-slot="radio-group"
      data-orientation={orientation}
      className={clsx(className)}
      value={finalValue}
      onValueChange={finalOnChange}
      {...rest}
    />
  );
}

export function Radio({ className, children, indicator, ...rest }: RadioProps): ReactNode {
  return (
    <BaseRadio.Root data-slot="radio" className={clsx(className)} {...rest}>
      <span data-slot="radio-control" aria-hidden="true">
        {indicator ?? <BaseRadio.Indicator data-slot="radio-indicator" />}
      </span>
      {children == null ? null : <span data-slot="radio-label">{children}</span>}
    </BaseRadio.Root>
  );
}

export type RadioIndicatorProps = BaseRadioIndicatorProps;

export function RadioIndicator({ className, ...rest }: RadioIndicatorProps): ReactNode {
  return <BaseRadio.Indicator data-slot="radio-indicator" className={clsx(className)} {...rest} />;
}
