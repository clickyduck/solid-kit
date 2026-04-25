/** Tailwind class strings shared across components that are not size-dependent. */

export type IconPosition = "start" | "end";

/** Muted inline icons (leading search, decorative) with balanced contrast in light and dark. */
export const CHROME_MUTED_ICON_CLASSES = "text-gray-400 dark:text-gray-500";

/** Floating menus and popovers. */
export const DROPDOWN_MENU_SURFACE_CLASSES = "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800";

// Badge leading icon: sized to `text-xs` row; `align-middle` keeps inline alignment with adjacent text.
export const BADGE_ICON_CLASSES = "size-3.5 shrink-0 align-middle pointer-events-none text-current";

// ToggleGroup — outlined card (`rounded-lg`); size (min height, padding, check icon) comes from `formControlSizing`. Native input is `sr-only`. `.choice-control-face` / `.choice-control-check` use `has-[:checked]:` on the label.
export const CHOICE_CONTROL_LABEL_CLASS = "block w-full cursor-pointer has-[input:disabled]:cursor-not-allowed";
export const CHOICE_CONTROL_LABEL_HAS_INTERACTION_CLASSES =
  "has-[:checked]:[&_.choice-control-face]:border-blue-500 dark:has-[:checked]:[&_.choice-control-face]:border-blue-400 has-[input:focus-visible]:[&_.choice-control-face]:border-blue-500 dark:has-[input:focus-visible]:[&_.choice-control-face]:border-blue-400 has-[:checked]:[&_.choice-control-check]:opacity-100 has-[:checked]:[&_.choice-control-check]:scale-100";
export const CHOICE_CONTROL_FACE_CLASS = "choice-control-face flex w-full min-w-0 items-center rounded-lg border border-solid border-gray-300 text-left transition-[border-color,box-shadow] dark:border-gray-700";
export const CHOICE_CONTROL_FACE_DISABLED_CLASS = "has-[input:disabled]:[&_.choice-control-face]:opacity-50";
export const CHOICE_CONTROL_TITLE_CLASS = "text-sm font-semibold text-gray-900 dark:text-gray-100";
export const CHOICE_CONTROL_DESCRIPTION_CLASS = "text-sm font-normal leading-snug text-gray-600 dark:text-gray-400";
export const CHOICE_CONTROL_CHECK_CLASS = "choice-control-check shrink-0 text-blue-600 opacity-0 scale-90 transition-[opacity,transform] duration-150 ease-out dark:text-blue-400";

// Table
export const TABLE_BODY_TEXT_CLASSES = "text-sm";
export const TABLE_HEADER_LABEL_CLASSES = "text-xs";
export const TABLE_HEAD_CELL_CLASSES = "align-middle px-6 py-5";
export const TABLE_DATA_CELL_CLASSES = "align-middle px-6 py-4";
export const TABLE_PAGINATION_BAR_CLASSES = "px-6 py-2";
