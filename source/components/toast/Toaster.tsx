import { mergeClasses } from "@/utilities";
import { For } from "solid-js";

import { Toast, toastStore } from "./Toast";

/**
 * Renders all active toasts in a fixed bottom-right region.
 */
export const Toaster = (properties: { class?: string }) => {
  return (
    <div class={mergeClasses("fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 space-y-3 sm:right-4 sm:left-auto sm:translate-x-0", properties.class)}>
      <For each={toastStore()}>
        {(toast) => {
          return <Toast toast={toast} />;
        }}
      </For>
    </div>
  );
};
