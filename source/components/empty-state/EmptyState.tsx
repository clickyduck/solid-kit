import { RenderIcon } from "@/components/icons";
import { Text } from "@/components/typography";
import { mergeClasses } from "@/utilities";
import type { ComponentProps, JSX } from "solid-js";
import { splitProps } from "solid-js";

// Unclaimed attributes ride through to the root element, so a consumer can attach a `data-testid`,
// an `id`, or an `aria-*` without the component having to know about each one.
type EmptyStateProperties = {
  icon: string | JSX.Element;
  title: string;
  message: string;
  class?: string;
} & Omit<ComponentProps<"div">, "class" | "title">;

/**
 * Centred empty state with icon, title, and supporting message.
 */
export const EmptyState = (properties: EmptyStateProperties) => {
  const [local, rest] = splitProps(properties, ["icon", "title", "message", "class"]);
  return (
    <div class={mergeClasses("flex w-full flex-col items-center justify-center p-16 text-center", local.class)} {...rest}>
      <RenderIcon icon={local.icon} size={52} class="mb-5 text-gray-500 dark:text-gray-400" />
      <Text as="p" size="small" weight="normal" transform="title" color="secondary" align="center" display="block" class="mb-2 w-full">
        {local.title}
      </Text>
      <Text as="p" size="small" color="muted" align="center" display="block" class="w-full">
        {local.message}
      </Text>
    </div>
  );
};
