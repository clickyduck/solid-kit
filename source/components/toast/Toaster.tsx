import { mergeClasses } from "@/utilities";
import { For } from "solid-js";

import { Toast, toastStore } from "./Toast";

type ToasterProperties = {
  class?: string;
  /**
   * Lifts the toast stack this far above the bottom edge — any CSS length (e.g. `"7rem"`).
   *
   * For clearing a pinned bottom bar (a cart/checkout bar, a "swipe to pay" strip) so toasts
   * don't cover the primary action. Unlike nudging the position with a `bottom-*` utility via
   * `class`, this keeps the enter animation originating from the screen edge: the region stays
   * anchored to the bottom, a padding band of the same size holds the overflow clip at the edge,
   * and the toast still slides up from the edge and settles above the bar (no mid-air appearance).
   * Omit for the default edge-anchored placement.
   */
  bottomOffset?: string;
};

/**
 * Renders all active toasts in a fixed bottom region (bottom-center on mobile, bottom-right on `sm+`).
 *
 * Toasts slide in from off-screen (right on desktop, bottom on mobile). The inner wrapper clips that
 * off-screen travel so it can never widen the page or show a scrollbar. Its slack keeps settled toasts'
 * shadows from being cropped: vertical on both breakpoints, plus horizontal only at `sm+` (`sm:-mx-4
 * sm:px-4`) where the region is inset from the right edge — on mobile the region is full-width, so
 * horizontal slack would spill past the viewport and add a horizontal scrollbar.
 *
 * `bottomOffset` lifts the whole stack above the bottom edge (to clear a pinned bar) while keeping that
 * edge-anchored entrance: the region drops to `bottom-0`, the inner wrapper's bottom slack grows to the
 * offset so the overflow clip still ends at the screen edge, and `--sk-toast-offset` extends each toast's
 * enter travel by the same amount (see `Toast.tsx`) so it starts fully below the edge.
 */
export const Toaster = (properties: ToasterProperties) => {
  const offset = (): string | undefined => properties.bottomOffset;
  return (
    <div
      class={mergeClasses("pointer-events-none fixed left-1/2 z-50 w-full max-w-sm -translate-x-1/2 sm:right-4 sm:left-auto sm:translate-x-0", offset() ? "bottom-0" : "bottom-4", properties.class)}
      style={offset() ? { "--sk-toast-offset": offset() } : undefined}
    >
      {/* Bottom slack matches the lift so the overflow clip still ends at the screen edge; without a
          lift it stays the symmetric `-my-4 py-4` shadow slack the default has always used. */}
      <div class={mergeClasses("space-y-3 overflow-hidden sm:-mx-4 sm:px-4", offset() ? "-mt-4 pt-4" : "-my-4 py-4")} style={offset() ? { "margin-bottom": `calc(${offset()} * -1)`, "padding-bottom": offset() } : undefined}>
        <For each={toastStore()}>
          {(toast) => {
            return <Toast toast={toast} class="pointer-events-auto" />;
          }}
        </For>
      </div>
    </div>
  );
};

export type { ToasterProperties };
