import { mergeClasses } from "@/utilities";
import type { ParentComponent } from "solid-js";
import { Show } from "solid-js";

type FooterLayoutProperties = {
  /** Tailwind z-index for the bar. Defaults to `z-20` so it sits above page content but below modals. */
  zIndexClass?: string;
  class?: string;
};

/**
 * Fixed bottom action bar — the counterpart to `HeaderLayout`.
 *
 * Pins a full-width surface to the bottom of the viewport with a hairline top border and the same
 * translucent, blurred chrome as `HeaderLayout`, so page content scrolls underneath it. Intended for
 * persistent primary actions (cart total + checkout, "swipe to pay", form save bars) on mobile-first
 * screens. It is not part of the `MainLayout` grid; render it anywhere (a `Portal` to `document.body`
 * keeps it anchored to the viewport rather than a scroll container). Pass `class` to add inner spacing
 * or constrain width; pass `zIndexClass` to layer it.
 */
export const FooterLayout: ParentComponent<FooterLayoutProperties> = (properties) => {
  return (
    <Show when={properties.children}>
      <div
        class={mergeClasses(
          "layout-footer fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white/90 px-3 py-3 backdrop-blur-md dark:border-gray-700/80 dark:bg-gray-950/90",
          properties.zIndexClass ?? "z-20",
          properties.class
        )}
      >
        {properties.children}
      </div>
    </Show>
  );
};

export type { FooterLayoutProperties };
