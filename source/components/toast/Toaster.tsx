import { mergeClasses } from "@/utilities";
import { For } from "solid-js";

import { Toast, toastStore } from "./Toast";

/**
 * Renders all active toasts in a fixed bottom-right region.
 *
 * Toasts slide in from off-screen (right on desktop, bottom on mobile). The inner
 * wrapper clips that off-screen travel so it can never widen the page or show a
 * scrollbar. Its slack keeps settled toasts' shadows from being cropped: vertical
 * on both breakpoints (`-my-4 py-4`), plus horizontal only at `sm+` (`sm:-mx-4
 * sm:px-4`) where the region is inset from the right edge — on mobile the region
 * is full-width, so horizontal slack would spill past the viewport and add a
 * horizontal scrollbar. Mobile slides vertically, so it needs no horizontal slack.
 */
export const Toaster = (properties: { class?: string }) => {
  return (
    <div class={mergeClasses("pointer-events-none fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 sm:right-4 sm:left-auto sm:translate-x-0", properties.class)}>
      <div class="-my-4 space-y-3 overflow-hidden py-4 sm:-mx-4 sm:px-4">
        <For each={toastStore()}>
          {(toast) => {
            return <Toast toast={toast} class="pointer-events-auto" />;
          }}
        </For>
      </div>
    </div>
  );
};
