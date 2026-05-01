import { mergeClasses } from "@/utilities";
import type { ComponentProps, ParentComponent } from "solid-js";
import { splitProps } from "solid-js";

type SectionHeadingProperties = ComponentProps<"h3">;

/**
 * Standardised section label for pages and dialogs.
 */
export const SectionHeading: ParentComponent<SectionHeadingProperties> = (properties) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <h3 class={mergeClasses("text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400", local.class)} {...rest} />;
};

export type { SectionHeadingProperties };
