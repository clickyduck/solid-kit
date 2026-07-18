import { Text } from "@/components/typography";
import { LAYOUT_PAGE_INLINE_BLEED, LAYOUT_PAGE_INLINE_BLEED_MOBILE, LAYOUT_PAGE_INLINE_PADDING, mergeClasses, themedScrollControlClassName } from "@/utilities";
import type { Component, ComponentProps, JSX, ParentComponent } from "solid-js";
import { Show, splitProps } from "solid-js";

type PageLayoutProperties = {
  children: JSX.Element;
  class?: string;
};

/**
 * Main application page column content wrapper (grid area: `main`).
 *
 * Provides consistent shell gutters to complement `HeaderLayout` and the `RightPanelLayout`. The
 * horizontal gutter is `LAYOUT_PAGE_INLINE_PADDING`, which `Bleed` negates for edge-to-edge content.
 */
export const PageLayout: ParentComponent<PageLayoutProperties> = (properties) => {
  return (
    <div class={mergeClasses("layout-page min-h-0 w-full min-w-0 space-y-6 overflow-y-auto py-6", LAYOUT_PAGE_INLINE_PADDING, themedScrollControlClassName, properties.class)} style={{ "grid-area": "main" }}>
      {properties.children}
    </div>
  );
};

type BleedProperties = {
  // Restrict the bleed to below the `md` breakpoint — edge-to-edge on a phone, normal page gutters on
  // desktop, matching `flush="mobile"`. Omit to bleed at every width.
  mobileOnly?: boolean;
  class?: string;
  children: JSX.Element;
} & Omit<ComponentProps<"div">, "class" | "children">;

/**
 * Full-bleed layout helper: pulls its content out past `PageLayout`'s horizontal gutter so it reaches
 * the screen edges — the fluid, edge-to-edge list/toolbar pattern on a phone. It negates exactly the
 * page gutter (`LAYOUT_PAGE_INLINE_BLEED[_MOBILE]`), so it must be a descendant of `PageLayout` with
 * no other horizontal padding in between; anything more would over- or under-shoot the edge.
 *
 * Pairs with the `flush` prop on DataCard / Button / Input / DropdownTrigger: `flush` squares a
 * control's corners so it *looks* edge-to-edge; `Bleed` moves its container *to* the edge. Stack the
 * children with `max-md:gap-0` when they are `flush` cards so their hairlines line up as one list.
 */
export const Bleed: ParentComponent<BleedProperties> = (properties) => {
  const [local, rest] = splitProps(properties, ["mobileOnly", "class", "children"]);
  return (
    <div class={mergeClasses(local.mobileOnly ? LAYOUT_PAGE_INLINE_BLEED_MOBILE : LAYOUT_PAGE_INLINE_BLEED, local.class)} {...rest}>
      {local.children}
    </div>
  );
};

type PageHeaderProperties = {
  title?: string;
  caption?: string;
  back?: JSX.Element;
  sidebuttons?: JSX.Element;
  class?: string;
};

/**
 * Page title row with optional back link, subtitle, and actions slot.
 */
export const PageHeader: Component<PageHeaderProperties> = (properties) => {
  return (
    <Show when={properties.title}>
      <div class={mergeClasses("flex flex-col gap-4 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-6", properties.class)}>
        <div class="min-w-0 flex-1">
          <Show when={properties.back}>
            <div class="mb-2">{properties.back}</div>
          </Show>
          <Text as="h2" size="title" weight="semibold" transform="title" color="default" display="block" class="min-w-0 text-2xl wrap-break-word whitespace-normal md:text-3xl">
            {properties.title}
          </Text>
          <Show when={properties.caption}>
            <Text as="p" size="small" color="muted" display="block" class="mt-1 min-w-0 wrap-break-word whitespace-normal">
              {properties.caption}
            </Text>
          </Show>
        </div>
        <Show when={properties.sidebuttons}>
          <div class="flex w-full min-w-0 flex-wrap gap-3 sm:w-auto sm:justify-end">{properties.sidebuttons}</div>
        </Show>
      </div>
    </Show>
  );
};

type PageSectionProperties = {
  title?: string;
  caption?: string;
  sidebuttons?: JSX.Element;
  class?: string;
};

/**
 * Page section with optional title and caption, wrapping a logical block of page content.
 */
export const PageSection: ParentComponent<PageSectionProperties> = (properties) => {
  return (
    <section class={mergeClasses("space-y-4", properties.class)}>
      <Show when={properties.title || properties.caption || properties.sidebuttons}>
        <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div class="min-w-0 flex-1">
            <Show when={properties.title}>
              <Text as="h3" size="body" weight="semibold" transform="title" color="default" display="block">
                {properties.title}
              </Text>
            </Show>
            <Show when={properties.caption}>
              <Text as="p" size="small" color="muted" display="block" class="mt-0.5">
                {properties.caption}
              </Text>
            </Show>
          </div>
          <Show when={properties.sidebuttons}>
            <div class="flex w-full min-w-0 flex-wrap gap-3 sm:w-auto sm:justify-end">{properties.sidebuttons}</div>
          </Show>
        </div>
      </Show>
      {properties.children}
    </section>
  );
};

export type { PageLayoutProperties, BleedProperties, PageHeaderProperties, PageSectionProperties };
