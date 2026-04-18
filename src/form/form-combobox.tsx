import type { ReactNode } from "react";

import { Combobox, type ComboboxSize } from "src/combobox";

import { useFieldContext } from "./form-contexts";
import { FormField, type FormFieldLayout } from "./form-field";
import { FormFieldWithContext } from "./form-field-with-context";
import type { FormFieldValidators } from "./form-text-field";

export type FormComboboxOption<TValue = string> = {
  value: TValue;
  /**
   * Searchable string used by the filter and shown inside the `<input>`
   * when the option is the current selection. Must stay a string so
   * Base UI's type-ahead matching works.
   */
  label: string;
  disabled?: boolean;
  /**
   * A visual identifier for the option — icon, small thumbnail, avatar.
   * Rendered in BOTH the option row (leading position) and the chip
   * (for the multi variant). Size is your call — pass a small image or
   * icon that reads well at ~1em. For a larger row-only thumbnail, use
   * `renderOption` instead.
   */
  leading?: ReactNode;
  /** Optional trailing element (badge, meta text, price, etc). */
  trailing?: ReactNode;
  /** Optional secondary line shown under the label (subtitle, SKU, price, etc). */
  subtitle?: ReactNode;
};

/**
 * Shared props for single + multi variants.
 *
 * `TOption` is generic so consumers can carry extra fields on their
 * options and have them flow through to `renderOption` / `renderChip`
 * with full type safety — e.g. `options={products.map(p => ({ value:
 * p.id, label: p.name, sku: p.sku }))}` makes `o.sku` typed inside the
 * render functions.
 */
type SharedProps<TValue, TOption extends FormComboboxOption<TValue>> = {
  options: TOption[];
  placeholder?: string;
  /** Rendered inside the popup when the filter matches nothing. */
  emptyMessage?: ReactNode;
  size?: ComboboxSize;
  label?: ReactNode;
  description?: ReactNode;
  layout?: FormFieldLayout;
  labelWidth?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  /**
   * Custom renderer for each option row in the dropdown. Return any
   * ReactNode. If omitted, the option renders as
   *   `[leading] label / subtitle [trailing]`
   * using whichever of those fields the option provides.
   *
   * Receives the full option including any extra fields the consumer
   * attached — `o.sku`, `o.product`, etc. are typed if present.
   */
  renderOption?: (option: TOption) => ReactNode;
};

