/** Tailwind class strings shared across components (buttons, inputs, tables, and similar). */

export type IconPosition = "start" | "end";

/**
 * Muted inline icons (leading search, decorative) with balanced contrast in light and dark.
 */
export const CHROME_MUTED_ICON_CLASSES = "text-gray-400 dark:text-gray-500";

/**
 * Floating menus and popovers: light panel by default, dark panel when `html.dark`.
 */
export const DROPDOWN_MENU_SURFACE_CLASSES = "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800";

// Button
export const BUTTON_CLASSES = "px-4 py-2.5 text-sm";
export const BUTTON_LEADING_ICON_CLASSES = "size-5 pe-1 pointer-events-none shrink-0 text-current";
export const BUTTON_TRAILING_ICON_CLASSES = "size-5 ps-1 pointer-events-none ml-auto shrink-0 text-current";

// IconButton
export const ICON_BUTTON_CLASSES = "p-2.5";
export const ICON_BUTTON_ICON_CLASSES = "size-5 pointer-events-none shrink-0 text-current";

// Badge
export const BADGE_ICON_CLASSES = "size-5 pointer-events-none shrink-0 text-current";

// Input
export const INPUT_CLASSES = "px-4 py-2.5 text-sm";
export const INPUT_LEADING_ICON_WRAPPER_CLASSES = "pl-3";
export const INPUT_LEADING_ICON_CLASSES = `size-5 pe-1 pointer-events-none shrink-0 ${CHROME_MUTED_ICON_CLASSES}`;
export const INPUT_WITH_LEADING_ICON_CLASSES = "pl-10";
export const INPUT_TRAILING_TEXT_CLASSES = "text-sm";

// Textarea
export const TEXTAREA_CLASSES = "px-4 py-2.5 text-sm leading-relaxed";

// ToggleGroup — outlined card aligned with Input/Button (`rounded-lg`); native input is `sr-only`; no fill. `.choice-control-face` / `.choice-control-check` use `has-[:checked]:` on the label.
export const CHOICE_CONTROL_LABEL_CLASS = "block w-full cursor-pointer has-[input:disabled]:cursor-not-allowed";
export const CHOICE_CONTROL_LABEL_HAS_INTERACTION_CLASSES =
  "has-[:checked]:[&_.choice-control-face]:border-blue-500 dark:has-[:checked]:[&_.choice-control-face]:border-blue-400 has-[input:focus-visible]:[&_.choice-control-face]:border-blue-500 dark:has-[input:focus-visible]:[&_.choice-control-face]:border-blue-400 has-[:checked]:[&_.choice-control-check]:opacity-100 has-[:checked]:[&_.choice-control-check]:scale-100";
export const CHOICE_CONTROL_FACE_CLASS = "choice-control-face flex min-h-[3.25rem] w-full min-w-0 items-center gap-3 rounded-lg border border-solid border-gray-300 px-4 py-2.5 text-left transition-[border-color,box-shadow] dark:border-gray-700";
export const CHOICE_CONTROL_FACE_DISABLED_CLASS = "has-[input:disabled]:[&_.choice-control-face]:opacity-50";
export const CHOICE_CONTROL_TITLE_CLASS = "text-sm font-semibold text-gray-900 dark:text-gray-100";
export const CHOICE_CONTROL_DESCRIPTION_CLASS = "text-sm font-normal leading-snug text-gray-600 dark:text-gray-400";
export const CHOICE_CONTROL_CHECK_CLASS = "choice-control-check size-5 shrink-0 text-blue-600 opacity-0 scale-90 transition-[opacity,transform] duration-150 ease-out dark:text-blue-400";

// Dropdown
export const DROPDOWN_TRIGGER_VALUE_CLASSES = "text-sm";
export const DROPDOWN_TRIGGER_ICON_CLASSES = "size-5 pe-1 pointer-events-none shrink-0 text-current";
export const DROPDOWN_SEARCH_CLASSES = "px-4 py-2.5 text-sm";
export const DROPDOWN_SEARCH_ICON_WRAPPER_CLASSES = "pl-3";
export const DROPDOWN_SEARCH_ICON_CLASSES = `size-5 pe-1 pointer-events-none shrink-0 ${CHROME_MUTED_ICON_CLASSES}`;
export const DROPDOWN_SEARCH_WITH_ICON_CLASSES = "pl-10";
export const DROPDOWN_MENU_ITEM_CLASSES = "flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white";
export const DROPDOWN_MENU_LIST_CLASSES = "py-1 px-1 space-y-1";
export const DROPDOWN_MENU_PANEL_CLASSES = "px-4 py-3";
export const DROPDOWN_SEARCH_REGION_CLASSES = "border-b border-gray-200 px-3 py-2 dark:border-gray-700";
export const DROPDOWN_SURFACE_CLASSES = "min-w-[160px]";

// Table
export const TABLE_BODY_TEXT_CLASSES = "text-sm";
export const TABLE_HEADER_LABEL_CLASSES = "text-xs";
export const TABLE_HEAD_CELL_CLASSES = "px-6 py-5";
export const TABLE_DATA_CELL_CLASSES = "px-6 py-4";
export const TABLE_PAGINATION_BAR_CLASSES = "px-6 py-2";

// Upload
export const UPLOAD_CLASSES = "px-4 py-2.5 text-sm";
export const UPLOAD_ICON_CLASSES = "size-5 pe-1";
export const UPLOAD_LABEL_CLASSES = "text-sm";
export const UPLOAD_LINK_CLASSES = "text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300";
