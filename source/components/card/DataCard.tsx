import { CONTENT_CARD_SURFACE_CLASSES, FOCUS_RING_SURFACE_CLASSES, SURFACE_RADIUS_COMPACT, mergeClasses } from "@/utilities";
import type { Component, ComponentProps, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

type DataCardProperties = {
  /** When true, shows hover/cursor affordances and uses a `<button>`. */
  clickable?: boolean;
  /**
   * Renders the card as a flush, full-width list row instead of a separate box: drops the side and
   * top borders and the corner rounding, keeping a bottom hairline so stacked cards read as one
   * divided list — decluttering the repeated boxes-in-boxes on a narrow phone. `"mobile"` applies
   * this only below the `md` breakpoint (boxed card on desktop, flush row on phone); `true` at every
   * width. Defaults to the boxed card. Stack flush cards with no gap (e.g. `max-md:gap-0`) so their
   * bottom rules line up into the list's separators.
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

  // Turn the boxed card into a flush list row: drop the side + top borders and the corner rounding,
  // but KEEP the bottom border so stacked cards self-divide into a list (the base `border`/`border-gray-*`
  // supplies that hairline; the last row's trailing rule reads as the list's closing edge). A plain
  // `border-0` here would instead lean on the container's `divide-*` for separators — but Tailwind wraps
  // `divide-*` in `:where()` (zero specificity), so it loses to this card's own border utilities and the
  // hairlines vanish; drawing our own bottom rule sidesteps that. `"mobile"` scopes the shed to below the
  // `md` breakpoint — the library's single mobile boundary, see useIsMobile — via `max-md:`.
  const flushClass = (): string => {
    if (local.flush === true) {
      return "border-x-0 border-t-0 rounded-none";
    }
    if (local.flush === "mobile") {
      return "max-md:border-x-0 max-md:border-t-0 max-md:rounded-none";
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
