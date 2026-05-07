import { Icon } from "@/components/icons";
import { mergeClasses } from "@/utilities";
import type { JSX } from "solid-js";

type EmptyStateProperties = {
  icon: string | JSX.Element;
  title: string;
  message: string;
  class?: string;
};

/**
 * Centred empty state with icon, title, and supporting message.
 */
export const EmptyState = (properties: EmptyStateProperties) => {
  return (
    <div class={mergeClasses("flex w-full flex-col items-center justify-center p-16 text-center", properties.class)}>
      {typeof properties.icon === "string" ? (
        <Icon name={properties.icon} size={52} class="mb-5 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      ) : (
        <span class="mb-5 inline-flex shrink-0 items-center justify-center text-gray-400 dark:text-gray-500" style={{ width: "52px", height: "52px" }} aria-hidden="true">
          {properties.icon}
        </span>
      )}
      <p class="mb-2 w-full text-sm font-medium text-gray-700 dark:text-gray-200">{properties.title}</p>
      <p class="w-full text-sm text-gray-500 dark:text-gray-400">{properties.message}</p>
    </div>
  );
};
