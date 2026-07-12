export type TextColor = "default" | "inherit" | "muted" | "primary" | "secondary" | "success" | "warning" | "danger" | "info";
export type TextWeight = "thin" | "normal" | "medium" | "semibold" | "bold";
export type TextSize = "display" | "title" | "heading" | "body" | "small" | "caption";
export type TextAlign = "start" | "center" | "end";
export type TextTransform = "none" | "uppercase" | "capitalize";
export type TextDisplay = "flex" | "block" | "inline";

// Neutral text emphasis ladder, tuned for high readability in both themes while keeping visible steps between
// tiers. `default` is the strongest (near-black / near-white) and is the only tier that reaches the palette
// extremes — headings, body copy, and control values. `secondary` and `muted` sit one and two steps softer but
// are deliberately kept high-contrast (gray-800/700 light, gray-200/300 dark) so de-emphasized text stays easy
// to read rather than fading toward the background. Semantic hues run at -700 (light) / -300 (dark): dark shades
// are one step brighter than a mid accent so colored text reads clearly on the near-black surface.
export const COLOR_CLASSES: Record<TextColor, string> = {
  inherit: "",
  default: "text-gray-900 dark:text-gray-100",
  muted: "text-gray-700 dark:text-gray-300",
  primary: "text-blue-700 dark:text-blue-300",
  secondary: "text-gray-800 dark:text-gray-200",
  success: "text-emerald-700 dark:text-emerald-300",
  warning: "text-amber-800 dark:text-amber-300",
  danger: "text-red-700 dark:text-red-300",
  info: "text-sky-700 dark:text-sky-300"
};

export const WEIGHT_CLASSES: Record<TextWeight, string> = {
  thin: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold"
};

export type SizeConfig = { textClass: string; gapClass: string; iconSize: number; defaultWeight: TextWeight };

// The three heading-tier sizes step down one notch on mobile and up at `md` (≥768px): large type that reads
// well on a wide canvas overflows and wraps awkwardly on a phone, so it's the only place responsive sizing earns
// its keep. The body tier (`body`/`small`/`caption`) is deliberately flat across breakpoints — reading distance
// to a phone is the same or closer than to a monitor, so shrinking body copy on mobile only hurts legibility
// (and dropping an input below 16px triggers iOS focus-zoom). `iconSize` tracks the desktop (larger) step so the
// inline glyph stays matched to the text at the size the tier is named for.
export const SIZE_CONFIG: Record<TextSize, SizeConfig> = {
  display: { textClass: "text-3xl md:text-4xl tracking-tight", gapClass: "gap-5", iconSize: 36, defaultWeight: "bold" },
  title: { textClass: "text-xl md:text-2xl tracking-tight", gapClass: "gap-3.5", iconSize: 24, defaultWeight: "semibold" },
  heading: { textClass: "text-base md:text-lg tracking-tight", gapClass: "gap-2.5", iconSize: 20, defaultWeight: "semibold" },
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

// Inline icons in a Text row sit just slightly under the text weight so a leading/trailing glyph reads as
// supporting the label rather than competing with it — but only a touch (opacity-90), so the icon stays clearly
// legible rather than fading. (Was opacity-70, which dimmed inline icons enough to hurt readability.)
export const TYPOGRAPHY_ICON_CLASSES = "align-middle opacity-90 [&_svg]:fill-current";

/** Truncates string children with `…` at `maxLength`. Non-string children pass through unchanged. */
export const truncateTextChildren = <T,>(children: T, maxLength: number | undefined): T => {
  if (maxLength !== undefined && typeof children === "string" && children.length > maxLength) {
    return (children.slice(0, maxLength) + "…") as unknown as T;
  }
  return children;
};
