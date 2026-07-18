import { CONTENT_CARD_SURFACE_CLASSES, FOCUS_RING_SURFACE_CLASSES, SURFACE_RADIUS_COMPACT, mergeClasses } from "@/utilities";
import type { Component, ComponentProps, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

type DataCardProperties = {
  /** When true, shows hover/cursor affordances and uses a `<button>`. */
  clickable?: boolean;
  /**
   * Sheds the card's own border and corner rounding so stacked cards merge into one flush,
   * full-width list instead of separate boxes — reclaiming the horizontal space the border and
   * radius waste on a narrow phone. `"mobile"` sheds them only below the `md` breakpoint (boxed
   * card on desktop, flush row on phone); `true` sheds them at every width. Defaults to the boxed
   * card. When flush, the parent list owns row separation (e.g. a `divide-y` container), since the
   * cards no longer draw their own edges.
   */
  flush?: boolean | "mobile";
  children: JSX.Element;
  class?: string;
} & Omit<ComponentProps<"div">, "class" | "children" | "onClick"> &
  Omit<ComponentProps<"button">, "class" | "children">;

/**
 * Ticket-style data surface. Renders as a `<div>` by default, or a `<button>` when `clickable`
 * is true (or an `onClick` handler is provided). For selectable cards (single/multi-pick UI),
 * use `CardToggleGroup` instead.
 */
export const DataCard: Component<DataCardProperties> = (properties) => {
  const [local, rest] = splitProps(properties, ["clickable", "flush", "children", "onClick", "type", "disabled", "class"]);
  const isClickable = (): boolean => local.clickable === true || typeof local.onClick === "function";
  // Only meaningful on the clickable (`<button>`) branch — a static `<div>` has no disabled semantics.
  const isDisabled = (): boolean => isClickable() && local.disabled === true;

  // Drop the border + radius so stacked cards read as one flush list; `"mobile"` scopes it below the
  // `md` breakpoint (the library's single mobile boundary, see useIsMobile) via `max-md:`, so desktop
  // keeps the boxed card. `border-0`/`rounded-none` override the surface constants above through
  // tailwind-merge (unprefixed) or the `max-md:` media query (mobile).
  const flushClass = (): string => {
    if (local.flush === true) {
      return "border-0 rounded-none";
    }
    if (local.flush === "mobile") {
      return "max-md:border-0 max-md:rounded-none";
    }
    return "";
  };

  const baseClass = () =>
    mergeClasses(
      "group w-full text-left transition-colors duration-100 ease-out",
      CONTENT_CARD_SURFACE_CLASSES,
      SURFACE_RADIUS_COMPACT,
      flushClass(),
      FOCUS_RING_SURFACE_CLASSES,
      // Disabled clickable cards drop the interactive affordances (no pointer cursor, no hover border,
      // dimmed) so they read as inert, matching Button's disabled treatment. Non-disabled clickable cards
      // keep the hover/cursor cues; static cards get neither.
      isDisabled() ? "cursor-not-allowed opacity-50" : isClickable() ? "cursor-pointer hover:border-gray-300 dark:hover:border-gray-700" : "cursor-default",
      local.class
    );

  return (
    <Show
      when={isClickable()}
      fallback={
        <div class={baseClass()} {...(rest as Omit<ComponentProps<"div">, "class" | "children">)}>
          <div class="p-3">{local.children}</div>
        </div>
      }
    >
      <button type={local.type ?? "button"} class={baseClass()} disabled={local.disabled} onClick={local.onClick as ComponentProps<"button">["onClick"]} {...(rest as Omit<ComponentProps<"button">, "class" | "children">)}>
        <div class="p-3">{local.children}</div>
      </button>
    </Show>
  );
};
