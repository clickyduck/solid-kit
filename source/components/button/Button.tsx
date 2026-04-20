import { Icon, type IconComponent } from "@/components/icons";
import { BUTTON_CLASSES, BUTTON_LEADING_ICON_CLASSES, BUTTON_TRAILING_ICON_CLASSES, type IconPosition, mergeClasses } from "@/utilities";
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
      return "border-2 border-transparent text-white bg-blue-600 enabled:hover:bg-blue-700 focus-visible:border-white dark:focus-visible:border-gray-100";
    case "outline":
      return "border border-solid border-gray-300 bg-white text-gray-700 enabled:hover:bg-gray-50 focus-visible:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:enabled:hover:bg-gray-700 dark:focus-visible:border-blue-400";
    case "ghost":
      return "border-2 border-transparent text-gray-700 enabled:hover:bg-gray-100/60 focus-visible:border-gray-400 dark:text-white dark:enabled:hover:bg-gray-700/60 dark:focus-visible:border-gray-500";
    case "link":
      return "border-2 border-transparent text-blue-600 underline-offset-4 enabled:hover:underline focus-visible:border-blue-500 dark:text-blue-500 dark:focus-visible:border-blue-400";
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
        "flex cursor-pointer items-center justify-center gap-2 rounded-lg text-center font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
        getVariantClasses(local.variant),
        BUTTON_CLASSES,
        local.class
      )}
      {...rest}
    >
      <Show when={local.icon} keyed fallback={local.children}>
        {(resolvedIconComponent) => {
          return (
            <>
              <Show when={local.iconPosition !== "end"}>
                <Icon icon={resolvedIconComponent} class={BUTTON_LEADING_ICON_CLASSES} aria-hidden="true" />
              </Show>
              {local.children}
              <Show when={local.iconPosition === "end"}>
                <Icon icon={resolvedIconComponent} class={BUTTON_TRAILING_ICON_CLASSES} aria-hidden="true" />
              </Show>
            </>
          );
        }}
      </Show>
    </button>
  );
};
