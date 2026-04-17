import { Select as BaseSelect, type SelectRoot as BaseSelectRoot } from "@base-ui/react/select";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

import { useDeferredChange } from "src/use-deferred-change";

export type SelectSize = "xs" | "sm" | "md" | "lg";

type TriggerProps = ComponentProps<typeof BaseSelect.Trigger>;
type ValueProps = ComponentProps<typeof BaseSelect.Value>;
type IconProps = ComponentProps<typeof BaseSelect.Icon>;
type PortalProps = ComponentProps<typeof BaseSelect.Portal>;
type PositionerProps = ComponentProps<typeof BaseSelect.Positioner>;
type PopupProps = ComponentProps<typeof BaseSelect.Popup>;
type ListProps = ComponentProps<typeof BaseSelect.List>;
type ItemProps = ComponentProps<typeof BaseSelect.Item>;
type ItemIndicatorProps = ComponentProps<typeof BaseSelect.ItemIndicator>;
type ItemTextProps = ComponentProps<typeof BaseSelect.ItemText>;
type GroupProps = ComponentProps<typeof BaseSelect.Group>;
type GroupLabelProps = ComponentProps<typeof BaseSelect.GroupLabel>;
type SeparatorProps = ComponentProps<typeof BaseSelect.Separator>;
type ScrollUpArrowProps = ComponentProps<typeof BaseSelect.ScrollUpArrow>;
type ScrollDownArrowProps = ComponentProps<typeof BaseSelect.ScrollDownArrow>;

export type SelectTriggerProps = TriggerProps & {
  size?: SelectSize;
};

export type SelectItemProps = ItemProps & {
  leading?: ReactNode;
};

export type SelectItemStyle = "checkmark" | "checkbox";

export type SelectPopupProps = PopupProps & {
  /**
   * Visual treatment for selected items:
   *   - `checkmark` (default) — compact checkmark on the right; good for
   *     single-select or dense lists
   *   - `checkbox` — filled square on the left; reads as a multi-select
   *     filter panel
   */
  itemStyle?: SelectItemStyle;
};

export type SelectValueProps = Omit<ValueProps, "children"> & {
  placeholder?: ReactNode;
  children?: ValueProps["children"];
};

export type SelectRootProps<
  Value = unknown,
  Multiple extends boolean | undefined = false,
> = BaseSelectRoot.Props<Value, Multiple> & {
  /**
   * When set, the internal value updates instantly for immediate UI
   * feedback but `onValueChange` only fires after `debounceMs` of no
   * further interaction. Ignores pointless flips between options.
   */
  debounceMs?: number;
};

function Root<Value, Multiple extends boolean | undefined = false>(
  props: SelectRootProps<Value, Multiple>,
): ReactNode {
  const { debounceMs, value, onValueChange, ...rest } = props;
  const [deferredValue, deferredChange] = useDeferredChange({
    value: value as unknown,
    onChange: (onValueChange ?? (() => {})) as (v: unknown) => void,
    delayMs: debounceMs ?? 0,
  });
  const debounced = (debounceMs ?? 0) > 0 && !!onValueChange;
  const finalValue = debounced ? (deferredValue as typeof value) : value;
  const finalOnChange = debounced ? (deferredChange as typeof onValueChange) : onValueChange;
  return (
    <BaseSelect.Root<Value, Multiple>
      {...(rest as BaseSelectRoot.Props<Value, Multiple>)}
      value={finalValue}
      onValueChange={finalOnChange}
    />
  );
}

function Trigger({ size = "md", className, children, ...rest }: SelectTriggerProps): ReactNode {
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={clsx(className)}
      {...rest}
    >
      {children}
    </BaseSelect.Trigger>
  );
}

function Value({ placeholder, children, className, ...rest }: SelectValueProps): ReactNode {
  if (children) {
    return (
      <BaseSelect.Value data-slot="select-value" className={clsx(className)} {...rest}>
        {children}
      </BaseSelect.Value>
    );
  }
  if (placeholder !== undefined) {
    return (
      <BaseSelect.Value data-slot="select-value" className={clsx(className)} {...rest}>
        {(value) => {
          const empty =
            value == null || value === "" || (Array.isArray(value) && value.length === 0);
          if (empty) return placeholder;
          if (Array.isArray(value)) return value.join(", ");
          return value as ReactNode;
        }}
      </BaseSelect.Value>
    );
  }
  return <BaseSelect.Value data-slot="select-value" className={clsx(className)} {...rest} />;
}

