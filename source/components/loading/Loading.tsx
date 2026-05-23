import { Spinner } from "@/components/spinner/Spinner";
import { Text } from "@/components/typography";
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
      <Text as="div" size="small" color="muted" display="block">
        {properties.message}
      </Text>
    </div>
  );
};
