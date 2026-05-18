/** Tailwind class strings shared across components that are not size-dependent. */

export type IconPosition = "start" | "end";

/** Muted inline icons (leading search, decorative) with balanced contrast in light and dark. */
export const CHROME_MUTED_ICON_CLASSES = "text-gray-400 dark:text-gray-500";

/** Floating menus and popovers. */
export const DROPDOWN_MENU_SURFACE_CLASSES = "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/30";

// Badge leading icon: sized to `text-xs` row; `align-middle` keeps inline alignment with adjacent text.
export const BADGE_ICON_CLASSES = "size-3.5 shrink-0 align-middle pointer-events-none text-current";

// Table
export const TABLE_BODY_TEXT_CLASSES = "text-sm";
export const TABLE_HEADER_LABEL_CLASSES = "text-xs";
export const TABLE_HEAD_CELL_CLASSES = "align-middle px-6 py-3.5";
export const TABLE_DATA_CELL_CLASSES = "align-middle px-6 py-1.5";
export const TABLE_PAGINATION_BAR_CLASSES = "px-6 py-2";
