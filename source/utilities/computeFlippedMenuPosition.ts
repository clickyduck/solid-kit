/**
 * Computes the fixed-position top/left for a popup anchored to a trigger,
 * flipping it upward and/or leftward when it would otherwise overflow the
 * viewport. Shared by Dropdown and DatePicker so both behave consistently.
 *
 * `menuElement` must already be in the DOM (visible or visibility:hidden) so its
 * offsetHeight/offsetWidth can be measured before positioning.
 */
export const VIEWPORT_EDGE_GAP_PIXELS = 4;

export const computeFlippedMenuPosition = (triggerRectangle: DOMRect, menuElement: HTMLElement): { top: number; left: number } => {
  const menuHeight = menuElement.offsetHeight;
  const menuWidth = menuElement.offsetWidth;
  const spaceBelow = window.innerHeight - triggerRectangle.bottom;
  const spaceAbove = triggerRectangle.top;
  const spaceRight = window.innerWidth - triggerRectangle.left;

  const openUpward = spaceBelow < menuHeight + VIEWPORT_EDGE_GAP_PIXELS && spaceAbove > spaceBelow;
  const openLeftward = spaceRight < menuWidth + VIEWPORT_EDGE_GAP_PIXELS;

  const top = openUpward ? triggerRectangle.top - menuHeight - VIEWPORT_EDGE_GAP_PIXELS : triggerRectangle.bottom + VIEWPORT_EDGE_GAP_PIXELS;
  const left = openLeftward ? triggerRectangle.right - menuWidth : triggerRectangle.left;
  return { top, left };
};
