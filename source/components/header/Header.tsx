import type { JSX, ParentComponent } from "solid-js";
import { Show } from "solid-js";

type HeaderProperties = {
  title?: string;
  titleElement?: JSX.Element;
  description?: string;
  back?: JSX.Element;
  class?: string;
};

/**
 * Page title row with optional back link, subtitle, and actions slot.
 */
export const Header: ParentComponent<HeaderProperties> = (properties) => {
  if (!properties.title && !properties.titleElement) {
    return null;
  }

  return (
    <div class={properties.class ?? "flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6"}>
      <div class="min-w-0 shrink-0">
        <Show when={properties.back}>
          <div class="mb-2">{properties.back}</div>
        </Show>
        <Show when={properties.titleElement} fallback={<h2 class="shrink-0 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{properties.title}</h2>}>
          {properties.titleElement}
        </Show>
        <Show when={properties.description}>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{properties.description}</p>
        </Show>
      </div>
      <Show when={properties.children}>
        <div class="flex w-full flex-col flex-wrap gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3">{properties.children}</div>
      </Show>
    </div>
  );
};
