import { RenderIcon } from "@/components/icons";
import { Text } from "@/components/typography";
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
      <RenderIcon icon={properties.icon} size={52} class="mb-5 text-gray-400 dark:text-gray-500" />
      <Text as="p" size="small" weight="normal" color="secondary" align="center" display="block" class="mb-2 w-full">
        {properties.title}
      </Text>
      <Text as="p" size="small" color="muted" align="center" display="block" class="w-full">
        {properties.message}
      </Text>
    </div>
  );
};
