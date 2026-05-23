import { BackgroundCard } from "@/components/card/BackgroundCard";
import { RenderIcon } from "@/components/icons";
import { Link } from "@/components/link";
import { Text } from "@/components/typography";
import { mergeClasses } from "@/utilities";
import type { JSX } from "solid-js";
import { Show } from "solid-js";

type AccentColor = "emerald" | "blue" | "amber" | "violet" | "rose";

const ACCENT_CLASSES: Record<AccentColor, { card: string; iconBox: string; iconColor: string; link: string }> = {
  emerald: {
    card: "border-l-emerald-500",
    iconBox: "bg-emerald-500/15",
    iconColor: "text-emerald-600",
    link: "text-emerald-600 transition-colors duration-100 ease-out hover:text-emerald-700"
  },
  blue: {
    card: "border-l-blue-500",
    iconBox: "bg-blue-500/15",
    iconColor: "text-blue-600",
    link: "text-blue-600 transition-colors duration-100 ease-out hover:text-blue-700"
  },
  amber: {
    card: "border-l-amber-500",
    iconBox: "bg-amber-500/15",
    iconColor: "text-amber-700",
    link: "text-amber-700 transition-colors duration-100 ease-out hover:text-amber-800"
  },
  violet: {
    card: "border-l-violet-500",
    iconBox: "bg-violet-500/15",
    iconColor: "text-violet-600",
    link: "text-violet-600 transition-colors duration-100 ease-out hover:text-violet-700"
  },
  rose: {
    card: "border-l-rose-500",
    iconBox: "bg-rose-500/15",
    iconColor: "text-rose-600",
    link: "text-rose-600 transition-colors duration-100 ease-out hover:text-rose-700"
  }
};

type MetricCardProperties = {
  title: string;
  accent: AccentColor;
  icon: string | JSX.Element;
  loading?: boolean;
  value: string;
  linkHref?: string;
  linkLabel?: string;
  /** Tag used for the optional link. "A" (default) is @solidjs/router's <A>; "a" is a plain anchor for non-router contexts. */
  anchorTag?: "A" | "a";
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
          <Text as="h3" size="small" weight="semibold" transform="uppercase" color="muted">
            {properties.title}
          </Text>
          <span class={mergeClasses("flex h-9 w-9 items-center justify-center rounded-lg", accent().iconBox, accent().iconColor)}>
            <RenderIcon icon={properties.icon} size={20} />
          </span>
        </div>
      </div>
      <div class="space-y-3 pt-4">
        <Show
          when={!isLoading()}
          fallback={
            <Text as="div" size="title" display="block" color="inherit" class="text-gray-400 dark:text-gray-600" aria-busy="true">
              —
            </Text>
          }
        >
          <Text as="div" size="title" display="block" color="default">
            {properties.value}
          </Text>
        </Show>
        <Show when={properties.linkHref !== undefined && properties.linkLabel !== undefined}>
          <Link anchorTag={properties.anchorTag ?? "A"} href={properties.linkHref!} size="small" weight="normal" color="inherit" icon="arrow_forward" iconPosition="end" class={mergeClasses("gap-1.5", accent().link)}>
            {properties.linkLabel}
          </Link>
        </Show>
      </div>
    </BackgroundCard>
  );
};

export type { MetricCardProperties };
