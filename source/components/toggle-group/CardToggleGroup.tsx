import { Text } from "@/components/typography";
import { CONTENT_CARD_SURFACE_CLASSES, FOCUS_RING_SURFACE_CLASSES, SURFACE_RADIUS_COMPACT, mergeClasses } from "@/utilities";
import { For, Show, onMount } from "solid-js";

// The group is one merged surface: a single outer border + radius on the container, and each option
// is a borderless row inside it. Inner rows draw only a divider between neighbours (top border for
// vertical stacks, left border for horizontal columns) so the cards read as joined, not gapped.
const GROUP_SURFACE_CLASS = mergeClasses("overflow-hidden", CONTENT_CARD_SURFACE_CLASSES, SURFACE_RADIUS_COMPACT);

// Each row. Selection is signalled by the radio/checkbox indicator alone — the surface keeps its
// neutral border/fill when checked, so no `peer-checked:` recolor here. Only a hover wash for
// affordance. The divider between neighbours is added per-orientation below.
const ROW_BASE_CLASS = "group flex items-center gap-3 p-3 text-left transition-colors duration-100 ease-out hover:bg-gray-50 dark:hover:bg-gray-700/25";

const ROW_DISABLED_CLASS = "cursor-not-allowed opacity-50 hover:bg-transparent dark:hover:bg-transparent";

// Divider that fuses adjacent rows. `first:` clears it on the leading row so only the seams show.
const ROW_DIVIDER_VERTICAL_CLASS = "border-t border-gray-200 first:border-t-0 dark:border-gray-800";
const ROW_DIVIDER_HORIZONTAL_CLASS = "border-l border-gray-200 first:border-l-0 dark:border-gray-800";

// Visible radio/checkbox at the end of each row — shared styling with ToggleGroup so the two controls
// match. Shares the surface focus ring and adds a ring offset that separates it from the small box.
const TOGGLE_INPUT_BASE_CLASS = mergeClasses(
  "peer relative m-0 size-5 shrink-0 cursor-[inherit] appearance-none border border-solid border-gray-300 bg-white transition-colors duration-100 ease-out checked:border-transparent checked:bg-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:checked:border-transparent dark:checked:bg-blue-500",
  FOCUS_RING_SURFACE_CLASSES,
  "focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
);

const TOGGLE_INDICATOR_WRAPPER_CLASS = "relative flex h-5 w-5 shrink-0 items-center justify-center";

export type CardToggleGroupOption = {
  label: string;
  value: string;
  description?: string;
  // Optional trailing field rendered to the left of the radio/checkbox (e.g. a price or count).
  amount?: string;
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
    <div class={mergeClasses(GROUP_SURFACE_CLASS, properties.orientation === "horizontal" ? "grid auto-cols-fr grid-flow-col" : "flex flex-col", properties.class)}>
      <For each={properties.options}>
        {(option) => {
          const isDisabled = (): boolean => properties.disabled === true || option.disabled === true;
          const dividerClass = properties.orientation === "horizontal" ? ROW_DIVIDER_HORIZONTAL_CLASS : ROW_DIVIDER_VERTICAL_CLASS;
          return (
            <label class={mergeClasses(ROW_BASE_CLASS, dividerClass, isDisabled() ? ROW_DISABLED_CLASS : "cursor-pointer")}>
              <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                {/* Label at `small` (text-sm) so a card option matches the value text of sibling form
                    controls — typed Input values, Button text, Dropdown selections all render at
                    text-sm. The supporting description sits one tier below at `caption`. */}
                <Text as="span" size="small" weight={isSelected(option.value) ? "medium" : "normal"} color="secondary" display="block">
                  {option.label}
                </Text>
                <Show when={option.description != null}>
                  <Text as="span" size="caption" color="muted" display="block">
                    {option.description}
                  </Text>
                </Show>
              </span>
              <Show when={option.amount != null}>
                <Text as="span" size="small" weight="normal" color="secondary" class="shrink-0">
                  {option.amount}
                </Text>
              </Show>
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
                    class="pointer-events-none absolute top-1/2 left-1/2 size-4 origin-center -translate-1/2 scale-75 text-white opacity-0 transition-[opacity,transform] duration-150 ease-out peer-checked:scale-100 peer-checked:opacity-100 motion-reduce:transition-none motion-reduce:peer-checked:scale-100"
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
                  <span class="pointer-events-none absolute top-1/2 left-1/2 size-2 origin-center -translate-1/2 scale-75 rounded-full bg-white opacity-0 transition-[opacity,transform] duration-150 ease-out peer-checked:scale-100 peer-checked:opacity-100 motion-reduce:transition-none motion-reduce:peer-checked:scale-100" />
                </Show>
              </span>
            </label>
          );
        }}
      </For>
    </div>
  );
};

export { CardToggleGroup };
