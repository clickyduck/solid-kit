import { mergeClasses } from "@/utilities";
import type { Component, ComponentProps, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

type DataCardProperties = {
  /** When true, shows hover/cursor affordances and uses a `<button>`. */
  clickable?: boolean;
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
  const [local, rest] = splitProps(properties, ["clickable", "children", "onClick", "type", "class"]);
  const isClickable = (): boolean => local.clickable === true || typeof local.onClick === "function";

  const baseClass = () =>
    mergeClasses(
      "group w-full rounded-xl border border-gray-200 bg-white text-left text-gray-900 transition-colors duration-100 ease-out focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:outline-none",
      "dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-100",
      isClickable() ? "cursor-pointer hover:border-gray-300 dark:hover:border-gray-700" : "cursor-default",
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
      <button type={local.type ?? "button"} class={baseClass()} onClick={local.onClick as ComponentProps<"button">["onClick"]} {...(rest as Omit<ComponentProps<"button">, "class" | "children">)}>
        <div class="p-3">{local.children}</div>
      </button>
    </Show>
  );
};
