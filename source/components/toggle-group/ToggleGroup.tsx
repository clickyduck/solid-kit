import { FORM_CONTROL_HINT_CLASS, FORM_CONTROL_LABEL_CLASS, mergeClasses } from "@/utilities";
import { For, Show } from "solid-js";

const TOGGLE_INPUT_CLASS = "mt-0.5 h-4 w-4 shrink-0 accent-blue-600 dark:accent-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-1";

export type ToggleGroupOption = {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
};

type ToggleGroupBase = {
  name: string;
  options: ToggleGroupOption[];
  disabled?: boolean;
  class?: string;
};

export type ToggleGroupProperties = ToggleGroupBase &
  (
    | {
        selectionMode: "single";
        value?: string;
        onChange?: (value: string) => void;
      }
    | {
        selectionMode: "multiple";
        value?: string[];
        onChange?: (value: string[]) => void;
      }
  );

const ToggleGroup = (properties: ToggleGroupProperties) => {
  const isSelected = (optionValue: string): boolean => {
    if (properties.selectionMode === "multiple") {
      return (properties.value ?? []).includes(optionValue);
    }
    return properties.value === optionValue;
  };

  const handleChange = (optionValue: string, checked: boolean) => {
    if (properties.selectionMode === "multiple") {
      const current = properties.value ?? [];
      const next = checked ? (current.includes(optionValue) ? current : [...current, optionValue]) : current.filter((v) => v !== optionValue);
      properties.onChange?.(next);
      return;
    }
    properties.onChange?.(optionValue);
  };

  return (
    <div class={mergeClasses("flex flex-col gap-2", properties.class)}>
      <For each={properties.options}>
        {(option) => {
          const isDisabled = () => properties.disabled || (option.disabled ?? false);
          return (
            <label class={mergeClasses("flex items-start gap-2.5", isDisabled() ? "cursor-not-allowed opacity-60" : "cursor-pointer")}>
              <input
                type={properties.selectionMode === "single" ? "radio" : "checkbox"}
                name={properties.name}
                value={option.value}
                checked={isSelected(option.value)}
                disabled={isDisabled()}
                class={mergeClasses(TOGGLE_INPUT_CLASS, isDisabled() ? "cursor-not-allowed" : "cursor-pointer")}
                onChange={(event) => handleChange(option.value, event.currentTarget.checked)}
              />
              <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                <span class={FORM_CONTROL_LABEL_CLASS}>{option.label}</span>
                <Show when={option.description != null}>
                  <span class={mergeClasses(FORM_CONTROL_HINT_CLASS, "mt-0")}>{option.description}</span>
                </Show>
              </span>
            </label>
          );
        }}
      </For>
    </div>
  );
};

export { ToggleGroup };
