/**
 * Scrollbar appearance for overflow regions so they match the active light or dark scheme in WebKit, Chromium, and Firefox. Use with `overflow-auto` (or `overflow-y-auto` and `overflow-x-hidden`) and `min-h-0` inside flex layouts. The `html` element should carry a `light` or `dark` `color-scheme` and the matching `class` (for example `dark` on `documentElement`) for native controls to align.
 */
export const themedScrollControlClassName: string = [
  "[scrollbar-width:thin]",
  // Firefox takes raw colors, so these mirror the neutral gray-300 / gray-500 values from theme.css.
  "[scrollbar-color:rgb(212_212_212/0.95)_transparent] dark:[scrollbar-color:rgb(115_115_115/0.9)_transparent]",
  "[&::-webkit-scrollbar]:w-2",
  "[&::-webkit-scrollbar]:h-2",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb]:bg-gray-300/90",
  "[&::-webkit-scrollbar-thumb]:hover:bg-gray-400/80",
  "dark:[&::-webkit-scrollbar-thumb]:bg-gray-500/80",
  "dark:[&::-webkit-scrollbar-thumb]:hover:bg-gray-400/75",
  "[&::-webkit-scrollbar-corner]:bg-transparent"
].join(" ");
