import { Icon, type IconComponent } from "@/components/icons";
import { ICON_ONLY_BUTTON_PADDING } from "@/utilities/controlLayoutClasses";
import { INLINE_ICON_WITHIN_CLICKABLE_CLASS } from "@/utilities/icon";
import { mergeClasses } from "@/utilities/mergeClasses";
import type { ComponentProps } from "solid-js";
import { Show, splitProps } from "solid-js";

type IconButtonVariant = "default" | "ghost" | "primary" | "secondary";

type IconButtonProperties = ComponentProps<"button"> & {
  variant?: IconButtonVariant;
  class?: string;
  icon?: IconComponent;
};

/**
 * Returns Tailwind classes for the given icon button variant.
 */
const getVariantClasses = (variant: IconButtonVariant = "default"): string => {
  switch (variant) {
    case "ghost":
      return "text-gray-400 hover:bg-gray-700 hover:text-white";
    case "primary":
      return "text-white bg-blue-600 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500/40";
    case "secondary":
      return "text-white bg-gray-700 hover:bg-gray-600";
    default:
      return "text-gray-400 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-white";
  }
};

/**
 * Compact icon-only button sized to fit its icon with minimal padding.
 */
export const IconButton = (properties: IconButtonProperties) => {
  const [local, rest] = splitProps(properties, ["class", "variant", "icon", "children"]);
  return (
    <button
      type="button"
      class={mergeClasses(
        "inline-flex cursor-pointer items-center justify-center rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50",
        getVariantClasses(local.variant),
        ICON_ONLY_BUTTON_PADDING,
        local.class
      )}
      {...rest}
    >
      <Show when={local.icon} keyed>
        {(resolvedIconComponent) => {
          return <Icon icon={resolvedIconComponent} class={mergeClasses(INLINE_ICON_WITHIN_CLICKABLE_CLASS, "pointer-events-none shrink-0 text-current")} aria-hidden="true" />;
        }}
      </Show>
      {local.children}
    </button>
  );
};
