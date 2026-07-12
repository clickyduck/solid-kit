import { Text } from "@/components/typography";
import { FOCUS_RING_SURFACE_CLASSES, mergeClasses } from "@/utilities";
import { For, Show, onMount } from "solid-js";

// Shares the surface focus ring with DataCard/CardToggleGroup; adds the ring offset that separates
// the ring from the small check/radio box.
const TOGGLE_INPUT_BASE_CLASS = mergeClasses(
  "peer absolute inset-0 m-0 h-full w-full cursor-[inherit] appearance-none border border-solid border-gray-300 bg-white transition-colors duration-100 ease-out checked:border-transparent checked:bg-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:checked:border-transparent dark:checked:bg-blue-500",
  FOCUS_RING_SURFACE_CLASSES,
  "focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
);

const TOGGLE_INDICATOR_WRAPPER_CLASS = "relative h-5 w-5 shrink-0";

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
            <label class={mergeClasses("flex items-start gap-2.5 py-1", isDisabled() ? "cursor-not-allowed opacity-50" : "cursor-pointer")}>
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
                  {/* Indicator scales/fades in on check at the 150ms reveal tier; centering translate is kept
                      constant so only opacity+scale animate. motion-reduce drops the scale to a plain fade. */}
                  <svg
                    class="pointer-events-none absolute top-1/2 left-1/2 h-4 w-4 origin-center -translate-x-1/2 -translate-y-1/2 scale-75 text-white opacity-0 transition-[opacity,transform] duration-150 ease-out peer-checked:scale-100 peer-checked:opacity-100 motion-reduce:transition-none motion-reduce:peer-checked:scale-100"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m5 12.5 4.5 4.5L19 7" />
                  </svg>
                </Show>
                <Show when={properties.selectionMode === "single"}>
                  <span class="pointer-events-none absolute top-1/2 left-1/2 h-2 w-2 origin-center -translate-x-1/2 -translate-y-1/2 scale-75 rounded-full bg-white opacity-0 transition-[opacity,transform] duration-150 ease-out peer-checked:scale-100 peer-checked:opacity-100 motion-reduce:transition-none motion-reduce:peer-checked:scale-100" />
                </Show>
              </span>
              <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                {/* Label at `small` (text-sm) so an option matches the value text of sibling form
                    controls — typed Input values, Button text, Dropdown selections all render at
                    text-sm — and CardToggleGroup; description one tier below at `caption`. */}
                <Text as="span" size="small" weight={isSelected(option.value) ? "medium" : "normal"} color="secondary" display="block">
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
