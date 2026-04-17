import clsx from "clsx";
import {
  cloneElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<ComponentPropsWithoutRef<"button">, "disabled"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Visually and behaviourally disable the button. Implemented via
   * `aria-disabled` (not the native `disabled` attribute) so cursor,
   * focus, and pointer events still work — letting `cursor: not-allowed`
   * render correctly. Clicks are intercepted and cancelled.
   */
  disabled?: boolean;
  isLoading?: boolean;
  iconOnly?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /**
   * Replaces the default spinner shown while `isLoading` is true.
   */
  loadingIcon?: ReactNode;
  /**
   * When true, Button merges its styling and behaviour onto its single
   * React-element child instead of rendering a native `<button>`. Use for
   * router links or any element that should look and act like a button.
   * The child's own `children` are preserved — compose icons/labels inside
   * the child when using this mode.
   *
   * @example
   * <Button asChild variant="primary">
   *   <NextLink href="/dashboard">Dashboard</NextLink>
   * </Button>
   */
  asChild?: boolean;
  ref?: Ref<HTMLElement>;
};

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  iconOnly = false,
  leadingIcon,
  trailingIcon,
  loadingIcon,
  asChild = false,
  type = "button",
  className,
  children,
  onClick,
  ref,
  ...rest
}: ButtonProps): ReactNode {
  const isBlocked = disabled || isLoading;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (isBlocked) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    (onClick as ((e: MouseEvent<HTMLElement>) => void) | undefined)?.(event);
  };

  const sharedProps = {
    "data-slot": "button",
    "data-variant": variant,
    "data-size": size,
    "data-icon-only": iconOnly ? "" : undefined,
    "data-loading": isLoading ? "" : undefined,
    "data-disabled": isBlocked ? "" : undefined,
    "aria-disabled": isBlocked || undefined,
    "aria-busy": isLoading || undefined,
    onClick: handleClick,
    ...rest,
  };

  if (asChild) {
    if (!isValidElement(children)) {
      throw new Error(
        "[@anitshrsth/ui] Button `asChild` expects a single React element as its child.",
      );
    }
    const child = children as ReactElement<{ className?: string }>;
    const mergedProps: Record<string, unknown> = {
      ...sharedProps,
      className: clsx(child.props.className, className),
      ref,
    };
    return cloneElement(child, mergedProps);
  }

  const content = (
    <>
      {isLoading && (
        <span data-slot="button-spinner" aria-hidden="true">
          {loadingIcon}
        </span>
      )}
      {!isLoading && leadingIcon ? (
        <span data-slot="button-leading-icon" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      {children == null ? null : (
        <span data-slot={iconOnly ? "button-icon" : "button-label"}>{children}</span>
      )}
      {!isLoading && trailingIcon ? (
        <span data-slot="button-trailing-icon" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </>
  );

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      className={clsx(className)}
      {...sharedProps}
    >
      {content}
    </button>
  );
}
