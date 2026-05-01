import { Spinner } from "@/components/spinner/Spinner";
import { mergeClasses } from "@/utilities";
import type { Component } from "solid-js";

type LoadingProperties = {
  message: string;
  class?: string;
};

/**
 * Centred loading spinner with supporting message.
 */
export const Loading: Component<LoadingProperties> = (properties) => {
  return (
    <div class={mergeClasses("flex flex-col items-center justify-center gap-3 py-12", properties.class)}>
      <Spinner />
      <div class="text-sm text-gray-500 dark:text-gray-400">{properties.message}</div>
    </div>
  );
};
