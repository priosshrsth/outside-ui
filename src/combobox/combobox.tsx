import {
  Combobox as BaseCombobox,
  type ComboboxChip,
  type ComboboxChipRemove,
  type ComboboxChips,
  type ComboboxClear,
  type ComboboxCollection,
  type ComboboxEmpty,
  type ComboboxGroup,
  type ComboboxGroupLabel,
  type ComboboxIcon,
  type ComboboxInput,
  type ComboboxItem,
  type ComboboxItemIndicator,
  type ComboboxList,
  type ComboboxPopup,
  type ComboboxPortal,
  type ComboboxPositioner,
  type ComboboxRoot as ComboboxRootType,
  type ComboboxStatus,
  type ComboboxTrigger,
} from "@base-ui/react/combobox";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { type Separator as BaseSeparator } from "@base-ui/react/separator";
import clsx from "clsx";
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useRef,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";

export type ComboboxSize = "sm" | "md" | "lg";

type TriggerProps = ComboboxTrigger.Props;
type IconProps = ComboboxIcon.Props;
type ClearProps = ComboboxClear.Props;
type PortalProps = ComboboxPortal.Props;
type PositionerProps = ComboboxPositioner.Props;
type PopupProps = ComboboxPopup.Props;
type ListProps = ComboboxList.Props;
type CollectionProps = ComboboxCollection.Props;
type StatusProps = ComboboxStatus.Props;
type EmptyProps = ComboboxEmpty.Props;
type ItemProps = ComboboxItem.Props;
type ItemIndicatorProps = ComboboxItemIndicator.Props;
type GroupProps = ComboboxGroup.Props;
type GroupLabelProps = ComboboxGroupLabel.Props;
type SeparatorProps = BaseSeparator.Props;
type ChipsProps = ComboboxChips.Props;
type ChipProps = ComboboxChip.Props;
type ChipRemoveProps = ComboboxChipRemove.Props;

export type ComboboxInputProps = Omit<ComboboxInput.Props, "size"> & {
  size?: ComboboxSize;
};

export type ComboboxItemProps = ItemProps & {
  leading?: ReactNode;
};

const Value = BaseCombobox.Value;

/**
 * Lets our <Chips> wrapper register its DOM node so <Positioner> can use it
 * as the popover anchor by default, making the popup match the chips
 * container's width instead of the inner input. Provided at Root-level so
 * the Portal subtree (which is a sibling of Chips) can still read it.
 */
const ComboboxAnchorContext = createContext<RefObject<HTMLElement | null> | null>(null);

function Root<Value, Multiple extends boolean | undefined = false>(
  props: ComboboxRootType.Props<Value, Multiple>,
): ReactNode {
  const anchorRef = useRef<HTMLElement | null>(null);
  return (
    <ComboboxAnchorContext.Provider value={anchorRef}>
      <BaseCombobox.Root<Value, Multiple> {...props} />
    </ComboboxAnchorContext.Provider>
  );
}

function Input({ size = "md", className, ...rest }: ComboboxInputProps): ReactNode {
  return (
    <BaseCombobox.Input
      data-slot="combobox-input"
      data-size={size}
      className={clsx(className)}
      {...rest}
    />
  );
}

function Trigger({ className, children, ...rest }: TriggerProps): ReactNode {
  return (
    <BaseCombobox.Trigger data-slot="combobox-trigger" className={clsx(className)} {...rest}>
      {children ?? <ChevronDown />}
    </BaseCombobox.Trigger>
  );
}

function Icon({ className, children, ...rest }: IconProps): ReactNode {
  return (
    <BaseCombobox.Icon data-slot="combobox-icon" className={clsx(className)} {...rest}>
      {children ?? <ChevronDown />}
    </BaseCombobox.Icon>
  );
}

function Clear({ className, children, ...rest }: ClearProps): ReactNode {
  return (
    <BaseCombobox.Clear
      data-slot="combobox-clear"
      aria-label="Clear"
      className={clsx(className)}
      {...rest}
    >
      {children ?? <XIcon />}
    </BaseCombobox.Clear>
  );
}

function Portal(props: PortalProps): ReactNode {
  return <BaseCombobox.Portal {...props} />;
}

function Positioner({ className, anchor, ...rest }: PositionerProps): ReactNode {
  const chipsRef = useContext(ComboboxAnchorContext);
  return (
    <BaseCombobox.Positioner
      data-slot="combobox-positioner"
      anchor={anchor ?? chipsRef ?? undefined}
      className={clsx(className)}
      {...rest}
    />
  );
}

function Popup({ className, ...rest }: PopupProps): ReactNode {
  return <BaseCombobox.Popup data-slot="combobox-popup" className={clsx(className)} {...rest} />;
}

function List({ className, ...rest }: ListProps): ReactNode {
  return <BaseCombobox.List data-slot="combobox-list" className={clsx(className)} {...rest} />;
}

function Collection(props: CollectionProps): ReactNode {
  return <BaseCombobox.Collection {...props} />;
}

function Status({ className, ...rest }: StatusProps): ReactNode {
  return <BaseCombobox.Status data-slot="combobox-status" className={clsx(className)} {...rest} />;
}

function Empty({ className, ...rest }: EmptyProps): ReactNode {
  return <BaseCombobox.Empty data-slot="combobox-empty" className={clsx(className)} {...rest} />;
}

