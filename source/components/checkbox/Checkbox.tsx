import { PRIMARY_LABEL_TEXT_CLASS, SINGLE_CHECKBOX_ROW_MINIMUM_HEIGHT_CLASS } from "@/utilities/controlLayoutClasses";
import { mergeClasses } from "@/utilities/mergeClasses";
import type { ComponentProps, JSX } from "solid-js";
import { splitProps } from "solid-js";

const SINGLE_CHECKBOX_INPUT_CLASS = "h-4 w-4 cursor-pointer rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-0";

export type CheckboxProperties = Omit<ComponentProps<"input">, "type"> & {
  label?: string;
  onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;
};

const Checkbox = (properties: CheckboxProperties) => {
  const [local, rest] = splitProps(properties, ["class", "label", "id", "checked", "disabled", "onInput"]);
  return (
    <label class={mergeClasses("flex items-center gap-3", SINGLE_CHECKBOX_ROW_MINIMUM_HEIGHT_CLASS, (local.disabled ?? false) ? "cursor-not-allowed" : "cursor-pointer")}>
      <input type="checkbox" id={local.id} class={mergeClasses(SINGLE_CHECKBOX_INPUT_CLASS, local.class)} checked={local.checked} disabled={local.disabled} onInput={local.onInput} {...rest} />
      {local.label != null && <span class={mergeClasses("text-gray-300", PRIMARY_LABEL_TEXT_CLASS)}>{local.label}</span>}
    </label>
  );
};

export { Checkbox };
