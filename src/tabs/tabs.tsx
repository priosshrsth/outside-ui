import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

import { useDeferredChange } from "src/use-deferred-change";

export type TabsVariant = "line" | "solid" | "pills";

type RootProps = ComponentProps<typeof BaseTabs.Root>;
type ListProps = ComponentProps<typeof BaseTabs.List>;
type TabProps = ComponentProps<typeof BaseTabs.Tab>;
type IndicatorProps = ComponentProps<typeof BaseTabs.Indicator>;
type PanelProps = ComponentProps<typeof BaseTabs.Panel>;

export type TabsRootProps = RootProps & {
  variant?: TabsVariant;
  /**
   * When set, the active tab in the UI updates instantly but the external
   * `onValueChange` only fires after this many ms of stillness — lets you
   * ignore indecisive click-throughs and commit on intent.
   */
  debounceMs?: number;
};

function Root({
  variant = "line",
  className,
  value,
  onValueChange,
  debounceMs,
  ...rest
}: TabsRootProps): ReactNode {
  const [deferredValue, deferredChange] = useDeferredChange({
    value: value as unknown,
    onChange: (onValueChange ?? (() => {})) as (v: unknown) => void,
    delayMs: debounceMs ?? 0,
  });
  const debounced = (debounceMs ?? 0) > 0 && !!onValueChange;
  const finalValue = debounced ? (deferredValue as typeof value) : value;
  const finalOnChange = debounced ? (deferredChange as typeof onValueChange) : onValueChange;

  return (
    <BaseTabs.Root
      data-slot="tabs"
      data-variant={variant}
      className={clsx(className)}
      value={finalValue}
      onValueChange={finalOnChange}
      {...rest}
    />
  );
}

function List({ className, ...rest }: ListProps): ReactNode {
  return <BaseTabs.List data-slot="tabs-list" className={clsx(className)} {...rest} />;
}

function Tab({ className, ...rest }: TabProps): ReactNode {
  return <BaseTabs.Tab data-slot="tabs-tab" className={clsx(className)} {...rest} />;
}

function Indicator({ className, ...rest }: IndicatorProps): ReactNode {
  return <BaseTabs.Indicator data-slot="tabs-indicator" className={clsx(className)} {...rest} />;
}

function Panel({ className, ...rest }: PanelProps): ReactNode {
  return <BaseTabs.Panel data-slot="tabs-panel" className={clsx(className)} {...rest} />;
}

export const Tabs = {
  Root,
  List,
  Tab,
  Indicator,
  Panel,
};
