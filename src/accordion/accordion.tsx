import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import clsx from "clsx";
import { type ComponentProps, type ReactNode } from "react";

export type AccordionVariant = "default" | "flush";

type RootProps = ComponentProps<typeof BaseAccordion.Root>;
type ItemProps = ComponentProps<typeof BaseAccordion.Item>;
type HeaderProps = ComponentProps<typeof BaseAccordion.Header>;
type TriggerProps = ComponentProps<typeof BaseAccordion.Trigger>;
type PanelProps = ComponentProps<typeof BaseAccordion.Panel>;

export type AccordionRootProps = RootProps & {
  variant?: AccordionVariant;
};

function Root({ variant = "default", className, ...rest }: AccordionRootProps): ReactNode {
  return (
    <BaseAccordion.Root
      data-slot="accordion"
      data-variant={variant}
      className={clsx(className)}
      {...rest}
    />
  );
}

function Item({ className, ...rest }: ItemProps): ReactNode {
  return <BaseAccordion.Item data-slot="accordion-item" className={clsx(className)} {...rest} />;
}

function Header({ className, ...rest }: HeaderProps): ReactNode {
  return (
    <BaseAccordion.Header data-slot="accordion-header" className={clsx(className)} {...rest} />
  );
}

function Trigger({ className, ...rest }: TriggerProps): ReactNode {
  return (
    <BaseAccordion.Trigger data-slot="accordion-trigger" className={clsx(className)} {...rest} />
  );
}

function Panel({ className, ...rest }: PanelProps): ReactNode {
  return <BaseAccordion.Panel data-slot="accordion-panel" className={clsx(className)} {...rest} />;
}

export type AccordionIndicatorProps = ComponentProps<"span">;

/**
 * Composable slot for the expand/collapse icon. Place anywhere inside a
 * `<Accordion.Trigger>` — the position in JSX controls left/right placement.
 *
 * - Empty (`<Accordion.Indicator />`) renders the default CSS chevron
 * - With children, renders your icon as-is
 *
 * The indicator rotates 180° on open via descendant CSS keyed off the
 * trigger's `[data-panel-open]` attribute. For a different animation
 * (plus→minus, fade, etc.), override the rotation rule in your CSS.
 */
function Indicator({ className, ...rest }: AccordionIndicatorProps): ReactNode {
  return (
    <span
      data-slot="accordion-indicator"
      aria-hidden="true"
      className={clsx(className)}
      {...rest}
    />
  );
}

export const Accordion = {
  Root,
  Item,
  Header,
  Trigger,
  Panel,
  Indicator,
};
