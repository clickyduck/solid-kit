import { Text } from "@/components/typography";
import type { ComponentProps, ParentComponent } from "solid-js";
import { splitProps } from "solid-js";

type SectionHeadingProperties = ComponentProps<"h3">;

/**
 * Standardised section label for pages and dialogs.
 */
export const SectionHeading: ParentComponent<SectionHeadingProperties> = (properties) => {
  const [local, rest] = splitProps(properties, ["class", "children"]);
  return (
    <Text as="h3" size="body" weight="semibold" transform="uppercase" color="muted" display="block" class={local.class} {...rest}>
      {local.children}
    </Text>
  );
};

export type { SectionHeadingProperties };
