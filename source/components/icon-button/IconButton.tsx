import { RenderIcon } from "@/components/icons";
import { Spinner } from "@/components/spinner";
import { FORM_CONTROL_ICON_BUTTON_SIZE_CLASSES, FORM_CONTROL_ICON_SIZE, type FlushControlBreakpoint, flushControlRadiusClasses, mergeClasses } from "@/utilities";
import type { ComponentProps, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

type IconButtonVariant = "solid" | "outline" | "ghost";

type IconButtonProperties = Omit<ComponentProps<"button">, "class"> & {
  variant?: IconButtonVariant;
  class?: string;
  icon?: string | JSX.Element;
  // Square the corners so the button sits flush against a neighbour (e.g. an icon-only dropdown
  // trigger butted against an input). `true` at every width, `"mobile"` only below `md`.
  flush?: FlushControlBreakpoint;
  // Busy state for async actions. While `true` the icon is replaced by a spinner, the button is
  // disabled so it cannot be re-triggered, and `aria-busy` is set. Kept in lockstep with Button.
  loading?: boolean;
};

// Spinner sized to the shared control icon size (18px) and inheriting the button's text color via
// `currentColor`, matching Button's loading spinner.
const LOADING_SPINNER_CLASSES = "size-[18px] border-current text-current";

const getVariantClasses = (variant: IconButtonVariant = "solid"): string => {
  switch (variant) {
    case "solid":
      return "border-2 border-transparent text-white bg-blue-600 enabled:hover:bg-blue-700 focus-visible:border-white dark:focus-visible:border-gray-100";
    case "outline":
      return "border border-solid border-gray-300 bg-white text-gray-800 enabled:hover:bg-gray-50 focus-visible:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:enabled:hover:bg-gray-700 dark:focus-visible:border-blue-400";
    case "ghost":
      // Ghost is borderless in every state: unlike solid/outline it never draws a visible border, so focusing it
      // (which happens the moment it is clicked) must not paint one either. The transparent border is kept only to
      // preserve the shared box model so a ghost button lines up with solid / outline siblings.
      // Hover wash is asymmetric on purpose: solid gray-100 over white and gray-700/50 over a near-black page
      // produce a similar perceived step; equal alphas make dark mode flare far brighter than light.
      return "border-2 border-transparent text-gray-800 enabled:hover:bg-gray-100 dark:text-gray-100 dark:enabled:hover:bg-gray-700/50";
  }
};

/**
 * Compact icon-only button sized to match the sibling form controls.
 */
export const IconButton = (properties: IconButtonProperties) => {
  const [local, rest] = splitProps(properties, ["class", "variant", "flush", "icon", "loading", "children", "disabled"]);

  return (
    <button
      type="button"
      class={mergeClasses(
        "inline-flex cursor-pointer items-center justify-center rounded-lg transition-[color,background-color,border-color,opacity] duration-100 ease-out focus:outline-none focus-visible:ring-0 active:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:opacity-50",
        // After the base rounded-lg so a set `flush` wins the rounding conflict via tailwind-merge.
        flushControlRadiusClasses(local.flush),
        getVariantClasses(local.variant),
        FORM_CONTROL_ICON_BUTTON_SIZE_CLASSES,
        local.class
      )}
      // Loading forces the disabled state without dropping an explicit `disabled` the caller passed.
      disabled={local.loading === true || local.disabled === true}
      aria-busy={local.loading === true ? "true" : undefined}
      {...rest}
    >
      <Show when={local.loading === true} fallback={<Show when={local.icon != null}>{<RenderIcon icon={local.icon!} size={FORM_CONTROL_ICON_SIZE} />}</Show>}>
        <Spinner class={LOADING_SPINNER_CLASSES} />
      </Show>
      <Show when={local.loading !== true}>{local.children}</Show>
    </button>
  );
};
