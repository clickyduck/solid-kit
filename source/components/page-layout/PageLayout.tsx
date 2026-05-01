import { mergeClasses } from "@/utilities";
import type { Component, JSX, ParentComponent } from "solid-js";
import { Show } from "solid-js";

type PageLayoutProperties = {
  children: JSX.Element;
  class?: string;
};

/**
 * Main application page column content wrapper (grid area: `main`).
 *
 * Provides consistent shell gutters to complement `HeaderLayout` and the `RightPanelLayout`.
 */
export const PageLayout: ParentComponent<PageLayoutProperties> = (properties) => {
  return (
    <div class={mergeClasses("layout-page min-h-0 w-full min-w-0 space-y-6 overflow-y-scroll px-4 py-6 md:px-6", properties.class)} style={{ "grid-area": "main" }}>
      {properties.children}
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
  if (!properties.title) {
    return null;
  }

  return (
    <div class={mergeClasses("flex flex-col gap-4 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-6", properties.class)}>
      <div class="min-w-0 flex-1">
        <Show when={properties.back}>
          <div class="mb-2">{properties.back}</div>
        </Show>
        <h2 class="text-foreground min-w-0 text-2xl font-semibold tracking-tight wrap-break-word whitespace-normal md:text-3xl">{properties.title}</h2>
        <Show when={properties.caption}>
          <p class="text-muted-foreground mt-1 min-w-0 text-sm wrap-break-word whitespace-normal">{properties.caption}</p>
        </Show>
      </div>
      <Show when={properties.sidebuttons}>
        <div class="flex w-full min-w-0 flex-wrap gap-3 sm:w-auto sm:justify-end">{properties.sidebuttons}</div>
      </Show>
    </div>
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
              <h3 class="text-foreground text-base font-semibold">{properties.title}</h3>
            </Show>
            <Show when={properties.caption}>
              <p class="text-muted-foreground mt-0.5 text-sm">{properties.caption}</p>
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

export type { PageLayoutProperties, PageHeaderProperties, PageSectionProperties };