function Icon({ className, children, ...rest }: IconProps): ReactNode {
  return (
    <BaseSelect.Icon data-slot="select-icon" className={clsx(className)} {...rest}>
      {children ?? <ChevronDown />}
    </BaseSelect.Icon>
  );
}

function Portal(props: PortalProps): ReactNode {
  return <BaseSelect.Portal {...props} />;
}

function Positioner({
  className,
  alignItemWithTrigger = false,
  sideOffset = 4,
  ...rest
}: PositionerProps): ReactNode {
  // Base UI Select defaults `alignItemWithTrigger` to true, which places
  // the popup directly over the trigger (macOS native-select behaviour).
  // Every other popup in this library anchors below the trigger, so we
  // invert the default for consistency. Consumers can pass
  // `alignItemWithTrigger` explicitly to opt back in.
  return (
    <BaseSelect.Positioner
      data-slot="select-positioner"
      alignItemWithTrigger={alignItemWithTrigger}
      sideOffset={sideOffset}
      className={clsx(className)}
      {...rest}
    />
  );
}

function Popup({ itemStyle = "checkmark", className, ...rest }: SelectPopupProps): ReactNode {
  return (
    <BaseSelect.Popup
      data-slot="select-popup"
      data-item-style={itemStyle}
      className={clsx(className)}
      {...rest}
    />
  );
}

function List({ className, ...rest }: ListProps): ReactNode {
  return <BaseSelect.List data-slot="select-list" className={clsx(className)} {...rest} />;
}

function Item({ className, children, leading, ...rest }: SelectItemProps): ReactNode {
  return (
    <BaseSelect.Item data-slot="select-item" className={clsx(className)} {...rest}>
      <span data-slot="select-item-checkbox" aria-hidden="true">
        <CheckIcon />
      </span>
      {leading ? (
        <span data-slot="select-item-leading" aria-hidden="true">
          {leading}
        </span>
      ) : null}
      <BaseSelect.ItemText data-slot="select-item-text">{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator data-slot="select-item-indicator" aria-hidden="true">
        <CheckIcon />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

function ItemIndicator({ className, ...rest }: ItemIndicatorProps): ReactNode {
  return (
    <BaseSelect.ItemIndicator
      data-slot="select-item-indicator"
      className={clsx(className)}
      {...rest}
    />
  );
}

function ItemText({ className, ...rest }: ItemTextProps): ReactNode {
  return <BaseSelect.ItemText data-slot="select-item-text" className={clsx(className)} {...rest} />;
}

function Group({ className, ...rest }: GroupProps): ReactNode {
  return <BaseSelect.Group data-slot="select-group" className={clsx(className)} {...rest} />;
}

function GroupLabel({ className, ...rest }: GroupLabelProps): ReactNode {
  return (
    <BaseSelect.GroupLabel data-slot="select-group-label" className={clsx(className)} {...rest} />
  );
}

function Separator({ className, ...rest }: SeparatorProps): ReactNode {
  return (
    <BaseSelect.Separator data-slot="select-separator" className={clsx(className)} {...rest} />
  );
}

function ScrollUpArrow({ className, ...rest }: ScrollUpArrowProps): ReactNode {
  return (
    <BaseSelect.ScrollUpArrow data-slot="select-scroll-up" className={clsx(className)} {...rest} />
  );
}

function ScrollDownArrow({ className, ...rest }: ScrollDownArrowProps): ReactNode {
  return (
    <BaseSelect.ScrollDownArrow
      data-slot="select-scroll-down"
      className={clsx(className)}
      {...rest}
    />
  );
}

function ChevronDown(): ReactNode {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon(): ReactNode {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export const Select = {
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Positioner,
  Popup,
  List,
  Item,
  ItemIndicator,
  ItemText,
  Group,
  GroupLabel,
  Separator,
  ScrollUpArrow,
  ScrollDownArrow,
};
