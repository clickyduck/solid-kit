import { Text } from "@/components/typography";
import { mergeClasses } from "@/utilities";
import { For, Show, onMount } from "solid-js";

const TOGGLE_INPUT_BASE_CLASS =
  "peer absolute inset-0 m-0 h-full w-full cursor-[inherit] appearance-none border border-solid border-gray-300 bg-white transition-colors duration-100 ease-out checked:border-transparent checked:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-700 dark:checked:border-transparent dark:checked:bg-blue-500 dark:focus-visible:ring-offset-gray-900";

const TOGGLE_INDICATOR_WRAPPER_CLASS = "relative mt-0.5 h-4 w-4 shrink-0";

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

  onMount(() => {
    if (properties.selectionMode !== "single") {
      return;
    }
    const firstOption = properties.options[0];
    if (firstOption === undefined) {
      return;
    }
    const valueMatchesAnOption = properties.options.some((option) => option.value === properties.value);
    if (!valueMatchesAnOption) {
      properties.onChange?.(firstOption.value);
    }
  });

  return (
    <div class={mergeClasses("flex flex-col gap-2", properties.class)}>
      <For each={properties.options}>
        {(option) => {
          const isDisabled = () => properties.disabled || (option.disabled ?? false);
          return (
            <label class={mergeClasses("flex items-start gap-2.5", isDisabled() ? "cursor-not-allowed opacity-60" : "cursor-pointer")}>
              <span class={TOGGLE_INDICATOR_WRAPPER_CLASS}>
                <input
                  type={properties.selectionMode === "single" ? "radio" : "checkbox"}
                  name={properties.name}
                  value={option.value}
                  checked={isSelected(option.value)}
                  disabled={isDisabled()}
                  class={mergeClasses(TOGGLE_INPUT_BASE_CLASS, properties.selectionMode === "single" ? "rounded-full" : "rounded-sm")}
                  onChange={(event) => handleChange(option.value, event.currentTarget.checked)}
                />
                <Show when={properties.selectionMode === "multiple"}>
                  <svg class="pointer-events-none absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                    <path d="m382-354 339-339q12-12 28-12t28 12q12 12 12 28.5T777-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z" />
                  </svg>
                </Show>
                <Show when={properties.selectionMode === "single"}>
                  <span class="pointer-events-none absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
                </Show>
              </span>
              <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                <Text as="span" size="small" weight="normal" color="secondary" display="block">
                  {option.label}
                </Text>
                <Show when={option.description != null}>
                  <Text as="span" size="caption" color="muted" display="block">
                    {option.description}
                  </Text>
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
