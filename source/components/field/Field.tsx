import { Text } from "@/components/typography";
import { mergeClasses } from "@/utilities";
import type { JSX, ParentComponent } from "solid-js";
import { Show } from "solid-js";

type FieldProperties = {
  label: string;
  /** When omitted, the label is not wired to a single control (for example a radio group). */
  for?: string;
  hint?: string | JSX.Element;
  class?: string;
};

/**
 * Form field wrapper with consistent label spacing and optional hint text.
 */
export const Field: ParentComponent<FieldProperties> = (properties) => {
  return (
    <div class={mergeClasses("space-y-2", properties.class)}>
      <Show
        when={typeof properties.for === "string" && properties.for.length > 0}
        fallback={
          <Text as="div" size="small" weight="normal" color="secondary" display="block">
            {properties.label}
          </Text>
        }
      >
        <label for={properties.for} class="block">
          <Text as="span" size="small" weight="normal" color="secondary" display="block">
            {properties.label}
          </Text>
        </label>
      </Show>
      {properties.children}
      <Show when={properties.hint}>
        <Text size="caption" color="muted" display="block">
          {properties.hint}
        </Text>
      </Show>
    </div>
  );
};
