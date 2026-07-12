import { BackgroundCard } from "@/components/card/BackgroundCard";
import { RenderIcon } from "@/components/icons";
import { Text } from "@/components/typography";
import { mergeClasses } from "@/utilities";
import type { JSX, ParentComponent } from "solid-js";
import { Show } from "solid-js";

type CenteredCardProperties = {
  /** Heading rendered at the top of the card. */
  title?: string;
  /** Supporting line shown beneath the title. */
  subtitle?: string;
  /**
   * Adornment shown above the title. A Material Symbols name (string) renders inside a neutral
   * rounded icon tile; an element (e.g. an `<img>` logo or wordmark) renders bare — centred, at its
   * own aspect ratio up to a fixed height — with no tile, so a wide wordmark is not squashed.
   */
  icon?: string | JSX.Element;
  /** Footer slot rendered below the body, separated by spacing (e.g. a sign-up link). */
  footer?: JSX.Element;
  /** Extra classes applied to the `BackgroundCard` surface. */
  class?: string;
  /** Extra classes applied to the full-height centring wrapper. */
  wrapperClass?: string;
};

/**
 * Full-viewport centred card, built for login and other focused single-action screens. Centres
 * a `BackgroundCard` in the middle of the page with optional icon badge, title, subtitle, and
 * footer slots around the body content.
 *
 * Usage:
 * `<CenteredCard icon="lock" title="Welcome back" subtitle="Sign in to continue">...form...</CenteredCard>`
 */
export const CenteredCard: ParentComponent<CenteredCardProperties> = (properties) => {
  return (
    <div class={mergeClasses("flex min-h-dvh w-full items-center justify-center bg-gray-50 p-4 sm:p-6 dark:bg-gray-950", properties.wrapperClass)}>
      <BackgroundCard class={mergeClasses("w-full max-w-md", properties.class)}>
        <Show when={properties.icon !== undefined}>
          <div class="mb-5">
            <Show
              when={typeof properties.icon === "string"}
              fallback={
                // An element adornment (img/wordmark) renders bare: no badge, no forced square, so it
                // keeps its aspect ratio. `[&>*]:` targets the passed child (e.g. <img>) to cap height.
                <div class="flex items-center *:max-h-10 *:w-auto">{properties.icon}</div>
              }
            >
              <div class="flex size-14 items-center justify-center rounded-lg bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                <RenderIcon icon={properties.icon} size={28} />
              </div>
            </Show>
          </div>
        </Show>

        <Show when={properties.title !== undefined || properties.subtitle !== undefined}>
          <div class="mb-6 space-y-1.5">
            <Show when={properties.title !== undefined}>
              <Text as="h1" size="title" transform="title" display="block">
                {properties.title}
              </Text>
            </Show>
            <Show when={properties.subtitle !== undefined}>
              <Text size="small" color="muted" display="block">
                {properties.subtitle}
              </Text>
            </Show>
          </div>
        </Show>

        <div class="space-y-4">{properties.children}</div>

        <Show when={properties.footer !== undefined}>
          <div class="mt-6">{properties.footer}</div>
        </Show>
      </BackgroundCard>
    </div>
  );
};

export type { CenteredCardProperties };
