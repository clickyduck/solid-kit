export const FORM_CONTROL_SIZE_CLASSES = "h-10 px-3 text-sm";

/**
 * A control's `flush` setting: `true` squares the corners at every width, `"mobile"` only below the
 * `md` breakpoint (rounded on desktop, square on phone), and `undefined`/`false` leaves the default
 * rounding. Mirrors DataCard's `flush` so the whole kit speaks one vocabulary.
 */
export type FlushControlBreakpoint = boolean | "mobile";

/**
 * Corner-rounding override for a `flush` form control (Button, IconButton, Input, DropdownTrigger).
 * `flush` lets a control sit edge-to-edge — flush against the viewport edges or a neighbouring
 * control — instead of as a rounded island, which reclaims space on a narrow phone. It only drops
 * the rounding; spanning the full width stays the consumer's concern (`w-full`, or the control's own
 * default). `mergeClasses` places the result after the base `rounded-*` so it wins the conflict.
 */
export const flushControlRadiusClasses = (flush: FlushControlBreakpoint | undefined): string => {
  if (flush === true) {
    return "rounded-none";
  }
  if (flush === "mobile") {
    return "max-md:rounded-none";
  }
  return "";
};

export const FORM_CONTROL_TEXTAREA_SIZE_CLASSES = "min-h-10 px-3 py-2 text-sm";

export const FORM_CONTROL_ICON_SIZE = 18;

export const FORM_CONTROL_LEADING_ICON_WRAPPER_CLASS = "pl-3";

export const FORM_CONTROL_LEADING_ICON_INPUT_CLASS = "pl-[38px]";

export const FORM_CONTROL_ICON_BUTTON_SIZE_CLASSES = "h-10 w-10 p-0 text-sm";

export const FORM_CONTROL_TEXTAREA_LINE_HEIGHT_REM = 1.25;

// Label sits at the `secondary` emphasis level (gray-800/200) so field labels read clearly without competing
// with the primary value text. Hint/auxiliary text sits at `muted` (gray-700/300) — one step softer than the
// label but still high-contrast, matching the Text `muted` tier so supporting copy is consistent everywhere.
export const FORM_CONTROL_LABEL_CLASS = "block text-sm text-gray-800 dark:text-gray-200";

export const FORM_CONTROL_HINT_CLASS = "mt-2 text-xs text-gray-700 dark:text-gray-300";

export const FORM_CONTROL_AUXILIARY_TEXT_CLASS = "text-xs text-gray-700 dark:text-gray-300";

export const FORM_CONTROL_LINK_ACCENT_TEXT_CLASS = "text-xs text-blue-600 transition-colors duration-100 ease-out hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300";

export const FORM_CONTROL_DROP_DOWN_MENU_PANEL_CLASS_BY_SIZE = "max-h-60 overflow-auto p-1.5 text-sm text-gray-900 dark:text-gray-100";

export const FORM_CONTROL_DROP_DOWN_MENU_LIST_CLASS_BY_SIZE = "max-h-60 space-y-1 overflow-auto p-1.5 text-sm text-gray-900 dark:text-gray-100";

export const FORM_CONTROL_DROP_DOWN_MENU_ITEM_CLASS_BY_SIZE =
  "inline-flex min-h-10 w-full items-center rounded-lg px-3 py-2 text-left transition-colors duration-100 ease-out hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700/50 dark:hover:text-gray-100 focus:outline-none";

export const FORM_CONTROL_DROP_DOWN_MENU_SEARCH_WRAPPER_CLASS_BY_SIZE = "sticky top-0 border-b border-gray-200 bg-white p-1.5 dark:border-gray-700 dark:bg-gray-800";

export const FORM_CONTROL_DROP_DOWN_CONTENT_MIN_WIDTH_CLASS_BY_SIZE = "min-w-[160px]";
