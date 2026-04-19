import { Card, CardContent, CardHeader, CardTitle } from "@/components/card/Card";
import { Icon, arrowRight } from "@/components/icons";
import { mergeClasses } from "@/utilities/mergeClasses";
import { type Component, type ComponentProps, Show } from "solid-js";

type AccentColor = "emerald" | "blue" | "amber" | "violet" | "rose";

const ACCENT_CLASSES: Record<AccentColor, { card: string; iconBox: string; iconColor: string; link: string }> = {
  emerald: {
    card: "border-l-emerald-500",
    iconBox: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    link: "text-emerald-400 hover:text-emerald-300 hover:underline"
  },
  blue: {
    card: "border-l-blue-500",
    iconBox: "bg-blue-500/15",
    iconColor: "text-blue-400",
    link: "text-blue-400 hover:text-blue-300 hover:underline"
  },
  amber: {
    card: "border-l-amber-500",
    iconBox: "bg-amber-500/15",
    iconColor: "text-amber-400",
    link: "text-amber-400 hover:text-amber-300 hover:underline"
  },
  violet: {
    card: "border-l-violet-500",
    iconBox: "bg-violet-500/15",
    iconColor: "text-violet-400",
    link: "text-violet-400 hover:text-violet-300 hover:underline"
  },
  rose: {
    card: "border-l-rose-500",
    iconBox: "bg-rose-500/15",
    iconColor: "text-rose-400",
    link: "text-rose-400 hover:text-rose-300 hover:underline"
  }
};

type MetricProperties = {
  title: string;
  accent: AccentColor;
  icon: Component<ComponentProps<"svg">>;
  loading: boolean;
  value: string;
  linkHref?: string;
  linkLabel?: string;
  class?: string;
};

/**
 * Metric/stat card with left border accent, icon, value (with loading skeleton), and optional link.
 */
export const Metric = (properties: MetricProperties) => {
  const accent = ACCENT_CLASSES[properties.accent];
  return (
    <Card class={mergeClasses("border-l-4", accent.card, properties.class)}>
      <CardHeader class="mb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle class="text-sm font-semibold tracking-wide text-gray-400 uppercase">{properties.title}</CardTitle>
        <span class={mergeClasses("flex h-9 w-9 items-center justify-center rounded-lg", accent.iconBox, accent.iconColor)}>
          <Icon icon={properties.icon} width={20} height={20} aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent class="space-y-3">
        <Show when={!properties.loading} fallback={<div class="h-8 w-32 animate-pulse rounded bg-gray-600" />}>
          <div class="text-2xl font-bold tracking-tight text-white">{properties.value}</div>
        </Show>
        <Show when={properties.linkHref !== undefined && properties.linkLabel !== undefined}>
          <a href={properties.linkHref} class={mergeClasses("inline-flex items-center gap-1.5 text-sm font-medium", accent.link)}>
            {properties.linkLabel}
            <Icon icon={arrowRight} width={16} height={16} aria-hidden="true" />
          </a>
        </Show>
      </CardContent>
    </Card>
  );
};
