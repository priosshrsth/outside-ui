import { useState } from "react";

import preview from "../.storybook/preview";
import { Button } from "src/button";
import { Dialog, type DialogPopupPosition } from "src/dialog";

type DemoArgs = { position: DialogPopupPosition };

const meta = preview.meta({
  title: "Components/Dialog",
  parameters: { layout: "centered" },
  argTypes: {
    position: {
      control: { type: "select" },
      options: [
        "center",
        "sheet-right",
        "sheet-left",
        "sheet-top",
        "sheet-bottom",
        "fullscreen",
      ] satisfies DialogPopupPosition[],
    },
  },
  args: { position: "center" } satisfies DemoArgs,
});

export default meta;

function BasicDialog({ position }: DemoArgs) {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button>Open {position}</Button>} />
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup position={position}>
          <Dialog.Header>
            <div>
              <Dialog.Title>Confirm action</Dialog.Title>
              <Dialog.Description>
                This is a {position} dialog using Base UI + CSS transitions.
              </Dialog.Description>
            </div>
            <Dialog.Close
              render={
                <Button variant="ghost" size="sm" aria-label="Close">
                  ×
                </Button>
              }
            />
          </Dialog.Header>
          <Dialog.Body>
            <p style={{ margin: 0 }}>
              Dialog content lives here. Scrolls when tall, stays still when short.
            </p>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="ghost">Cancel</Button>} />
            <Dialog.Close render={<Button variant="primary">Confirm</Button>} />
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const Playground = meta.story({
  render: (args) => <BasicDialog {...(args as DemoArgs)} />,
});

export const Center = meta.story({
  render: () => <BasicDialog position="center" />,
});

export const SheetRight = meta.story({
  render: () => <BasicDialog position="sheet-right" />,
});

export const SheetLeft = meta.story({
  render: () => <BasicDialog position="sheet-left" />,
});

export const SheetTop = meta.story({
  render: () => <BasicDialog position="sheet-top" />,
});

export const SheetBottom = meta.story({
  render: () => <BasicDialog position="sheet-bottom" />,
});

export const Fullscreen = meta.story({
  render: () => <BasicDialog position="fullscreen" />,
});

export const Controlled = meta.story({
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", gap: 12 }}>
        <Button onClick={() => setOpen(true)}>Open externally</Button>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup position="center">
              <Dialog.Header>
                <Dialog.Title>Controlled</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p style={{ margin: 0 }}>State owned by the parent component.</p>
              </Dialog.Body>
              <Dialog.Footer>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    );
  },
});

export const NonDismissible = meta.story({
  render: () => (
    <Dialog.Root disablePointerDismissal>
      <Dialog.Trigger render={<Button variant="danger">Delete item</Button>} />
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup position="center">
          <Dialog.Header>
            <Dialog.Title>Delete this item?</Dialog.Title>
            <Dialog.Description>
              Outside-click dismissal is disabled — user must use a button.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="ghost">Cancel</Button>} />
            <Dialog.Close render={<Button variant="danger">Delete</Button>} />
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ),
});
