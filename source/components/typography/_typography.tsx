export type TextColor = "default" | "inherit" | "muted" | "primary" | "secondary" | "success" | "warning" | "danger" | "info";
export type TextWeight = "thin" | "normal" | "medium" | "semibold" | "bold";
export type TextSize = "display" | "title" | "heading" | "body" | "small" | "caption";
export type TextAlign = "start" | "center" | "end";
export type TextTransform = "none" | "uppercase" | "capitalize";
export type TextDisplay = "flex" | "block" | "inline";

export const COLOR_CLASSES: Record<TextColor, string> = {
  inherit: "",
  default: "text-gray-900 dark:text-gray-100",
  muted: "text-gray-600 dark:text-gray-400",
  primary: "text-blue-700 dark:text-blue-400",
  secondary: "text-gray-700 dark:text-gray-300",
  success: "text-emerald-700 dark:text-emerald-400",
  warning: "text-amber-800 dark:text-amber-400",
  danger: "text-red-700 dark:text-red-400",
  info: "text-sky-700 dark:text-sky-400"
};

export const WEIGHT_CLASSES: Record<TextWeight, string> = {
  thin: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold"
};

export type SizeConfig = { textClass: string; gapClass: string; iconSize: number; defaultWeight: TextWeight };

export const SIZE_CONFIG: Record<TextSize, SizeConfig> = {
  display: { textClass: "text-4xl tracking-tight", gapClass: "gap-5", iconSize: 36, defaultWeight: "bold" },
  title: { textClass: "text-2xl tracking-tight", gapClass: "gap-3.5", iconSize: 24, defaultWeight: "semibold" },
  heading: { textClass: "text-lg tracking-tight", gapClass: "gap-2.5", iconSize: 20, defaultWeight: "semibold" },
  body: { textClass: "text-base", gapClass: "gap-2", iconSize: 16, defaultWeight: "normal" },
  small: { textClass: "text-sm", gapClass: "gap-2", iconSize: 14, defaultWeight: "normal" },
  caption: { textClass: "text-xs", gapClass: "gap-1.5", iconSize: 12, defaultWeight: "normal" }
};

export const ALIGN_CLASSES: Record<TextAlign, string> = {
  start: "text-left justify-start",
  center: "text-center justify-center",
  end: "text-right justify-end"
};

export const TRANSFORM_CLASSES: Record<TextTransform, string> = {
  none: "",
  uppercase: "uppercase tracking-wide",
  capitalize: "capitalize"
};

export const DISPLAY_CLASSES: Record<TextDisplay, string> = {
  flex: "flex items-center",
  block: "block",
  inline: "inline-flex items-center"
};

export const TYPOGRAPHY_ICON_CLASSES = "align-middle opacity-70 [&_svg]:fill-current";

/** Truncates string children with `…` at `maxLength`. Non-string children pass through unchanged. */
export const truncateTextChildren = <T,>(children: T, maxLength: number | undefined): T => {
  if (maxLength !== undefined && typeof children === "string" && children.length > maxLength) {
    return (children.slice(0, maxLength) + "…") as unknown as T;
  }
  return children;
};
