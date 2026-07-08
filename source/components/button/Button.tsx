import { RenderIcon } from "@/components/icons";
import { FORM_CONTROL_ICON_SIZE, FORM_CONTROL_SIZE_CLASSES, type IconPosition, mergeClasses } from "@/utilities";
import type { ComponentProps, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

type ButtonVariant = "solid" | "outline" | "ghost";

// Corner rounding. `default` is the standard rounded-lg button; `none` squares the corners for a
// full-bleed action bar (e.g. a sticky "View cart" bar pinned edge-to-edge at the bottom of the
// viewport) so consumers don't reach past the component with a `rounded-*` class override.
type ButtonRadius = "default" | "none";

type ButtonProps = Omit<ComponentProps<"button">, "class"> & {
  variant?: ButtonVariant;
  radius?: ButtonRadius;
  class?: string;
  icon?: string | JSX.Element;
  iconPosition?: IconPosition;
};

const getVariantClasses = (variant: ButtonVariant = "solid"): string => {
  switch (variant) {
    case "solid":
      return "border-2 border-transparent text-white bg-blue-600 enabled:hover:bg-blue-700 focus-visible:border-white dark:focus-visible:border-gray-100";
    case "outline":
      return "border border-solid border-gray-300 bg-white text-gray-700 enabled:hover:bg-gray-50 focus-visible:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:enabled:hover:bg-gray-700 dark:focus-visible:border-blue-400";
    case "ghost":
      // Ghost is borderless in every state: unlike solid/outline it never draws a visible border, so focusing it
      // must not paint one either. The transparent border is kept only to preserve the shared box model so a ghost
      // button lines up with solid / outline siblings. Kept in lockstep with IconButton's ghost variant.
      // Hover wash is asymmetric on purpose: solid gray-100 over white and gray-700/50 over a near-black page
      // produce a similar perceived step; equal alphas make dark mode flare far brighter than light.
      return "border-2 border-transparent text-gray-700 enabled:hover:bg-gray-100 dark:text-white dark:enabled:hover:bg-gray-700/50";
  }
};

const getRadiusClass = (radius: ButtonRadius = "default"): string => {
  return radius === "none" ? "rounded-none" : "rounded-lg";
};

export const Button = (properties: ButtonProps) => {
  const [local, rest] = splitProps(properties, ["class", "variant", "radius", "icon", "iconPosition", "children"]);

  return (
    <button
      type="button"
      class={mergeClasses(
        "flex cursor-pointer items-center justify-center gap-2 text-center font-normal transition-[color,background-color,border-color,opacity] duration-100 ease-out focus:outline-none focus-visible:ring-0 active:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:opacity-50",
        getRadiusClass(local.radius),
        getVariantClasses(local.variant),
        FORM_CONTROL_SIZE_CLASSES,
        local.class
      )}
      {...rest}
    >
      <Show when={local.icon != null} fallback={local.children}>
        <>
          <Show when={local.iconPosition !== "end"}>
            <RenderIcon icon={local.icon!} size={FORM_CONTROL_ICON_SIZE} />
          </Show>
          {local.children}
          <Show when={local.iconPosition === "end"}>
            <RenderIcon icon={local.icon!} size={FORM_CONTROL_ICON_SIZE} class="ml-auto" />
          </Show>
        </>
      </Show>
    </button>
  );
};
