import { Icon, RenderIcon } from "@/components/icons";
import { Text } from "@/components/typography";
import { BADGE_ICON_CLASSES, type Color, mergeClasses } from "@/utilities";
import type { ComponentProps, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

export type BadgeVariant = "solid" | "outline";

export type { Color };

const BADGE_REMOVE_BUTTON_BASE_CLASS =
  "-mr-0.5 -ml-0.5 inline-flex shrink-0 cursor-pointer items-center justify-center self-center rounded-full p-0.5 transition-[color,background-color,border-color,opacity] duration-100 ease-out focus-visible:outline-2 focus-visible:outline-current active:opacity-75";

const BADGE_CONTAINER_CLASSES_BY_VARIANT_AND_COLOR: Record<BadgeVariant, Record<Color, string>> = {
  solid: {
    primary: "bg-blue-600 text-white ring-1 ring-inset ring-blue-400/40",
    neutral: "bg-gray-600 text-white ring-1 ring-inset ring-gray-400/40",
    success: "bg-emerald-600 text-white ring-1 ring-inset ring-emerald-400/40",
    warning: "bg-amber-600 text-white ring-1 ring-inset ring-amber-400/40",
    danger: "bg-red-600 text-white ring-1 ring-inset ring-red-400/40"
  },
  outline: {
    primary: "bg-blue-500/10 text-blue-700 ring-1 ring-inset ring-blue-500/25 dark:bg-blue-500/25 dark:text-blue-200 dark:ring-blue-400/45",
    neutral: "bg-gray-500/10 text-gray-700 ring-1 ring-inset ring-gray-500/25 dark:bg-gray-500/25 dark:text-gray-200 dark:ring-gray-400/45",
    success: "bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/25 dark:bg-emerald-500/25 dark:text-emerald-200 dark:ring-emerald-400/45",
    warning: "bg-amber-500/10 text-amber-700 ring-1 ring-inset ring-amber-500/25 dark:bg-amber-500/25 dark:text-amber-200 dark:ring-amber-400/45",
    danger: "bg-red-500/10 text-red-700 ring-1 ring-inset ring-red-500/25 dark:bg-red-500/25 dark:text-red-200 dark:ring-red-400/45"
  }
};

const BADGE_REMOVE_BUTTON_CLASSES_BY_VARIANT_AND_COLOR: Record<BadgeVariant, Record<Color, string>> = {
  solid: {
    primary: "text-white/80 hover:text-white",
    neutral: "text-white/80 hover:text-white",
    success: "text-white/80 hover:text-white",
    warning: "text-white/80 hover:text-white",
    danger: "text-white/80 hover:text-white"
  },
  outline: {
    primary: "text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400",
    neutral: "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100",
    success: "text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400",
    warning: "text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400",
    danger: "text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
  }
};

// Unclaimed attributes ride through to the root element, so a consumer can attach a `data-testid`,
// an `id`, or an `aria-*` without the component having to know about each one.
export type BadgeProperties = {
  variant?: BadgeVariant;
  color?: Color;
  children: JSX.Element;
  icon?: string | JSX.Element;
  onRemove?: () => void;
  class?: string;
} & Omit<ComponentProps<"span">, "children" | "class" | "color">;

export const Badge = (properties: BadgeProperties): JSX.Element => {
  const [local, rest] = splitProps(properties, ["variant", "color", "children", "icon", "onRemove", "class"]);
  const variant = (): BadgeVariant => local.variant ?? "solid";
  const color = (): Color => local.color ?? "neutral";

  return (
    <span class={mergeClasses("inline-flex items-stretch gap-1 rounded-full px-2.5 py-0.5 text-xs", BADGE_CONTAINER_CLASSES_BY_VARIANT_AND_COLOR[variant()][color()], local.class)} {...rest}>
      <span class="inline-flex min-w-0 items-center gap-1 self-center">
        <Show when={local.icon != null}>
          <RenderIcon icon={local.icon!} size={12} class={BADGE_ICON_CLASSES} />
        </Show>
        <Text as="span" size="caption" weight="normal" color="inherit" display="inline" class="min-w-0">
          {local.children}
        </Text>
      </span>
      <Show when={typeof local.onRemove === "function"}>
        <button
          type="button"
          class={mergeClasses(BADGE_REMOVE_BUTTON_BASE_CLASS, BADGE_REMOVE_BUTTON_CLASSES_BY_VARIANT_AND_COLOR[variant()][color()])}
          aria-label="Remove"
          onClick={() => {
            local.onRemove?.();
          }}
        >
          <Icon name="cancel" size={12} aria-hidden="true" />
        </button>
      </Show>
    </span>
  );
};
