import { Text } from "@/components/typography";
import { LAYOUT_CHROME_BAR_SURFACE_CLASSES, mergeClasses } from "@/utilities";
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
      <div class={mergeClasses("layout-header flex min-h-16 flex-row items-center justify-between gap-3 border-b md:gap-6 md:py-0", LAYOUT_CHROME_BAR_SURFACE_CLASSES, properties.class)} style={{ "grid-area": "header" }}>
        <div class="min-w-0">
          <Show when={properties.back}>
            <div class="mb-2">{properties.back}</div>
          </Show>
          <Show
            when={properties.titleElement}
            fallback={
              <Show when={properties.title}>
                <Text as="h2" size="title" weight="semibold" color="default" display="block" class="text-xl md:text-2xl">
                  {properties.title}
                </Text>
              </Show>
            }
          >
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
