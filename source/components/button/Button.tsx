import { Icon, type IconComponent } from "@/components/icons";
import { CLICKABLE_COMPONENT_PADDING, INLINE_ICON_END_PADDING_CLASS, INLINE_ICON_START_PADDING_CLASS } from "@/utilities/controlLayoutClasses";
import { INLINE_ICON_WITHIN_CLICKABLE_CLASS, type IconPosition } from "@/utilities/icon";
import { mergeClasses } from "@/utilities/mergeClasses";
import type { ComponentProps } from "solid-js";
import { Show, splitProps } from "solid-js";

type ButtonVariant = "default" | "outline" | "ghost" | "link";

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  class?: string;
  icon?: IconComponent;
  iconPosition?: IconPosition;
};

/**
 * Returns Tailwind classes for the given button variant.
 */
const getVariantClasses = (variant: ButtonVariant = "default"): string => {
  switch (variant) {
    case "default":
      return "text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900";
    case "outline":
      return "text-white bg-gray-800 border border-gray-700 hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900";
    case "ghost":
      return "text-white hover:bg-gray-700/60 focus-visible:ring-2 focus-visible:ring-blue-500/40";
    case "link":
      return "text-blue-500 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-blue-500/40";
  }
};

/**
 * Button component with variant options.
 */
export const Button = (properties: ButtonProps) => {
  const [local, rest] = splitProps(properties, ["class", "variant", "icon", "iconPosition", "children"]);

  return (
    <button
      type="button"
      class={mergeClasses(
        "flex cursor-pointer items-center justify-center gap-2 rounded-lg text-center font-medium transition-all duration-150 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        getVariantClasses(local.variant),
        CLICKABLE_COMPONENT_PADDING,
        local.class
      )}
      {...rest}
    >
      <Show when={local.icon} keyed fallback={local.children}>
        {(resolvedIconComponent) => {
          return (
            <>
              <Show when={local.iconPosition !== "end"}>
                <Icon icon={resolvedIconComponent} class={mergeClasses(INLINE_ICON_WITHIN_CLICKABLE_CLASS, INLINE_ICON_START_PADDING_CLASS, "pointer-events-none shrink-0 text-current")} aria-hidden="true" />
              </Show>
              {local.children}
              <Show when={local.iconPosition === "end"}>
                <Icon icon={resolvedIconComponent} class={mergeClasses(INLINE_ICON_WITHIN_CLICKABLE_CLASS, INLINE_ICON_END_PADDING_CLASS, "pointer-events-none ml-auto shrink-0 text-current")} aria-hidden="true" />
              </Show>
            </>
          );
        }}
      </Show>
    </button>
  );
};
