import { mergeClasses } from "@/utilities";
import type { JSX, ParentComponent } from "solid-js";
import { Show } from "solid-js";

type HeaderLayoutProperties = {
  title?: string;
  titleElement?: JSX.Element;
  back?: JSX.Element;
  class?: string;
};

/**
 * App shell header row (grid area: `header`).
 *
 * Intended to be used inside `MainLayout` as the `header` grid slot.
 */
export const HeaderLayout: ParentComponent<HeaderLayoutProperties> = (properties) => {
  return (
    <Show when={properties.title || properties.titleElement || properties.children}>
      <div
        class={mergeClasses("layout-header flex min-h-16 flex-row items-center justify-between gap-3 border-b border-gray-200 bg-white/90 px-3 py-3 backdrop-blur-md md:gap-6 md:py-0 dark:border-gray-700/80 dark:bg-gray-950/90", properties.class)}
        style={{ "grid-area": "header" }}
      >
        <div class="min-w-0">
          <Show when={properties.back}>
            <div class="mb-2">{properties.back}</div>
          </Show>
          <Show when={properties.titleElement} fallback={<h2 class="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl dark:text-white">{properties.title}</h2>}>
            {properties.titleElement}
          </Show>
        </div>

        <Show when={properties.children}>
          <div class="flex flex-row flex-wrap items-center gap-3 sm:w-auto">{properties.children}</div>
        </Show>
      </div>
    </Show>
  );
};

export type { HeaderLayoutProperties };
