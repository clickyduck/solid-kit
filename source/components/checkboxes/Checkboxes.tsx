import { Icon, checkCircle } from "@/components/icons";
import { CHECKBOX_LIST_END_ICON_WRAPPER_CLASS, CHECKBOX_LIST_ROW_PADDING_CLASS, INLINE_ICON_END_PADDING_CLASS, PRIMARY_LABEL_TEXT_CLASS } from "@/utilities/controlLayoutClasses";
import { INLINE_ICON_WITHIN_CLICKABLE_CLASS } from "@/utilities/icon";
import { mergeClasses } from "@/utilities/mergeClasses";
import { For, Show } from "solid-js";

const CHECKBOX_LIST_ROW_INPUT_BASE_CLASS = "h-4 w-4 cursor-pointer rounded border-gray-600 bg-gray-700 focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-0";

export type CheckboxOption = {
  label: string;
  value: string;
  description?: string;
};

export type CheckboxesProperties = {
  options: CheckboxOption[];
  values: string[];
  onChange: (values: string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  emptyMessage?: string;
  useEndCheckMarkForMultiple?: boolean;
  class?: string;
};

export const Checkboxes = (properties: CheckboxesProperties) => {
  const isMultiple = () => {
    return properties.multiple ?? true;
  };
  const useEndCheckMarkForMultiple = () => {
    return properties.useEndCheckMarkForMultiple ?? false;
  };

  const toggleOption = (value: string) => {
    if (properties.disabled) {
      return;
    }
    const currentValues = properties.values;
    const newValues = currentValues.includes(value) ? currentValues.filter((existingValue) => existingValue !== value) : [...currentValues, value];
    properties.onChange(newValues);
  };

  return (
    <Show when={properties.options.length > 0} fallback={<div class={mergeClasses(PRIMARY_LABEL_TEXT_CLASS, "text-gray-400")}>{properties.emptyMessage ?? "No options available."}</div>}>
      <div
        class={mergeClasses("rounded-lg border border-gray-700 bg-gray-800/50 p-2 transition-colors duration-150", properties.disabled ? "cursor-not-allowed opacity-70" : "", properties.class)}
        role="listbox"
        aria-multiselectable={isMultiple()}
        aria-disabled={properties.disabled}
      >
        <For each={properties.options}>
          {(option) => {
            const isSelected = () => {
              return properties.values.includes(option.value);
            };
            return (
              <label
                class={mergeClasses(
                  "flex items-center gap-3 rounded whitespace-nowrap transition-colors",
                  CHECKBOX_LIST_ROW_PADDING_CLASS,
                  PRIMARY_LABEL_TEXT_CLASS,
                  isMultiple() ? "text-white" : isSelected() ? "bg-blue-600/20" : "text-white",
                  !properties.disabled ? "cursor-pointer hover:bg-gray-700/60 hover:text-white" : "cursor-default"
                )}
                role="option"
                aria-selected={isSelected()}
                onClick={
                  isMultiple()
                    ? useEndCheckMarkForMultiple()
                      ? () => {
                          toggleOption(option.value);
                        }
                      : undefined
                    : () => {
                        toggleOption(option.value);
                      }
                }
              >
                <Show when={isMultiple() && !useEndCheckMarkForMultiple()}>
                  <input
                    type="checkbox"
                    checked={isSelected()}
                    onChange={() => {
                      toggleOption(option.value);
                    }}
                    disabled={properties.disabled}
                    class={mergeClasses(CHECKBOX_LIST_ROW_INPUT_BASE_CLASS, isSelected() ? "border-blue-500 bg-blue-600/20 text-blue-300" : "bg-gray-600 text-blue-600")}
                  />
                </Show>

                <span class="min-w-0 flex-1">
                  <span class="font-medium">{option.label}</span>
                  {option.description && <span class={mergeClasses("ml-2", isMultiple() ? "text-gray-500" : isSelected() ? "text-blue-200" : "text-gray-500")}>{option.description}</span>}
                </span>

                <Show when={isMultiple() && useEndCheckMarkForMultiple()}>
                  <span class={mergeClasses("flex shrink-0 items-center justify-center", CHECKBOX_LIST_END_ICON_WRAPPER_CLASS)}>
                    {/* Kept in DOM to prevent layout shift when selection changes. */}
                    <Icon icon={checkCircle} class={mergeClasses(INLINE_ICON_WITHIN_CLICKABLE_CLASS, INLINE_ICON_END_PADDING_CLASS, "text-blue-300")} style={{ opacity: isSelected() ? "1" : "0" }} aria-hidden="true" />
                  </span>
                </Show>
              </label>
            );
          }}
        </For>
      </div>
    </Show>
  );
};
