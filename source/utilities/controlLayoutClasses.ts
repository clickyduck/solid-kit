/**
 * Shared Tailwind class strings for interactive controls. Small viewports use a
 * roomier scale; from the md breakpoint upward the layout matches the desktop kit.
 */

/** Padding and text size for buttons, text inputs, textarea, dropdown built-in search fields, upload label. */
export const CLICKABLE_COMPONENT_PADDING = "px-5 py-2.5 text-base md:px-4 md:py-2 md:text-sm";

/** Padding for square icon-only buttons and similar compact targets. */
export const ICON_ONLY_BUTTON_PADDING = "p-2.5 md:p-2";

/** Inline-end padding on a leading (start) icon — space toward adjacent label or field text. Pairs with `INLINE_ICON_WITHIN_CLICKABLE_CLASS` in `./icon`. */
export const INLINE_ICON_START_PADDING_CLASS = "pe-1.5 md:pe-1";

/** Inline-start padding on a trailing (end) icon — space toward preceding label or content. Pairs with `INLINE_ICON_WITHIN_CLICKABLE_CLASS` in `./icon`. */
export const INLINE_ICON_END_PADDING_CLASS = "ps-1.5 md:ps-1";

/** Primary label or row text beside controls (checkbox label, option rows, empty states). */
export const PRIMARY_LABEL_TEXT_CLASS = "text-base md:text-sm";

/** Minimum height for a single checkbox row. */
export const SINGLE_CHECKBOX_ROW_MINIMUM_HEIGHT_CLASS = "min-h-11 md:min-h-9";

/** Padding for each row in the Checkboxes list. */
export const CHECKBOX_LIST_ROW_PADDING_CLASS = "px-4 py-2 md:px-3 md:py-1.5";

/** Reserved square for the trailing checkmark in multi-select checkbox rows. */
export const CHECKBOX_LIST_END_ICON_WRAPPER_CLASS = "h-7 w-7 md:h-6 md:w-6";

/** Textarea inner padding and type scale (aligned with Input, relaxed line height). */
export const TEXT_BLOCK_CONTROL_PADDING_CLASS = "px-5 py-2.5 text-base leading-relaxed md:px-4 md:py-2 md:text-sm md:leading-relaxed";

/** Status pill padding and type scale. */
export const STATUS_PILL_SURFACE_CLASS = "px-3 py-1 text-sm md:px-2.5 md:py-1 md:text-xs";

/** Leading dot dimensions inside Status. */
export const STATUS_DOT_DIMENSION_CLASS = "h-2.5 w-2.5 md:h-2 md:w-2";

/** Dropdown built-in and composition menu item anchor row. */
export const DROPDOWN_MENU_ITEM_ROW_CLASS = "flex items-center gap-2 px-5 py-2.5 text-base text-gray-300 transition-colors hover:bg-gray-700 hover:text-white md:px-4 md:py-2 md:text-sm";

/** Vertical padding for ul list chrome in dropdown menus. */
export const DROPDOWN_MENU_LIST_VERTICAL_PADDING_CLASS = "py-1.5 md:py-1";

/** Padding around custom dropdown panel regions (DropdownContent fallback wrapper). */
export const DROPDOWN_MENU_PANEL_PADDING_CLASS = "px-5 py-4 md:px-4 md:py-3";

/** Region around the built-in searchable dropdown filter field. */
export const DROPDOWN_MENU_SEARCH_REGION_PADDING_CLASS = "border-b border-gray-700 px-3 py-3 md:py-2";

/** Minimum width for dropdown menu panels. */
export const DROPDOWN_SURFACE_MINIMUM_WIDTH_CLASS = "min-w-[200px] md:min-w-[160px]";

/** Input with a leading icon: horizontal inset for the text field. */
export const FORM_CONTROL_LEADING_ICON_INPUT_CLASS = "pl-9";

/** Absolute leading icon column inset from the control edge. */
export const FORM_CONTROL_LEADING_ICON_WRAPPER_CLASS = "pl-3";

/** Table body copy and pagination secondary text. */
export const TABLE_BODY_TEXT_CLASS = "text-base md:text-sm";

/** Table header row uppercase labels. */
export const TABLE_HEADER_LABEL_TEXT_CLASS = "text-sm md:text-xs";

/** Table head cell padding. */
export const TABLE_HEAD_CELL_PADDING_CLASS = "px-5 py-4 md:px-6 md:py-5";

/** Table body cell padding. */
export const TABLE_DATA_CELL_PADDING_CLASS = "px-5 py-4 md:px-6 md:py-4";

/** Table pagination bar padding. */
export const TABLE_PAGINATION_BAR_PADDING_CLASS = "px-5 py-3 md:px-6 md:py-2";
