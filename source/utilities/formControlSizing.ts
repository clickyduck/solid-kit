import type { Accessor } from "solid-js";

import { useIsMobile } from "./useIsMobile";

export type FormControlSize = "default" | "large";

/** Height, padding, and text size for all single-line controls (Input, Button, Upload, Dropdown trigger). */
export const FORM_CONTROL_SIZE_CLASSES: Record<FormControlSize, string> = {
  default: "h-8 min-h-8 px-2.5 py-1.5 text-sm",
  large: "h-9 min-h-9 px-3 py-2 text-sm"
};

/** Padding and text size for Textarea (no fixed height). */
export const FORM_CONTROL_TEXTAREA_SIZE_CLASSES: Record<FormControlSize, string> = {
  default: "min-h-8 px-2.5 py-1.5 text-sm",
  large: "min-h-9 px-3 py-2 text-sm"
};

/** Icon pixel dimensions that scale with control size. */
export const FORM_CONTROL_ICON_SIZE: Record<FormControlSize, number> = {
  default: 14,
  large: 16
};

/** Square icon wrapper dimensions (e.g. checkbox icon containers). */
export const FORM_CONTROL_ICON_WRAPPER_SIZE_CLASSES: Record<FormControlSize, string> = {
  default: "h-4.5 w-4.5",
  large: "h-5 w-5"
};

/** Left padding offset for the input when a leading icon wrapper sits inside it. */
export const FORM_CONTROL_LEADING_ICON_WRAPPER_CLASS = "pl-3";

/** Left padding that pushes input text past the leading icon. */
export const FORM_CONTROL_LEADING_ICON_INPUT_CLASS = "pl-10";

export const FORM_CONTROL_TEXT_CLASS_BY_SIZE: Record<FormControlSize, string> = {
  default: "text-sm",
  large: "text-sm"
};

export const FORM_CONTROL_ROW_MIN_HEIGHT_CLASS_BY_SIZE: Record<FormControlSize, string> = {
  default: "min-h-8",
  large: "min-h-9"
};

export const FORM_CONTROL_PADDED_ROW_CLASSES_BY_SIZE: Record<FormControlSize, string> = {
  default: "px-2.5 py-1.5",
  large: "px-3 py-2"
};

/**
 * ToggleGroup option card: same minimum block height and horizontal padding as Button/Input. Rows with a
 * description line grow past this minimum.
 */
export const FORM_CONTROL_CHOICE_FACE_SIZE_CLASSES_BY_SIZE: Record<FormControlSize, string> = {
  default: "min-h-8 gap-2.5 px-2.5 py-1.5",
  large: "min-h-9 gap-3 px-3 py-2"
};

/** Square icon-only button — height/width match FORM_CONTROL_SIZE_CLASSES, no inner padding. */
export const FORM_CONTROL_ICON_BUTTON_SIZE_CLASSES: Record<FormControlSize, string> = {
  default: "h-8 min-h-8 w-8 min-w-8 p-0 text-sm",
  large: "h-9 min-h-9 w-9 min-w-9 p-0 text-sm"
};

/** Used by Textarea auto-grow to compute row heights in JavaScript. */
export const FORM_CONTROL_TEXTAREA_LINE_HEIGHT_REM = 1.25;

export const FORM_CONTROL_LABEL_CLASS = "block text-sm font-medium text-gray-700 dark:text-gray-300";

export const FORM_CONTROL_HINT_CLASS = "mt-2 text-xs text-gray-500 dark:text-gray-400";

export const FORM_CONTROL_AUXILIARY_TEXT_CLASS = "text-xs text-gray-500 dark:text-gray-400";

export const FORM_CONTROL_LINK_ACCENT_TEXT_CLASS = "text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300";

export const FORM_CONTROL_FEEDBACK_CONTAINER_CLASSES_BY_SIZE: Record<FormControlSize, string> = {
  default: "px-4 py-2.5 text-sm",
  large: "px-4 py-3 text-sm"
};

export const FORM_CONTROL_OPTION_ROW_CONTAINER_CLASSES_BY_SIZE: Record<FormControlSize, string> = {
  default: "gap-3 rounded-lg p-2.5",
  large: "gap-3 rounded-lg p-3"
};

export const FORM_CONTROL_INLINE_CHECKBOX_MARGIN_TOP_BY_SIZE: Record<FormControlSize, string> = {
  default: "mt-0.5",
  large: "mt-1"
};

export const FORM_CONTROL_INLINE_CHECKBOX_INPUT_CLASS = "h-4 w-4 rounded border-gray-300 bg-white text-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-900";

export const FORM_CONTROL_CHECKBOX_INPUT_CLASS =
  "h-4 w-4 rounded border-gray-300 bg-white text-blue-500 transition-colors duration-150 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-900";

export const FORM_CONTROL_EMBEDDED_ICON_BUTTON_BOX_CLASS = "h-7 min-h-0 w-7 min-w-0 shrink-0 rounded-full p-0";

export const FORM_CONTROL_STATUS_BADGE_SIZE_CLASSES: Record<FormControlSize, string> = {
  default: "px-2.5 py-0.5 text-xs",
  large: "px-3 py-1 text-sm"
};

export const FORM_CONTROL_STATUS_BADGE_DOT_SIZE_CLASSES: Record<FormControlSize, string> = {
  default: "h-1.5 w-1.5",
  large: "h-2 w-2"
};

export const FORM_CONTROL_DROP_DOWN_MENU_PANEL_CLASS_BY_SIZE: Record<FormControlSize, string> = {
  default: "max-h-60 overflow-auto p-1.5 text-sm font-medium text-gray-700 dark:text-white",
  large: "max-h-72 overflow-auto p-2 text-sm font-medium text-gray-700 dark:text-white"
};

export const FORM_CONTROL_DROP_DOWN_MENU_LIST_CLASS_BY_SIZE: Record<FormControlSize, string> = {
  default: "max-h-60 space-y-1 overflow-auto p-1.5 text-sm font-medium text-gray-700 dark:text-white",
  large: "max-h-72 space-y-1.5 overflow-auto p-2 text-sm font-medium text-gray-700 dark:text-white"
};

export const FORM_CONTROL_DROP_DOWN_MENU_ITEM_ANCHOR_CLASS_BY_SIZE: Record<FormControlSize, string> = {
  default: "inline-flex w-full items-center rounded-lg px-2.5 py-1.5 text-left transition-colors duration-100 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700/60 dark:hover:text-white focus:outline-none",
  large: "inline-flex w-full items-center rounded-lg px-3 py-2 text-left transition-colors duration-100 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700/60 dark:hover:text-white focus:outline-none"
};

export const FORM_CONTROL_DROP_DOWN_MENU_SEARCH_WRAPPER_CLASS_BY_SIZE: Record<FormControlSize, string> = {
  default: "sticky top-0 border-b border-gray-200 bg-white p-1.5 dark:border-gray-700 dark:bg-gray-800",
  large: "sticky top-0 border-b border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800"
};

export const FORM_CONTROL_DROP_DOWN_CONTENT_MIN_WIDTH_CLASS_BY_SIZE: Record<FormControlSize, string> = {
  default: "min-w-[160px]",
  large: "min-w-[200px]"
};

/**
 * Control scale from viewport only: larger touch targets on viewports at most 767px wide; no per-component size override.
 */
export const useEffectiveFormControlSize = (): Accessor<FormControlSize> => {
  const isMobile = useIsMobile();
  return () => (isMobile() ? "large" : "default");
};
