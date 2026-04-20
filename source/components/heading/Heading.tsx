import { mergeClasses } from "@/utilities";
import type { ComponentProps, ParentComponent } from "solid-js";
import { splitProps } from "solid-js";

type HeadingProperties = ComponentProps<"h3"> & {
  class?: string;
};

/**
 * Standardised section heading for pages and dialogs.
 */
export const Heading: ParentComponent<HeadingProperties> = (properties) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <h3 class={mergeClasses("text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400", local.class)} {...rest} />;
};
