import { Text } from "@/components/typography";
import { LAYOUT_CHROME_BAR_SURFACE_CLASSES, mergeClasses } from "@/utilities";
import type { JSX, ParentComponent } from "solid-js";
import { Show } from "solid-js";

type HeaderLayoutProperties = {
  title?: string;
  titleElement?: JSX.Element;
  back?: JSX.Element;
  /**
   * Clip the title to a single line with an ellipsis instead of letting it wrap.
   *
   * The title column always carries `min-w-0`, but without this it keeps its content width and a
   * long title pushes the row taller (wrap) or wider. When set, the column becomes a shrinking
   * flex item (`flex-1 min-w-0 overflow-hidden`) so it yields width to the actions first. The
   * built-in string `title` also gets single-line CSS truncation; for a custom `titleElement`,
   * put `truncate` on your own inner `<Text>` — the column here only bounds and hides its overflow.
   */
  truncateTitle?: boolean;
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
        <div class={mergeClasses("min-w-0", properties.truncateTitle ? "flex-1 overflow-hidden" : "")}>
          <Show when={properties.back}>
            <div class="mb-2">{properties.back}</div>
          </Show>
          <Show
            when={properties.titleElement}
            fallback={
              <Show when={properties.title}>
                <Text as="h2" size="title" weight="semibold" transform="title" color="default" display="block" truncate={properties.truncateTitle}>
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