function defaultRenderOption<T extends FormComboboxOption<unknown>>(option: T): ReactNode {
  const hasRichContent = option.subtitle != null || option.trailing != null;
  if (!hasRichContent) return option.label;
  return (
    <span data-slot="combobox-item-content">
      <span data-slot="combobox-item-primary">{option.label}</span>
      {option.subtitle == null ? null : (
        <span data-slot="combobox-item-subtitle">{option.subtitle}</span>
      )}
      {option.trailing == null ? null : (
        <span data-slot="combobox-item-trailing">{option.trailing}</span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Single-select
// ---------------------------------------------------------------------------

export type FormComboboxProps<
  TValue = string,
  TOption extends FormComboboxOption<TValue> = FormComboboxOption<TValue>,
> = SharedProps<TValue, TOption>;

/**
 * A filterable single-select dropdown wired to the nearest field context.
 *
 * Use via `<form.ComboboxField>` for the one-liner API.
 */
export function FormCombobox<
  TValue = string,
  TOption extends FormComboboxOption<TValue> = FormComboboxOption<TValue>,
>({
  options,
  placeholder,
  emptyMessage = "No matches",
  size,
  label,
  description,
  layout = "column",
  labelWidth = "10rem",
  required,
  disabled,
  id,
  className,
  renderOption,
}: FormComboboxProps<TValue, TOption>): ReactNode {
  const field = useFieldContext<TValue>();
  const selected = options.find((o) => Object.is(o.value, field.state.value)) ?? null;

  return (
    <FormField
      label={label}
      description={description}
      layout={layout}
      labelWidth={labelWidth}
      required={required}
      disabled={disabled}
      id={id}
      className={className}
    >
      {({ inputId, describedBy, hasError }) => (
        <Combobox.Root<TOption, false>
          items={options}
          value={selected}
          onValueChange={(opt) => {
            if (opt) field.handleChange(opt.value as TValue);
          }}
          itemToStringLabel={(o) => o.label}
          disabled={disabled}
        >
          <Combobox.Input
            id={inputId}
            size={size}
            placeholder={placeholder}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            aria-required={required || undefined}
            onBlur={() => field.handleBlur()}
          />
          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} align="start" collisionPadding={12}>
              <Combobox.Popup>
                <Combobox.List>
                  {(item: TOption) => (
                    <Combobox.Item
                      key={String(item.value)}
                      value={item}
                      disabled={item.disabled}
                      leading={item.leading}
                    >
                      {renderOption ? renderOption(item) : defaultRenderOption(item)}
                    </Combobox.Item>
                  )}
                </Combobox.List>
                <Combobox.Empty>{emptyMessage}</Combobox.Empty>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      )}
    </FormField>
  );
}

export type FormComboboxFieldProps<
  TValue = string,
  TOption extends FormComboboxOption<TValue> = FormComboboxOption<TValue>,
> = FormComboboxProps<TValue, TOption> & {
  name: string;
  validators?: FormFieldValidators;
};

/**
 * One-liner combobox field (single-select) — reachable as `form.ComboboxField`.
 *
 * @example
 * ```tsx
 * <form.ComboboxField
 *   name="country"
 *   label="Country"
 *   placeholder="Search countries…"
 *   options={countries}
 * />
 * ```
 */
export function FormComboboxField<
  TValue = string,
  TOption extends FormComboboxOption<TValue> = FormComboboxOption<TValue>,
>({ name, validators, ...rest }: FormComboboxFieldProps<TValue, TOption>): ReactNode {
  return (
    <FormFieldWithContext name={name} validators={validators}>
      <FormCombobox<TValue, TOption> {...(rest as FormComboboxProps<TValue, TOption>)} />
    </FormFieldWithContext>
  );
}

// ---------------------------------------------------------------------------
// Multi-select with chips
// ---------------------------------------------------------------------------

export type FormMultiComboboxProps<
  TValue = string,
  TOption extends FormComboboxOption<TValue> = FormComboboxOption<TValue>,
> = SharedProps<TValue, TOption> & {
  /**
   * When the number of selected chips exceeds `maxChips`, the tail
   * collapses into a "+N more" overflow chip (a popover that reveals
   * the hidden ones).
   */
  maxChips?: number;
  /**
   * Custom renderer for the chip content. If omitted, chips render as
   * `[leading] label` using the option's `leading` field when present.
   *
   * Receives the full option — including any extra fields the consumer
   * attached — so you can read `o.avatar`, `o.statusColor`, etc. with
   * full type safety.
   */
  renderChip?: (option: TOption) => ReactNode;
};

/**
 * A filterable multi-select combobox with chips.
 *
 * Field value is `TValue[]`. Use via `<form.MultiComboboxField>` for
 * the one-liner API.
 */
export function FormMultiCombobox<
  TValue = string,
  TOption extends FormComboboxOption<TValue> = FormComboboxOption<TValue>,
>({
  options,
  placeholder,
  emptyMessage = "No matches",
  size,
  label,
  description,
  layout = "column",
  labelWidth = "10rem",
  required,
  disabled,
  id,
  className,
  maxChips,
  renderOption,
  renderChip,
}: FormMultiComboboxProps<TValue, TOption>): ReactNode {
  const field = useFieldContext<TValue[]>();
  const rawValue = (field.state.value ?? []) as TValue[];
  const selected = options.filter((o) => rawValue.some((v) => Object.is(v, o.value)));

  return (
    <FormField
      label={label}
      description={description}
      layout={layout}
      labelWidth={labelWidth}
      required={required}
      disabled={disabled}
      id={id}
      className={className}
    >
      {({ inputId, describedBy, hasError }) => (
        <Combobox.Root<TOption, true>
          multiple
          items={options}
          value={selected}
          onValueChange={(opts) => field.handleChange(opts.map((o) => o.value as TValue))}
          itemToStringLabel={(o) => o.label}
          disabled={disabled}
        >
          <Combobox.Chips max={maxChips}>
            {selected.map((opt) => (
              <Combobox.Chip key={String(opt.value)}>
                {renderChip ? (
                  renderChip(opt)
                ) : (
                  <>
                    {opt.leading == null ? null : (
                      <span data-slot="combobox-chip-leading" aria-hidden="true">
                        {opt.leading}
                      </span>
                    )}
                    {opt.label}
                  </>
                )}
                <Combobox.ChipRemove />
              </Combobox.Chip>
            ))}
            <Combobox.Input
              id={inputId}
              size={size}
              placeholder={selected.length ? "" : placeholder}
              aria-invalid={hasError || undefined}
              aria-describedby={describedBy}
              aria-required={required || undefined}
              onBlur={() => field.handleBlur()}
            />
          </Combobox.Chips>
          <Combobox.Portal>
            <Combobox.Positioner sideOffset={4} align="start" collisionPadding={12}>
              <Combobox.Popup>
                <Combobox.List>
                  {(item: TOption) => (
                    <Combobox.Item
                      key={String(item.value)}
                      value={item}
                      disabled={item.disabled}
                      leading={item.leading}
                    >
                      {renderOption ? renderOption(item) : defaultRenderOption(item)}
                    </Combobox.Item>
                  )}
                </Combobox.List>
                <Combobox.Empty>{emptyMessage}</Combobox.Empty>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      )}
    </FormField>
  );
}

export type FormMultiComboboxFieldProps<
  TValue = string,
  TOption extends FormComboboxOption<TValue> = FormComboboxOption<TValue>,
> = FormMultiComboboxProps<TValue, TOption> & {
  name: string;
  validators?: FormFieldValidators;
};

/**
 * One-liner multi-select combobox field — reachable as `form.MultiComboboxField`.
 *
 * @example
 * ```tsx
 * <form.MultiComboboxField
 *   name="tags"
 *   label="Tags"
 *   placeholder="Add tags…"
 *   maxChips={5}
 *   options={tagOptions}
 * />
 * ```
 */
export function FormMultiComboboxField<
  TValue = string,
  TOption extends FormComboboxOption<TValue> = FormComboboxOption<TValue>,
>({ name, validators, ...rest }: FormMultiComboboxFieldProps<TValue, TOption>): ReactNode {
  return (
    <FormFieldWithContext name={name} validators={validators}>
      <FormMultiCombobox<TValue, TOption> {...(rest as FormMultiComboboxProps<TValue, TOption>)} />
    </FormFieldWithContext>
  );
}
