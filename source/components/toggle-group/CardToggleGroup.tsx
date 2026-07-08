import { Icon } from "@/components/icons";
import { Text } from "@/components/typography";
import { CONTENT_CARD_SURFACE_CLASSES, FORM_CONTROL_ICON_SIZE, SURFACE_RADIUS_COMPACT, mergeClasses } from "@/utilities";
import { For, Show, onMount } from "solid-js";

const CARD_BASE_CLASS = mergeClasses(
  "group block p-3 pr-9 text-left transition-colors duration-100 ease-out hover:border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-500/5 peer-checked:hover:border-blue-600 peer-checked:hover:bg-blue-500/10 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/70 peer-focus-visible:outline-none dark:hover:border-gray-700 dark:peer-checked:border-blue-400 dark:peer-checked:bg-blue-500/10 dark:peer-checked:hover:border-blue-300 dark:peer-checked:hover:bg-blue-500/20",
  CONTENT_CARD_SURFACE_CLASSES,
  SURFACE_RADIUS_COMPACT
);

const CARD_DISABLED_CLASS = "cursor-not-allowed opacity-50 hover:border-gray-200 peer-checked:hover:border-blue-500 peer-checked:hover:bg-blue-500/5 dark:hover:border-gray-800 dark:peer-checked:hover:border-blue-400 dark:peer-checked:hover:bg-blue-500/10";

const HIDDEN_INPUT_CLASS = "peer sr-only";

// Always rendered so it can fade/scale in on selection (driven by the peer input's :checked state)
// rather than mount/unmount. Reveal tier: opacity+scale, 150ms, ease-out; motion-reduce drops the scale.
const CHECK_ICON_CLASS =
  "pointer-events-none absolute top-1/2 right-3 origin-center -translate-y-1/2 scale-75 text-blue-500 opacity-0 transition-[opacity,transform] duration-150 ease-out peer-checked:scale-100 peer-checked:opacity-100 motion-reduce:transition-none motion-reduce:peer-checked:scale-100 dark:text-blue-400";

export type CardToggleGroupOption = {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
};

type CardToggleGroupBase = {
  name: string;
  options: CardToggleGroupOption[];
  disabled?: boolean;
  // "vertical" stacks the options (default); "horizontal" lays them out inline
  // as equal-width columns sharing one row.
  orientation?: "vertical" | "horizontal";
  class?: string;
};

export type CardToggleGroupProperties = CardToggleGroupBase &
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

const CardToggleGroup = (properties: CardToggleGroupProperties) => {
  const isSelected = (optionValue: string): boolean => {
    if (properties.selectionMode === "multiple") {
      return (properties.value ?? []).includes(optionValue);
    }
    return properties.value === optionValue;
  };

  const handleChange = (optionValue: string, checked: boolean) => {
    if (properties.selectionMode === "multiple") {
      const current = properties.value ?? [];
      const next = checked ? (current.includes(optionValue) ? current : [...current, optionValue]) : current.filter((value) => value !== optionValue);
      properties.onChange?.(next);
      return;
    }
    properties.onChange?.(optionValue);
  };

  onMount(() => {
    if (properties.selectionMode !== "single") {
      return;
    }
    // A single-select group defaults to its first SELECTABLE option so the control is never rendered
    // with nothing chosen. Skip disabled options — auto-selecting one would hand the consumer a value
    // the user is not allowed to pick (e.g. a sold-out choice), which then fails downstream.
    const firstSelectableOption = properties.options.find((option) => option.disabled !== true);
    if (firstSelectableOption === undefined) {
      return;
    }
    const valueMatchesAnOption = properties.options.some((option) => option.value === properties.value);
    if (!valueMatchesAnOption) {
      properties.onChange?.(firstSelectableOption.value);
    }
  });

  return (
    <div class={mergeClasses(properties.orientation === "horizontal" ? "grid auto-cols-fr grid-flow-col gap-2" : "flex flex-col gap-2", properties.class)}>
      <For each={properties.options}>
        {(option) => {
          const isDisabled = (): boolean => properties.disabled === true || option.disabled === true;
          return (
            <label class={mergeClasses("relative block", isDisabled() ? "cursor-not-allowed" : "cursor-pointer")}>
              <input
                type={properties.selectionMode === "single" ? "radio" : "checkbox"}
                name={properties.name}
                value={option.value}
                checked={isSelected(option.value)}
                disabled={isDisabled()}
                class={HIDDEN_INPUT_CLASS}
                onChange={(event) => handleChange(option.value, event.currentTarget.checked)}
              />
              <span class={mergeClasses(CARD_BASE_CLASS, isDisabled() ? CARD_DISABLED_CLASS : "")}>
                <span class="flex min-w-0 flex-col gap-0.5">
                  <Text as="span" size="small" weight="normal" color="secondary" display="block">
                    {option.label}
                  </Text>
                  <Show when={option.description != null}>
                    <Text as="span" size="caption" color="muted" display="block">
                      {option.description}
                    </Text>
                  </Show>
                </span>
              </span>
              <Icon name="check" size={FORM_CONTROL_ICON_SIZE} class={CHECK_ICON_CLASS} aria-hidden="true" />
            </label>
          );
        }}
      </For>
    </div>
  );
};

export { CardToggleGroup };
