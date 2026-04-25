import { Spinner } from "@/components/spinner/Spinner";
import type { ParentComponent } from "solid-js";

type LoadingProperties = {
  message: string;
  class?: string;
};

/**
 * Centred loading spinner with supporting message.
 */
export const Loading: ParentComponent<LoadingProperties> = (properties) => {
  return (
    <div class={properties.class ?? "flex flex-col items-center justify-center gap-3 py-12"}>
      <Spinner class="text-blue-500" />
      <div class="text-sm text-gray-500 dark:text-gray-400">{properties.message}</div>
    </div>
  );
};
