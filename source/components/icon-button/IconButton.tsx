import { RenderIcon } from "@/components/icons";
import { FORM_CONTROL_ICON_BUTTON_SIZE_CLASSES, FORM_CONTROL_ICON_SIZE, mergeClasses } from "@/utilities";
import type { ComponentProps, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

type IconButtonVariant = "solid" | "outline" | "ghost";

type IconButtonProperties = Omit<ComponentProps<"button">, "class"> & {
  variant?: IconButtonVariant;
  class?: string;
  icon?: string | JSX.Element;
};

const getVariantClasses = (variant: IconButtonVariant = "solid"): string => {
  switch (variant) {
    case "solid":
      return "border-2 border-transparent text-white bg-blue-600 enabled:hover:bg-blue-700 focus-visible:border-white dark:focus-visible:border-gray-100";
    case "outline":
      return "border border-solid border-gray-300 bg-white text-gray-700 enabled:hover:bg-gray-50 focus-visible:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:enabled:hover:bg-gray-700 dark:focus-visible:border-blue-400";
    case "ghost":
      return "border-2 border-transparent text-gray-700 enabled:hover:bg-gray-100/60 focus-visible:border-gray-400 dark:text-white dark:enabled:hover:bg-gray-700/60 dark:focus-visible:border-gray-500";
  }
};

/**
 * Compact icon-only button sized to match the sibling form controls.
 */
export const IconButton = (properties: IconButtonProperties) => {
  const [local, rest] = splitProps(properties, ["class", "variant", "icon", "children"]);

  return (
    <button
      type="button"
      class={mergeClasses(
        "inline-flex cursor-pointer items-center justify-center rounded-lg transition-[color,background-color,border-color,opacity] duration-100 ease-out focus:outline-none focus-visible:ring-0 active:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:opacity-50",
        getVariantClasses(local.variant),
        FORM_CONTROL_ICON_BUTTON_SIZE_CLASSES,
        local.class
      )}
      {...rest}
    >
      <Show when={local.icon != null}>
        <RenderIcon icon={local.icon!} size={FORM_CONTROL_ICON_SIZE} />
      </Show>
      {local.children}
    </button>
  );
};
