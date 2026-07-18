/** Tailwind class strings shared across components that are not size-dependent. */

export type IconPosition = "start" | "end";

/**
 * Shared animation tokens. Keep all motion in the library on these tiers so the
 * whole system feels like it moves at one speed. Pick by *what* is moving:
 *
 * - `INTERACTIVE_TRANSITION_DURATION` (100ms): hover/active/color/border feedback
 *   on interactive elements. Snappy and consistent across buttons, inputs, menu
 *   items, table rows, toggle backgrounds, etc. This is a *state recolor*, not an
 *   element appearing.
 * - `REVEAL_TRANSITION_DURATION` (150ms): content appearing/disappearing in place
 *   — opacity/scale fades of popovers (Dropdown, DatePicker), selection indicators
 *   (toggle checks/dots), and list items (Upload rows, ArrayInput chips). Sits
 *   deliberately between interactive feedback and layout movement.
 * - `LAYOUT_TRANSITION_DURATION` (200ms): larger structural movement — sliding
 *   panels/drawers, width changes, accordion expand/collapse and its chevron.
 *   Slightly slower reads better for bigger movement.
 *
 * One deliberate exception sits outside these tiers: a toast slides its full
 * width/height across a screen edge, a longer traversal than any in-place reveal,
 * so it uses 300ms (documented locally in Toast.tsx).
 *
 * Easing is unified to `ease-out` (`TRANSITION_EASING`) so the timing curve also
 * matches. These name the canonical durations; components apply the matching
 * `duration-*` / `ease-out` classes inline. When adding a transition, pick the
 * tier by the rule above rather than typing a fresh `duration-*`.
 */
export const INTERACTIVE_TRANSITION_DURATION = "duration-100";
export const REVEAL_TRANSITION_DURATION = "duration-150";
export const LAYOUT_TRANSITION_DURATION = "duration-200";
export const TRANSITION_EASING = "ease-out";

/** Muted inline icons (leading search, decorative). Tuned to the placeholder de-emphasis level (gray-500 light /
 * gray-400 dark) so a leading icon and the field's placeholder read at the same weight, while staying clearly
 * subordinate to the entered value. */
export const CHROME_MUTED_ICON_CLASSES = "text-gray-500 dark:text-gray-400";

/**
 * Neutral hover wash for borderless clickables on a plain surface — ghost Button/IconButton,
 * left-panel nav rows, dropdown/date-picker menu items. The dark alpha is deliberately `/50`
 * (not `/60`): a solid `gray-100` over white and `gray-700/50` over a near-black page read as the
 * same perceived step, whereas equal or higher alphas make the dark wash flare brighter than light.
 * Table rows and outline buttons use a *lighter* wash (`gray-50` / `gray-700/25`) on purpose and do
 * not use this token.
 */
export const HOVER_WASH_NEUTRAL_CLASSES = "hover:bg-gray-100 dark:hover:bg-gray-700/50";

/**
 * Keyboard-focus indicators. The library uses three role-based tiers so focus feedback is
 * consistent within each control class instead of one-size-fits-all:
 *
 * - `FOCUS_RING_SURFACE_CLASSES` — bordered, checkable, or card-like surfaces (DataCard,
 *   CardToggleGroup, ToggleGroup inputs). A 2px blue ring hugs the existing border, so no
 *   offset is used. Pair with `focus-visible:outline-none`.
 * - `FOCUS_OUTLINE_INLINE_CLASSES` — inline or borderless hit targets that have no border of
 *   their own to recolor (Link, clickable table rows). An offset outline separates the ring
 *   from the text/row it wraps.
 * - Form fields and buttons are the third tier and do NOT use either token: they signal focus
 *   by recoloring their own border to blue (`focus:border-blue-500 focus:ring-0`), which reads
 *   as part of the control rather than a halo around it. See Input/Textarea/Button/IconButton.
 */
export const FOCUS_RING_SURFACE_CLASSES = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70";
export const FOCUS_OUTLINE_INLINE_CLASSES = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500";

/**
 * Card / surface corner radius, in two deliberate tiers so rounding scales with the surface size:
 *
 * - `SURFACE_RADIUS_SHELL` (`rounded-2xl`) — spacious container shells with generous padding
 *   (BackgroundCard, MetricCard, Table). The larger radius matches the larger box.
 * - `SURFACE_RADIUS_COMPACT` (`rounded-xl`) — denser interactive cards with compact padding
 *   (DataCard, CardToggleGroup). A tighter radius keeps small cards from looking over-rounded.
 */
export const SURFACE_RADIUS_SHELL = "rounded-2xl";
export const SURFACE_RADIUS_COMPACT = "rounded-xl";

/** Shared translucent, blurred chrome for the fixed header/footer bars so the two stay identical. The bar adds its own border side (`border-b` / `border-t`). */
export const LAYOUT_CHROME_BAR_SURFACE_CLASSES = "border-gray-200 bg-white/90 px-3 py-3 backdrop-blur-md dark:border-gray-700/80 dark:bg-gray-950/90";

/**
 * The page column's horizontal gutter (see `PageLayout`) and its exact inverse (see `Bleed`).
 *
 * `PageLayout` insets its content by `LAYOUT_PAGE_INLINE_PADDING` on both sides; `Bleed` negates the
 * SAME amount so a descendant can reach the screen edges without the consumer hardcoding the value.
 * These three MUST stay in lockstep — the padding is `1rem` below `md` and `1.5rem` from `md` up, so
 * the full bleed is `-mx-4 md:-mx-6` and the mobile-only bleed (leaving the desktop gutter intact) is
 * `max-md:-mx-4`. Change the padding, change both bleeds.
 */
export const LAYOUT_PAGE_INLINE_PADDING = "px-4 md:px-6";
export const LAYOUT_PAGE_INLINE_BLEED = "-mx-4 md:-mx-6";
export const LAYOUT_PAGE_INLINE_BLEED_MOBILE = "max-md:-mx-4";

/**
 * Content-card surface: border, background, and body text color for cards that sit in the page
 * flow (BackgroundCard, DataCard, Table, CardToggleGroup, Upload file rows). Dark cards border at
 * the softer `gray-800` and fill with `gray-800/40` so they recede into the page — distinct from
 * *floating* surfaces (menus, toasts) which use the more visible `gray-700` border and a more
 * opaque fill because they sit above the page. Callers add their own radius (`SURFACE_RADIUS_*`),
 * padding, and any hover/checked state on top; tailwind-merge lets those layer over this base.
 */
export const CONTENT_CARD_SURFACE_CLASSES = "border border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-100";

/** Floating menus and popovers. */
export const DROPDOWN_MENU_SURFACE_CLASSES = "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/30";

// Badge leading icon: sized to `text-xs` row; `align-middle` keeps inline alignment with adjacent text.
export const BADGE_ICON_CLASSES = "size-3 shrink-0 align-middle pointer-events-none text-current";

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
