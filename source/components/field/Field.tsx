import { FORM_CONTROL_HINT_CLASS, FORM_CONTROL_LABEL_CLASS, mergeClasses } from "@/utilities";
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
      {typeof properties.for === "string" && properties.for.length > 0 ? (
        <label for={properties.for} class={FORM_CONTROL_LABEL_CLASS}>
          {properties.label}
        </label>
      ) : (
        <div class={FORM_CONTROL_LABEL_CLASS}>{properties.label}</div>
      )}
      {properties.children}
      <Show when={properties.hint}>
        <div class={FORM_CONTROL_HINT_CLASS}>{properties.hint}</div>
      </Show>
    </div>
  );
};
