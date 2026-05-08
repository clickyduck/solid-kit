/**
 * Returns the nearest open <dialog> ancestor so dropdown portals render inside
 * the top layer and appear above the modal backdrop. Falls back to document.body.
 * Must be called at open-time (not at component render time) so the dialog is open.
 */
export const getPortalMount = (element: Element | null | undefined): HTMLElement => {
  const dialog = element?.closest("dialog");
  if (dialog instanceof HTMLDialogElement && dialog.open) {
    return dialog;
  }
  return document.body;
};
