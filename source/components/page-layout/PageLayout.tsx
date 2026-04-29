import { mergeClasses } from "@/utilities/mergeClasses";
import type { JSX, ParentComponent } from "solid-js";
import { Show } from "solid-js";

type PageLayoutProperties = {
  class?: string;
  children: JSX.Element;
};

/**
 * Main application page column content wrapper (grid area: `main`).
 *
 * Provides consistent shell gutters to complement `HeaderLayout` and the `RightPanelLayout`.
 */
export const PageLayout: ParentComponent<PageLayoutProperties> = (properties) => {
  return (
    <div class={mergeClasses("layout-page mx-auto min-h-0 w-full max-w-screen-2xl min-w-0 px-4 py-6 sm:px-6", properties.class)} style={{ "grid-area": "main" }}>
      {properties.children}
    </div>
  );
};

type PageHeaderProperties = {
  title?: string;
  titleElement?: JSX.Element;
  description?: string;
  back?: JSX.Element;
  class?: string;
};

/**
 * Page title row with optional back link, subtitle, and actions slot.
 */
export const PageHeader: ParentComponent<PageHeaderProperties> = (properties) => {
  if (!properties.title && !properties.titleElement) {
    return null;
  }

  return (
    <div class={properties.class ?? "flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6"}>
      <div class="min-w-0 shrink-0">
        <Show when={properties.back}>
          <div class="mb-2">{properties.back}</div>
        </Show>
        <Show when={properties.titleElement} fallback={<h2 class="shrink-0 text-2xl font-semibold tracking-tight text-white md:text-3xl">{properties.title}</h2>}>
          {properties.titleElement}
        </Show>
        <Show when={properties.description}>
          <p class="mt-1 text-sm text-gray-400">{properties.description}</p>
        </Show>
      </div>
      <Show when={properties.children}>
        <div class="flex w-full flex-col flex-wrap gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3">{properties.children}</div>
      </Show>
    </div>
  );
};

type PageContentProperties = {
  class?: string;
  children: JSX.Element;
};

/**
 * Page body/content wrapper (below `PageHeader`).
 */
export const PageContent: ParentComponent<PageContentProperties> = (properties) => {
  return <div class={mergeClasses("min-w-0", properties.class)}>{properties.children}</div>;
};

export type { PageLayoutProperties, PageHeaderProperties, PageContentProperties };
