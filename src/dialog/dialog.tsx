import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

export type DialogPopupPosition =
  | "center"
  | "sheet-right"
  | "sheet-left"
  | "sheet-top"
  | "sheet-bottom"
  | "fullscreen";

type RootProps = ComponentProps<typeof BaseDialog.Root>;
type TriggerProps = ComponentProps<typeof BaseDialog.Trigger>;
type PortalProps = ComponentProps<typeof BaseDialog.Portal>;
type BackdropProps = ComponentProps<typeof BaseDialog.Backdrop>;
type BasePopupProps = ComponentProps<typeof BaseDialog.Popup>;
type TitleProps = ComponentProps<typeof BaseDialog.Title>;
type DescriptionProps = ComponentProps<typeof BaseDialog.Description>;
type CloseProps = ComponentProps<typeof BaseDialog.Close>;

export type DialogPopupProps = BasePopupProps & {
  position?: DialogPopupPosition;
};

export type DialogLayoutProps = ComponentProps<"div">;

function Root(props: RootProps): ReactNode {
  return <BaseDialog.Root {...props} />;
}

function Trigger({ className, ...rest }: TriggerProps): ReactNode {
  return <BaseDialog.Trigger data-slot="dialog-trigger" className={clsx(className)} {...rest} />;
}

function Portal(props: PortalProps): ReactNode {
  return <BaseDialog.Portal {...props} />;
}

function Backdrop({ className, ...rest }: BackdropProps): ReactNode {
  return <BaseDialog.Backdrop data-slot="dialog-backdrop" className={clsx(className)} {...rest} />;
}

function Popup({ position = "center", className, ...rest }: DialogPopupProps): ReactNode {
  return (
    <BaseDialog.Popup
      data-slot="dialog-popup"
      data-position={position}
      className={clsx(className)}
      {...rest}
    />
  );
}

function Title({ className, ...rest }: TitleProps): ReactNode {
  return <BaseDialog.Title data-slot="dialog-title" className={clsx(className)} {...rest} />;
}

function Description({ className, ...rest }: DescriptionProps): ReactNode {
  return (
    <BaseDialog.Description data-slot="dialog-description" className={clsx(className)} {...rest} />
  );
}

function Close({ className, ...rest }: CloseProps): ReactNode {
  return <BaseDialog.Close data-slot="dialog-close" className={clsx(className)} {...rest} />;
}

function Header({ className, ...rest }: DialogLayoutProps): ReactNode {
  return <div data-slot="dialog-header" className={clsx(className)} {...rest} />;
}

function Body({ className, ...rest }: DialogLayoutProps): ReactNode {
  return <div data-slot="dialog-body" className={clsx(className)} {...rest} />;
}

function Footer({ className, ...rest }: DialogLayoutProps): ReactNode {
  return <div data-slot="dialog-footer" className={clsx(className)} {...rest} />;
}

export const Dialog = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Popup,
  Title,
  Description,
  Close,
  Header,
  Body,
  Footer,
};
