import { BackgroundCard } from "@/components/card/BackgroundCard";
import { RenderIcon } from "@/components/icons";
import { Link } from "@/components/link";
import { Text } from "@/components/typography";
import { mergeClasses } from "@/utilities";
import type { JSX } from "solid-js";
import { Show } from "solid-js";

type AccentColor = "emerald" | "blue" | "amber" | "violet" | "red";

// Accent link text carries an explicit dark variant (`dark:text-*-300`) so it stays high-contrast on the card's
// near-black dark surface — matching the semantic reading-text tier in COLOR_CLASSES (light -700 / dark -300).
// The icon sits on a `/15` tinted box, so its dark shade is one step brighter (`dark:text-*-400`) to read on
// that tint. Without the dark variants these rendered as dark -600/-700 text on a near-black card.
const ACCENT_CLASSES: Record<AccentColor, { card: string; iconBox: string; iconColor: string; link: string }> = {
  emerald: {
    card: "border-l-emerald-500",
    iconBox: "bg-emerald-500/15",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    link: "text-emerald-700 transition-colors duration-100 ease-out hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200"
  },
  blue: {
    card: "border-l-blue-500",
    iconBox: "bg-blue-500/15",
    iconColor: "text-blue-600 dark:text-blue-400",
    link: "text-blue-700 transition-colors duration-100 ease-out hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
  },
  amber: {
    card: "border-l-amber-500",
    iconBox: "bg-amber-500/15",
    iconColor: "text-amber-700 dark:text-amber-400",
    link: "text-amber-800 transition-colors duration-100 ease-out hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200"
  },
  violet: {
    card: "border-l-violet-500",
    iconBox: "bg-violet-500/15",
    iconColor: "text-violet-600 dark:text-violet-400",
    link: "text-violet-700 transition-colors duration-100 ease-out hover:text-violet-800 dark:text-violet-300 dark:hover:text-violet-200"
  },
  red: {
    card: "border-l-red-500",
    iconBox: "bg-red-500/15",
    iconColor: "text-red-600 dark:text-red-400",
    link: "text-red-700 transition-colors duration-100 ease-out hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
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

// Skeleton placeholder shown in the value slot while loading. The wrapper matches the `size="title"`
// value line-height (~28px mobile / ~32px at md, the `text-xl md:text-2xl` line box) so the card does
// not reflow when the real value lands; the bar itself is a shorter pill centered in that line. Pulsed
// on the library's standard motion, disabled under prefers-reduced-motion to match the rest of the
// system. The neutral grays match the content-card surface tier so the bar recedes into the card rather
// than reading as data.
const VALUE_SKELETON_LINE_CLASSES = "flex h-7 items-center md:h-8";
const VALUE_SKELETON_BAR_CLASSES = "h-5 w-24 max-w-full animate-pulse rounded-md bg-gray-200 motion-reduce:animate-none dark:bg-gray-700";

/**
 * Metric/stat card with left border accent, icon, value, and optional link. While `loading`, the value
 * slot shows a pulsing skeleton bar; when the value arrives it is announced via a polite live region.
 */
export const MetricCard = (properties: MetricCardProperties) => {
  const accent = () => ACCENT_CLASSES[properties.accent];
  const isLoading = (): boolean => properties.loading === true;
  return (
    <BackgroundCard class={mergeClasses("overflow-hidden", properties.class)}>
      <div class={mergeClasses("-ml-3 border-l-4 pl-3 sm:-ml-4 sm:pl-4 md:-ml-5 md:pl-5 lg:-ml-6 lg:pl-6", accent().card)}>
        <div class="flex flex-row items-center justify-between">
          <Text as="h3" size="small" weight="semibold" transform="uppercase" color="muted">
            {properties.title}
          </Text>
          <span class={mergeClasses("flex h-9 w-9 items-center justify-center rounded-lg", accent().iconBox, accent().iconColor)}>
            <RenderIcon icon={properties.icon} size={20} />
          </span>
        </div>
      </div>
      <div class="space-y-2 pt-3 sm:space-y-3 sm:pt-4">
        {/* Stable live region: the value slot stays mounted across the loading→loaded transition so screen
            readers announce the resolved value even when focus is elsewhere. `aria-busy` toggles here rather
            than on a node that unmounts. A hidden "Loading {title}" label gives the busy state a spoken name. */}
        <div aria-live="polite" aria-busy={isLoading() ? "true" : undefined}>
          <Show
            when={!isLoading()}
            fallback={
              <div class={VALUE_SKELETON_LINE_CLASSES} role="presentation">
                <span class={VALUE_SKELETON_BAR_CLASSES} />
                <span class="sr-only">Loading {properties.title}</span>
              </div>
            }
          >
            <Text as="div" size="title" display="block" color="default">
              {properties.value}
            </Text>
          </Show>
        </div>
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
