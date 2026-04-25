import { Icon, type IconComponent } from "@/components/icons";
import { mergeClasses } from "@/utilities";

type EmptyStateProperties = {
  icon: IconComponent;
  title: string;
  message: string;
  class?: string;
};

/**
 * Centred empty state with icon, title, and supporting message.
 */
export const EmptyState = (properties: EmptyStateProperties) => {
  return (
    <div class={mergeClasses("flex w-full flex-col items-center justify-center text-center", properties.class ?? "p-16")}>
      <Icon icon={properties.icon} width={52} height={52} class="mb-5 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      <p class="mb-2 w-full text-sm font-medium text-gray-700 dark:text-gray-200">{properties.title}</p>
      <p class="w-full text-sm text-gray-500 dark:text-gray-400">{properties.message}</p>
    </div>
  );
};
