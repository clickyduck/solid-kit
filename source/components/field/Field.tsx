import type { JSX, ParentComponent } from "solid-js";
import { Show } from "solid-js";

const FIELD_HINT_CLASS = "text-xs text-gray-400";

const FIELD_LABEL_CLASS = "block text-sm font-medium text-gray-300";

type FieldProperties = {
  label: string;
  for: string;
  hint?: string | JSX.Element;
  class?: string;
};

/**
 * Form field wrapper with consistent label spacing and optional hint text.
 */
export const Field: ParentComponent<FieldProperties> = (properties) => {
  return (
    <div class={`space-y-2 ${properties.class ?? ""}`.trim()}>
      <label for={properties.for} class={FIELD_LABEL_CLASS}>
        {properties.label}
      </label>
      {properties.children}
      <Show when={properties.hint}>
        <div class={FIELD_HINT_CLASS}>{properties.hint}</div>
      </Show>
    </div>
  );
};