function Item({ className, children, leading, ...rest }: ComboboxItemProps): ReactNode {
  return (
    <BaseCombobox.Item data-slot="combobox-item" className={clsx(className)} {...rest}>
      {leading ? (
        <span data-slot="combobox-item-leading" aria-hidden="true">
          {leading}
        </span>
      ) : null}
      <span data-slot="combobox-item-text">{children}</span>
      <BaseCombobox.ItemIndicator data-slot="combobox-item-indicator" aria-hidden="true">
        <CheckIcon />
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  );
}

function ItemIndicator({ className, ...rest }: ItemIndicatorProps): ReactNode {
  return (
    <BaseCombobox.ItemIndicator
      data-slot="combobox-item-indicator"
      className={clsx(className)}
      {...rest}
    />
  );
}

function Group({ className, ...rest }: GroupProps): ReactNode {
  return <BaseCombobox.Group data-slot="combobox-group" className={clsx(className)} {...rest} />;
}

function GroupLabel({ className, ...rest }: GroupLabelProps): ReactNode {
  return (
    <BaseCombobox.GroupLabel
      data-slot="combobox-group-label"
      className={clsx(className)}
      {...rest}
    />
  );
}

function Separator({ className, ...rest }: SeparatorProps): ReactNode {
  return (
    <BaseCombobox.Separator data-slot="combobox-separator" className={clsx(className)} {...rest} />
  );
}

export type ComboboxChipsProps = ChipsProps & {
  /**
   * Maximum number of chips to show before collapsing into a "+N more"
   * overflow chip. When `chipCount > max`, the first `max - 1` chips
   * render followed by one overflow chip (a Popover trigger). The popover
   * shows the hidden chips, with their remove buttons still functional.
   * Non-chip children (e.g. `Combobox.Input`) are unaffected.
   */
  max?: number;
  /**
   * Custom renderer for the overflow. Receives the hidden count and the
   * hidden chip elements, lets you return whatever UI you want.
   */
  renderOverflow?: (hiddenCount: number, hiddenChips: ReactNode[]) => ReactNode;
};

export type ChipsRef = Ref<HTMLDivElement>;

function Chips({
  className,
  children,
  max,
  renderOverflow,
  ref: forwardedRef,
  ...rest
}: ComboboxChipsProps & { ref?: ChipsRef }): ReactNode {
  const anchorRef = useContext(ComboboxAnchorContext);
  const setRef = (node: HTMLDivElement | null) => {
    if (anchorRef) anchorRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) {
      (forwardedRef as { current: HTMLDivElement | null }).current = node;
    }
  };

  let content = children;
  if (max !== undefined && max > 0) {
    const flat = Children.toArray(children);
    const chips: ReactNode[] = [];
    const others: ReactNode[] = [];
    for (const child of flat) {
      if (isValidElement(child) && child.type === Chip) {
        chips.push(child);
      } else {
        others.push(child);
      }
    }
    if (chips.length > max) {
      const visible = chips.slice(0, Math.max(0, max - 1));
      const hiddenChips = chips.slice(Math.max(0, max - 1));
      const hiddenCount = hiddenChips.length;
      const overflow = renderOverflow ? (
        renderOverflow(hiddenCount, hiddenChips)
      ) : (
        <ChipOverflow key="__ou-chip-overflow" count={hiddenCount}>
          {hiddenChips}
        </ChipOverflow>
      );
      content = [...visible, overflow, ...others];
    }
  }
  return (
    <BaseCombobox.Chips
      ref={setRef}
      data-slot="combobox-chips"
      className={clsx(className)}
      {...rest}
    >
      {content}
    </BaseCombobox.Chips>
  );
}

export type ComboboxChipOverflowProps = {
  count: number;
  children: ReactNode;
  /** Distance between the +N chip and the popup. */
  sideOffset?: number;
};

/**
 * Renders the "+N more" chip as a Popover trigger. Clicking it reveals
 * the hidden chips (with their remove buttons still wired to the
 * Combobox state) in a small floating panel.
 */
function ChipOverflow({ count, children, sideOffset = 6 }: ComboboxChipOverflowProps): ReactNode {
  return (
    <BasePopover.Root>
      <BasePopover.Trigger
        nativeButton={false}
        render={<Chip data-overflow="" role="button" tabIndex={0} />}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        +{count} more
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner sideOffset={sideOffset} collisionPadding={12}>
          <BasePopover.Popup data-slot="combobox-chip-overflow-popup">{children}</BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

function Chip({ className, ...rest }: ChipProps): ReactNode {
  return <BaseCombobox.Chip data-slot="combobox-chip" className={clsx(className)} {...rest} />;
}

function ChipRemove({ className, children, ...rest }: ChipRemoveProps): ReactNode {
  return (
    <BaseCombobox.ChipRemove
      data-slot="combobox-chip-remove"
      aria-label="Remove"
      className={clsx(className)}
      {...rest}
    >
      {children ?? <XIcon />}
    </BaseCombobox.ChipRemove>
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

function XIcon(): ReactNode {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export const Combobox = {
  Root,
  Input,
  Trigger,
  Value,
  Icon,
  Clear,
  Portal,
  Positioner,
  Popup,
  List,
  Collection,
  Status,
  Empty,
  Item,
  ItemIndicator,
  Group,
  GroupLabel,
  Separator,
  Chips,
  Chip,
  ChipRemove,
  ChipOverflow,
};
