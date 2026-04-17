import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

import { useDeferredChange } from "src/use-deferred-change";

export type ToggleSize = "sm" | "md" | "lg";

type BaseToggleGroupProps = ComponentProps<typeof BaseToggleGroup>;
type BaseToggleProps = ComponentProps<typeof BaseToggle>;

export type ToggleGroupProps = BaseToggleGroupProps & {
  size?: ToggleSize;
  /**
   * When set to a positive number, the internal selection updates
   * immediately (so the UI feels snappy) but `onValueChange` is only
   * fired after no further change for this many ms — detects user intent
   * through a pause instead of committing every interim click.
   */
  debounceMs?: number;
};

export type ToggleProps = BaseToggleProps & {
  size?: ToggleSize;
};

export function ToggleGroup({
  size = "md",
  className,
  role = "toolbar",
  value,
  onValueChange,
  debounceMs,
  ...rest
}: ToggleGroupProps): ReactNode {
  const [deferredValue, deferredChange] = useDeferredChange({
    value: (value ?? []) as readonly unknown[],
    onChange: (onValueChange ?? (() => {})) as (v: readonly unknown[]) => void,
    delayMs: debounceMs ?? 0,
  });
  const debounced = (debounceMs ?? 0) > 0 && !!onValueChange;
  const finalValue = debounced ? (deferredValue as typeof value) : value;
  const finalOnChange = debounced ? (deferredChange as typeof onValueChange) : onValueChange;

  // Base UI defaults to role="group", which doesn't allow aria-orientation
  // under strict axe checks. role="toolbar" carries the same semantics for
  // a toggle strip and accepts aria-orientation cleanly.
  return (
    <BaseToggleGroup
      data-slot="toggle-group"
      data-size={size}
      className={clsx(className)}
      role={role}
      value={finalValue}
      onValueChange={finalOnChange}
      {...rest}
    />
  );
}

export function Toggle({ className, ...rest }: ToggleProps): ReactNode {
  return <BaseToggle data-slot="toggle" className={clsx(className)} {...rest} />;
}
