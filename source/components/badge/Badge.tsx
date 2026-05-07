import { Icon } from "@/components/icons";
import { BADGE_ICON_CLASSES, type Color, mergeClasses } from "@/utilities";
import type { JSX } from "solid-js";
import { Show } from "solid-js";

export type BadgeVariant = "solid" | "outline";

export type { Color };

const BADGE_REMOVE_BUTTON_BASE_CLASS = "-mr-1 -ml-0.5 inline-flex shrink-0 cursor-pointer items-center justify-center self-center rounded-full p-0.5 transition-[colors,opacity] duration-150 active:opacity-75";

const BADGE_CONTAINER_CLASSES_BY_VARIANT_AND_COLOR: Record<BadgeVariant, Record<Color, string>> = {
  solid: {
    primary: "bg-blue-600 text-white ring-1 ring-inset ring-blue-400/40",
    secondary: "bg-gray-600 text-white ring-1 ring-inset ring-gray-500/40",
    neutral: "bg-slate-600 text-white ring-1 ring-inset ring-slate-500/40",
    success: "bg-emerald-600 text-white ring-1 ring-inset ring-emerald-400/40",
    warning: "bg-amber-600 text-white ring-1 ring-inset ring-amber-400/40",
    danger: "bg-red-600 text-white ring-1 ring-inset ring-red-400/40"
  },
  outline: {
    primary: "bg-blue-500/10 text-blue-700 ring-1 ring-inset ring-blue-500/25 dark:bg-blue-500/25 dark:text-blue-200 dark:ring-blue-400/45",
    secondary: "bg-gray-500/10 text-gray-700 ring-1 ring-inset ring-gray-500/25 dark:bg-gray-400/15 dark:text-gray-100 dark:ring-gray-500/45",
    neutral: "bg-slate-500/10 text-slate-700 ring-1 ring-inset ring-slate-500/25 dark:bg-slate-500/25 dark:text-slate-200 dark:ring-slate-400/45",
    success: "bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/25 dark:bg-emerald-500/25 dark:text-emerald-200 dark:ring-emerald-400/45",
    warning: "bg-amber-500/10 text-amber-700 ring-1 ring-inset ring-amber-500/25 dark:bg-amber-500/20 dark:text-amber-100 dark:ring-amber-400/45",
    danger: "bg-red-500/10 text-red-700 ring-1 ring-inset ring-red-500/25 dark:bg-red-500/25 dark:text-red-200 dark:ring-red-400/45"
  }
};

const BADGE_REMOVE_BUTTON_CLASSES_BY_VARIANT_AND_COLOR: Record<BadgeVariant, Record<Color, string>> = {
  solid: {
    primary: "text-white/80 hover:text-white",
    secondary: "text-white/80 hover:text-white",
    neutral: "text-white/80 hover:text-white",
    success: "text-white/80 hover:text-white",
    warning: "text-white/80 hover:text-white",
    danger: "text-white/80 hover:text-white"
  },
  outline: {
    primary: "text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400",
    secondary: "text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
    neutral: "text-slate-600 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-400",
    success: "text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400",
    warning: "text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400",
    danger: "text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
  }
};

export type BadgeProperties = {
  variant?: BadgeVariant;
  color?: Color;
  children: JSX.Element;
  icon?: string | JSX.Element;
  onRemove?: () => void;
  class?: string;
};

export const Badge = (properties: BadgeProperties): JSX.Element => {
  const variant = (): BadgeVariant => properties.variant ?? "solid";
  const color = (): Color => properties.color ?? "neutral";

  return (
    <span class={mergeClasses("inline-flex items-stretch gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium", BADGE_CONTAINER_CLASSES_BY_VARIANT_AND_COLOR[variant()][color()], properties.class)}>
      <span class="inline-flex min-w-0 items-center gap-1.5 self-center">
        <Show when={properties.icon != null}>
          {typeof properties.icon === "string" ? (
            <Icon name={properties.icon} size={14} class={BADGE_ICON_CLASSES} aria-hidden="true" />
          ) : (
            <span class={mergeClasses("inline-flex shrink-0 items-center justify-center", BADGE_ICON_CLASSES)} style={{ width: "14px", height: "14px" }} aria-hidden="true">
              {properties.icon}
            </span>
          )}
        </Show>
        {properties.children}
      </span>
      <Show when={typeof properties.onRemove === "function"}>
        <button
          type="button"
          class={mergeClasses(BADGE_REMOVE_BUTTON_BASE_CLASS, BADGE_REMOVE_BUTTON_CLASSES_BY_VARIANT_AND_COLOR[variant()][color()])}
          aria-label="Remove"
          onClick={() => {
            properties.onRemove?.();
          }}
        >
          <Icon name="cancel" size={14} aria-hidden="true" />
        </button>
      </Show>
    </span>
  );
};
