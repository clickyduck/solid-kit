import { mergeClasses } from "@/utilities";
import type { Component, ComponentProps, JSX } from "solid-js";
import { splitProps } from "solid-js";

type DataCardProperties = {
  /** When true, shows hover/cursor affordances and uses a `<button>`. */
  clickable?: boolean;
  /** Optional "selected" style for clickable cards. */
  active?: boolean;
  children: JSX.Element;
  class?: string;
} & Omit<ComponentProps<"div">, "class" | "children" | "onClick"> &
  Omit<ComponentProps<"button">, "class" | "children">;

/**
 * Clickable data card with the same layout/styling as the app's ticket card.
 */
export const DataCard: Component<DataCardProperties> = (properties) => {
  const [local, rest] = splitProps(properties, ["clickable", "active", "children", "onClick", "type", "class"]);
  const isClickable = (): boolean => local.clickable === true || typeof local.onClick === "function";
  const isActive = (): boolean => local.active === true;

  const baseClass = () =>
    mergeClasses(
      "group w-full rounded-xl border border-gray-200 bg-white text-left text-gray-900 transition focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:outline-none",
      "dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-100",
      isClickable() ? "cursor-pointer hover:border-gray-300 dark:hover:border-gray-700" : "cursor-default",
      isClickable() && isActive() ? "border-blue-500 ring-1 ring-blue-500/10 dark:border-blue-400 dark:ring-blue-500/20" : "",
      local.class
    );

  if (isClickable()) {
    const buttonProps = rest as Omit<ComponentProps<"button">, "class" | "children">;
    return (
      <button type={local.type ?? "button"} class={baseClass()} onClick={local.onClick as ComponentProps<"button">["onClick"]} {...buttonProps}>
        <div class="p-3">{local.children}</div>
      </button>
    );
  }

  const divProps = rest as Omit<ComponentProps<"div">, "class" | "children">;
  return (
    <div class={baseClass()} {...divProps}>
      <div class="p-3">{local.children}</div>
    </div>
  );
};
