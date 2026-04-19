import { Button } from "@/components/button/Button";
import { Icon, type IconComponent, closeCircle } from "@/components/icons";
import type { Color } from "@/utilities/color";
import { INLINE_ICON_START_PADDING_CLASS } from "@/utilities/controlLayoutClasses";
import { INLINE_ICON_WITHIN_CLICKABLE_CLASS } from "@/utilities/icon";
import { mergeClasses } from "@/utilities/mergeClasses";
import type { JSX } from "solid-js";
import { Show } from "solid-js";

export type BadgeVariant = "prominent" | "subtle" | "ghost";

export type { Color };

/** Compact icon-only hit target for the removable chip; Badge uses tighter padding than full form controls. */
const BADGE_EMBEDDED_REMOVE_ICON_BUTTON_BOX_CLASS = "-mr-0.5 -ml-0.5 h-4 w-4 p-0";

const BADGE_CONTAINER_CLASSES_BY_VARIANT_AND_COLOR: Record<BadgeVariant, Record<Color, string>> = {
  prominent: {
    primary: "bg-blue-600 text-white ring-1 ring-inset ring-blue-400/40",
    secondary: "bg-gray-600 text-white ring-1 ring-inset ring-gray-500/40",
    neutral: "bg-slate-600 text-white ring-1 ring-inset ring-slate-500/40",
    success: "bg-emerald-600 text-white ring-1 ring-inset ring-emerald-400/40",
    warning: "bg-amber-600 text-white ring-1 ring-inset ring-amber-400/40",
    danger: "bg-red-600 text-white ring-1 ring-inset ring-red-400/40"
  },
  subtle: {
    primary: "bg-blue-500/10 text-blue-300 ring-1 ring-inset ring-blue-500/25",
    secondary: "bg-gray-500/10 text-gray-300 ring-1 ring-inset ring-gray-500/25",
    neutral: "bg-slate-500/10 text-slate-300 ring-1 ring-inset ring-slate-500/25",
    success: "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/25",
    warning: "bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/25",
    danger: "bg-red-500/10 text-red-300 ring-1 ring-inset ring-red-500/25"
  },
  ghost: {
    primary: "bg-transparent text-blue-400 ring-1 ring-inset ring-blue-500/40",
    secondary: "bg-transparent text-gray-300 ring-1 ring-inset ring-gray-600",
    neutral: "bg-transparent text-slate-400 ring-1 ring-inset ring-slate-600",
    success: "bg-transparent text-emerald-400 ring-1 ring-inset ring-emerald-500/40",
    warning: "bg-transparent text-amber-400 ring-1 ring-inset ring-amber-500/40",
    danger: "bg-transparent text-red-400 ring-1 ring-inset ring-red-500/40"
  }
};

const BADGE_REMOVE_BUTTON_CLASSES_BY_VARIANT_AND_COLOR: Record<BadgeVariant, Record<Color, string>> = {
  prominent: {
    primary: "text-white/80 hover:text-white",
    secondary: "text-white/80 hover:text-white",
    neutral: "text-white/80 hover:text-white",
    success: "text-white/80 hover:text-white",
    warning: "text-white/80 hover:text-white",
    danger: "text-white/80 hover:text-white"
  },
  subtle: {
    primary: "text-blue-400 hover:text-blue-300",
    secondary: "text-gray-400 hover:text-gray-300",
    neutral: "text-slate-400 hover:text-slate-300",
    success: "text-emerald-400 hover:text-emerald-300",
    warning: "text-amber-400 hover:text-amber-300",
    danger: "text-red-400 hover:text-red-300"
  },
  ghost: {
    primary: "text-blue-500 hover:text-blue-400",
    secondary: "text-gray-400 hover:text-gray-300",
    neutral: "text-slate-500 hover:text-slate-400",
    success: "text-emerald-500 hover:text-emerald-400",
    warning: "text-amber-500 hover:text-amber-400",
    danger: "text-red-500 hover:text-red-400"
  }
};

export type BadgeProperties = {
  variant?: BadgeVariant;
  color?: Color;
  class?: string;
  children: JSX.Element;
  icon?: IconComponent;
  onRemove?: () => void;
};

/**
 * Pill-style badge with removable option. Variant controls emphasis (prominent, subtle, ghost); color selects the semantic palette.
 */
export const Badge = (properties: BadgeProperties): JSX.Element => {
  const variant = (): BadgeVariant => {
    return properties.variant ?? "subtle";
  };

  const color = (): Color => {
    return properties.color ?? "neutral";
  };

  return (
    <span class={mergeClasses("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", BADGE_CONTAINER_CLASSES_BY_VARIANT_AND_COLOR[variant()][color()], properties.class)}>
      <Show when={properties.icon} keyed>
        {(resolvedIcon) => {
          return <Icon icon={resolvedIcon} class={mergeClasses(INLINE_ICON_WITHIN_CLICKABLE_CLASS, INLINE_ICON_START_PADDING_CLASS, "pointer-events-none shrink-0 text-current")} aria-hidden="true" />;
        }}
      </Show>
      {properties.children}
      <Show when={typeof properties.onRemove === "function"}>
        <Button
          variant="ghost"
          class={mergeClasses(BADGE_EMBEDDED_REMOVE_ICON_BUTTON_BOX_CLASS, "hover:bg-transparent", BADGE_REMOVE_BUTTON_CLASSES_BY_VARIANT_AND_COLOR[variant()][color()])}
          aria-label="Remove"
          icon={closeCircle}
          iconPosition="end"
          onClick={() => {
            properties.onRemove?.();
          }}
        />
      </Show>
    </span>
  );
};
