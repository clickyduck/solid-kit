import { BackgroundCard, BackgroundCardContent, BackgroundCardHeader, BackgroundCardTitle } from "@/components/card/BackgroundCard";
import { Icon, type IconComponent, arrowRight } from "@/components/icons";
import { mergeClasses } from "@/utilities";
import { Show } from "solid-js";

type AccentColor = "emerald" | "blue" | "amber" | "violet" | "rose";

const ACCENT_CLASSES: Record<AccentColor, { card: string; iconBox: string; iconColor: string; link: string }> = {
  emerald: {
    card: "border-l-emerald-500 dark:border-l-emerald-400",
    iconBox: "bg-emerald-500/15",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    link: "text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
  },
  blue: {
    card: "border-l-blue-500 dark:border-l-blue-400",
    iconBox: "bg-blue-500/15",
    iconColor: "text-blue-600 dark:text-blue-400",
    link: "text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
  },
  amber: {
    card: "border-l-amber-500 dark:border-l-amber-400",
    iconBox: "bg-amber-500/15",
    iconColor: "text-amber-700 dark:text-amber-400",
    link: "text-amber-700 hover:text-amber-800 hover:underline dark:text-amber-400 dark:hover:text-amber-300"
  },
  violet: {
    card: "border-l-violet-500 dark:border-l-violet-400",
    iconBox: "bg-violet-500/15",
    iconColor: "text-violet-600 dark:text-violet-400",
    link: "text-violet-600 hover:text-violet-700 hover:underline dark:text-violet-400 dark:hover:text-violet-300"
  },
  rose: {
    card: "border-l-rose-500 dark:border-l-rose-400",
    iconBox: "bg-rose-500/15",
    iconColor: "text-rose-600 dark:text-rose-400",
    link: "text-rose-600 hover:text-rose-700 hover:underline dark:text-rose-400 dark:hover:text-rose-300"
  }
};

type MetricProperties = {
  title: string;
  accent: AccentColor;
  icon: IconComponent;
  loading?: boolean;
  value: string;
  linkHref?: string;
  linkLabel?: string;
  class?: string;
};

/**
 * Metric/stat card with left border accent, icon, value, and optional link. When loading, the value shows an em dash.
 */
export const Metric = (properties: MetricProperties) => {
  const accent = () => ACCENT_CLASSES[properties.accent];
  const isLoading = (): boolean => {
    return properties.loading === true;
  };
  return (
    <BackgroundCard class={mergeClasses("border-l-4", accent().card, properties.class)}>
      <BackgroundCardHeader class="mb-3 flex flex-row items-center justify-between space-y-0">
        <BackgroundCardTitle class="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">{properties.title}</BackgroundCardTitle>
        <span class={mergeClasses("flex h-9 w-9 items-center justify-center rounded-lg", accent().iconBox, accent().iconColor)}>
          <Icon icon={properties.icon} width={20} height={20} aria-hidden="true" />
        </span>
      </BackgroundCardHeader>
      <BackgroundCardContent class="space-y-3">
        <Show
          when={!isLoading()}
          fallback={
            <div class="text-2xl font-bold tracking-tight text-gray-400 dark:text-gray-500" aria-busy="true">
              —
            </div>
          }
        >
          <div class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{properties.value}</div>
        </Show>
        <Show when={properties.linkHref !== undefined && properties.linkLabel !== undefined}>
          <a href={properties.linkHref} class={mergeClasses("inline-flex items-center gap-1.5 text-sm font-medium", accent().link)}>
            {properties.linkLabel}
            <Icon icon={arrowRight} width={16} height={16} aria-hidden="true" />
          </a>
        </Show>
      </BackgroundCardContent>
    </BackgroundCard>
  );
};
