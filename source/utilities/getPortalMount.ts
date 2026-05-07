/**
 * Returns the nearest ancestor <dialog> element if one exists and is open (top-layer),
 * otherwise returns document.body. Portaling into the dialog keeps the popup inside
 * the native top-layer stacking context so it renders above the backdrop.
 */
export const getPortalMount = (element: Element | null | undefined): HTMLElement => {
  const dialog = element?.closest("dialog");
  if (dialog instanceof HTMLDialogElement && dialog.open) {
    return dialog;
  }
  return document.body;
};
