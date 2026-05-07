import { BackgroundCard } from "@/components/card/BackgroundCard";
import { Icon } from "@/components/icons";
import { mergeClasses } from "@/utilities";
import { Show } from "solid-js";

type AccentColor = "emerald" | "blue" | "amber" | "violet" | "rose";

const ACCENT_CLASSES: Record<AccentColor, { card: string; iconBox: string; iconColor: string; link: string }> = {
  emerald: {
    card: "border-l-emerald-500",
    iconBox: "bg-emerald-500/15",
    iconColor: "text-emerald-600",
    link: "text-emerald-600 hover:text-emerald-700 hover:underline"
  },
  blue: {
    card: "border-l-blue-500",
    iconBox: "bg-blue-500/15",
    iconColor: "text-blue-600",
    link: "text-blue-600 hover:text-blue-700 hover:underline"
  },
  amber: {
    card: "border-l-amber-500",
    iconBox: "bg-amber-500/15",
    iconColor: "text-amber-700",
    link: "text-amber-700 hover:text-amber-800 hover:underline"
  },
  violet: {
    card: "border-l-violet-500",
    iconBox: "bg-violet-500/15",
    iconColor: "text-violet-600",
    link: "text-violet-600 hover:text-violet-700 hover:underline"
  },
  rose: {
    card: "border-l-rose-500",
    iconBox: "bg-rose-500/15",
    iconColor: "text-rose-600",
    link: "text-rose-600 hover:text-rose-700 hover:underline"
  }
};

type MetricCardProperties = {
  title: string;
  accent: AccentColor;
  icon: string;
  loading?: boolean;
  value: string;
  linkHref?: string;
  linkLabel?: string;
  class?: string;
};

/**
 * Metric/stat card with left border accent, icon, value, and optional link. When loading, the value shows an em dash.
 */
export const MetricCard = (properties: MetricCardProperties) => {
  const accent = () => ACCENT_CLASSES[properties.accent];
  const isLoading = (): boolean => properties.loading === true;
  return (
    <BackgroundCard class={mergeClasses("overflow-hidden", properties.class)}>
      <div class={mergeClasses("-ml-6 border-l-4 pl-6", accent().card)}>
        <div class="flex flex-row items-center justify-between">
          <h3 class="text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">{properties.title}</h3>
          <span class={mergeClasses("flex h-9 w-9 items-center justify-center rounded-lg", accent().iconBox, accent().iconColor)}>
            <Icon name={properties.icon} size={20} aria-hidden="true" />
          </span>
        </div>
      </div>
      <div class="space-y-3 pt-4">
        <Show
          when={!isLoading()}
          fallback={
            <div class="text-2xl font-semibold tracking-tight text-gray-400 dark:text-gray-600" aria-busy="true">
              —
            </div>
          }
        >
          <div class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{properties.value}</div>
        </Show>
        <Show when={properties.linkHref !== undefined && properties.linkLabel !== undefined}>
          <a href={properties.linkHref!} class={mergeClasses("inline-flex items-center gap-1.5 text-sm font-medium", accent().link)}>
            {properties.linkLabel}
            <Icon name="arrow_forward" size={16} aria-hidden="true" />
          </a>
        </Show>
      </div>
    </BackgroundCard>
  );
};

export type { MetricCardProperties };
