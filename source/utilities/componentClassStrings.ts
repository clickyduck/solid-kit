/** Tailwind class strings shared across components that are not size-dependent. */

export type IconPosition = "start" | "end";

/**
 * Shared animation tokens. Keep all motion in the library on these two tiers so
 * hover/focus feedback feels identical everywhere.
 *
 * - `INTERACTIVE_TRANSITION_DURATION` (100ms): hover/active/color/opacity/border
 *   feedback on interactive elements. Snappy and consistent across buttons,
 *   inputs, menu items, table rows, toggles, etc.
 * - `LAYOUT_TRANSITION_DURATION` (200ms): larger structural movement — sliding
 *   panels/drawers, width changes, accordion chevrons. Slightly slower reads
 *   better for bigger movement.
 *
 * Easing is unified to `ease-out` so the timing curve also matches.
 */
export const INTERACTIVE_TRANSITION_DURATION = "duration-100";
export const LAYOUT_TRANSITION_DURATION = "duration-200";
export const TRANSITION_EASING = "ease-out";

/** Muted inline icons (leading search, decorative) with balanced contrast in light and dark. */
export const CHROME_MUTED_ICON_CLASSES = "text-gray-400 dark:text-gray-500";

/** Floating menus and popovers. */
export const DROPDOWN_MENU_SURFACE_CLASSES = "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/30";

// Badge leading icon: sized to `text-xs` row; `align-middle` keeps inline alignment with adjacent text.
export const BADGE_ICON_CLASSES = "size-3.5 shrink-0 align-middle pointer-events-none text-current";

// Table
// Rows share one height (h-10, 40px — matching inputs/buttons/dropdown triggers). On a table cell `height`
// behaves as a minimum, and `align-middle` centers the content, so a single-line row sits at exactly 40px while
// a taller cell (a wrapped value, a control inside a cell) can still grow past it. A small symmetric `py` keeps
// such grown content padded; it does not affect the 40px single-line height.
export const TABLE_BODY_TEXT_CLASSES = "text-sm";
export const TABLE_HEADER_LABEL_CLASSES = "text-xs";
export const TABLE_HEAD_CELL_CLASSES = "h-10 align-middle px-6 py-1.5";
export const TABLE_DATA_CELL_CLASSES = "h-10 align-middle px-6 py-1.5";
export const TABLE_PAGINATION_BAR_CLASSES = "px-6 py-2";
