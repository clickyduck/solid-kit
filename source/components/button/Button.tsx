import { RenderIcon } from "@/components/icons";
import { Spinner } from "@/components/spinner";
import { FORM_CONTROL_ICON_SIZE, FORM_CONTROL_SIZE_CLASSES, type FlushControlBreakpoint, flushControlRadiusClasses, type IconPosition, mergeClasses } from "@/utilities";
import type { ComponentProps, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

type ButtonVariant = "solid" | "outline" | "ghost";

// Corner rounding. `default` is the standard rounded-lg button; `none` squares the corners for a
// full-bleed action bar (e.g. a sticky "View cart" bar pinned edge-to-edge at the bottom of the
// viewport) so consumers don't reach past the component with a `rounded-*` class override.
// Prefer the `flush` prop (shared across the kit's controls) for new code; `radius` is kept for
// callers that square the corners at every width without opting into the `flush` vocabulary.
type ButtonRadius = "default" | "none";

type ButtonProps = Omit<ComponentProps<"button">, "class"> & {
  variant?: ButtonVariant;
  radius?: ButtonRadius;
  // Square the corners so the button sits flush against the viewport edges or a neighbour — the
  // full-bleed sticky-bar pattern, made native. `true` at every width, `"mobile"` only below `md`.
  // Combine with `w-full` for the classic edge-to-edge action bar. Wins over `radius` when both set.
  flush?: FlushControlBreakpoint;
  class?: string;
  icon?: string | JSX.Element;
  iconPosition?: IconPosition;
  // Busy state for async actions. While `true` the button shows a spinner in the leading position
  // (replacing any leading icon), is disabled so it cannot be re-triggered, and sets `aria-busy`.
  loading?: boolean;
  // Optional copy shown in place of `children` while `loading`, e.g. "Saving…". Falls back to
  // `children` when omitted so the label simply keeps its width beside the spinner.
  loadingText?: JSX.Element;
};

// Spinner sized to the shared control icon size (18px) and inheriting the button's text color via
// `currentColor`, so a loading button keeps the same footprint and the spinner tints per variant
// (white on solid, gray on outline / ghost) instead of the Spinner's default blue.
const LOADING_SPINNER_CLASSES = "size-[18px] border-current text-current";

const getVariantClasses = (variant: ButtonVariant = "solid"): string => {
  switch (variant) {
    case "solid":
      return "border-2 border-transparent text-white bg-blue-600 enabled:hover:bg-blue-700 focus-visible:border-white dark:focus-visible:border-gray-100";
    case "outline":
      return "border border-solid border-gray-300 bg-white text-gray-800 enabled:hover:bg-gray-50 focus-visible:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:enabled:hover:bg-gray-700 dark:focus-visible:border-blue-400";
    case "ghost":
      // Ghost is borderless in every state: unlike solid/outline it never draws a visible border, so focusing it
      // must not paint one either. The transparent border is kept only to preserve the shared box model so a ghost
      // button lines up with solid / outline siblings. Kept in lockstep with IconButton's ghost variant.
      // Hover wash is asymmetric on purpose: solid gray-100 over white and gray-700/50 over a near-black page
      // produce a similar perceived step; equal alphas make dark mode flare far brighter than light.
      return "border-2 border-transparent text-gray-800 enabled:hover:bg-gray-100 dark:text-gray-100 dark:enabled:hover:bg-gray-700/50";
  }
};

const getRadiusClass = (radius: ButtonRadius = "default"): string => {
  return radius === "none" ? "rounded-none" : "rounded-lg";
};

export const Button = (properties: ButtonProps) => {
  const [local, rest] = splitProps(properties, ["class", "variant", "radius", "flush", "icon", "iconPosition", "loading", "loadingText", "children", "disabled"]);

  // Label shown while loading: explicit `loadingText` when given, otherwise the original children so
  // the button keeps its width beside the spinner.
  const loadingLabel = (): JSX.Element => (local.loadingText !== undefined ? local.loadingText : local.children);

  return (
    <button
      type="button"
      class={mergeClasses(
        "flex cursor-pointer items-center justify-center gap-2 text-center font-normal transition-[color,background-color,border-color,opacity] duration-100 ease-out focus:outline-none focus-visible:ring-0 active:opacity-75 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:opacity-50",
        getRadiusClass(local.radius),
        // After getRadiusClass so a set `flush` wins the rounding conflict via tailwind-merge.
        flushControlRadiusClasses(local.flush),
        getVariantClasses(local.variant),
        FORM_CONTROL_SIZE_CLASSES,
        local.class
      )}
      // Loading forces the disabled state so the action cannot be re-triggered mid-flight, without
      // dropping an explicit `disabled` the caller passed.
      disabled={local.loading === true || local.disabled === true}
      aria-busy={local.loading === true ? "true" : undefined}
      {...rest}
    >
      <Show
        when={local.loading === true}
        fallback={
          <ButtonContent icon={local.icon} iconPosition={local.iconPosition}>
            {local.children}
          </ButtonContent>
        }
      >
        {/* Spinner always leads, regardless of `iconPosition`: a trailing progress indicator reads oddly. */}
        <Spinner class={LOADING_SPINNER_CLASSES} />
        {loadingLabel()}
      </Show>
    </button>
  );
};

const ButtonContent = (properties: { icon?: string | JSX.Element; iconPosition?: IconPosition; children?: JSX.Element }): JSX.Element => {
  return (
    <Show when={properties.icon != null} fallback={properties.children}>
      <>
        <Show when={properties.iconPosition !== "end"}>
          <RenderIcon icon={properties.icon!} size={FORM_CONTROL_ICON_SIZE} />
        </Show>
        {properties.children}
        <Show when={properties.iconPosition === "end"}>
          <RenderIcon icon={properties.icon!} size={FORM_CONTROL_ICON_SIZE} class="ml-auto" />
        </Show>
      </>
    </Show>
  );
};
