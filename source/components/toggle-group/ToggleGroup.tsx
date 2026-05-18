import { Icon } from "@/components/icons";
import {
  CHOICE_CONTROL_CHECK_CLASS,
  CHOICE_CONTROL_DESCRIPTION_CLASS,
  CHOICE_CONTROL_FACE_CLASS,
  CHOICE_CONTROL_FACE_DISABLED_CLASS,
  CHOICE_CONTROL_LABEL_CLASS,
  CHOICE_CONTROL_LABEL_HAS_INTERACTION_CLASSES,
  CHOICE_CONTROL_TITLE_CLASS,
  FORM_CONTROL_CHOICE_FACE_SIZE_CLASSES_BY_SIZE,
  FORM_CONTROL_ICON_SIZE,
  mergeClasses
} from "@/utilities";
import { For, Show } from "solid-js";

const CHOICE_INPUT_SR_ONLY_CLASS = "sr-only";

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
  /**
   * When `selectionMode` is `"single"`, if true, clicking the already-selected option clears selection (`onChange(undefined)`).
   * Unused when `selectionMode` is `"multiple"` (empty selection is always valid).
   */
  allowNoSelection?: boolean;
  /**
   * If true, renders native checkbox/radio inputs next to plain labels instead of the card-style face.
   */
  traditional?: boolean;
  class?: string;
};

export type ToggleGroupProperties = ToggleGroupBase &
  (
    | {
        selectionMode: "single";
        value?: string;
        onChange?: (value: string | undefined) => void;
      }
    | {
        selectionMode: "multiple";
        value?: string[];
        onChange?: (value: string[]) => void;
      }
  );

const ToggleGroup = (properties: ToggleGroupProperties) => {
  let skipNextSingleChange = false;

  const selectedValues = (): string[] => {
    if (properties.selectionMode === "multiple") {
      return (properties as Extract<ToggleGroupProperties, { selectionMode: "multiple" }>).value ?? [];
    }
    const v = (properties as Extract<ToggleGroupProperties, { selectionMode: "single" }>).value;
    return v === undefined ? [] : [v];
  };

  const isSelected = (optionValue: string) => {
    return selectedValues().includes(optionValue);
  };

  const handleSingleChange = (optionValue: string) => {
    if (properties.selectionMode !== "single") {
      return;
    }
    if (skipNextSingleChange) {
      skipNextSingleChange = false;
      return;
    }
    (properties as Extract<ToggleGroupProperties, { selectionMode: "single" }>).onChange?.(optionValue);
  };

  const handleSingleSelectedMouseDown = (event: MouseEvent & { currentTarget: HTMLInputElement }, optionValue: string) => {
    if (properties.selectionMode !== "single") {
      return;
    }
    if (!(properties.allowNoSelection ?? false)) {
      return;
    }
    if ((properties as Extract<ToggleGroupProperties, { selectionMode: "single" }>).value !== optionValue) {
      return;
    }
    event.preventDefault();
    skipNextSingleChange = true;
    (properties as Extract<ToggleGroupProperties, { selectionMode: "single" }>).onChange?.(undefined);
  };

  const handleMultipleInput = (optionValue: string, checked: boolean) => {
    if (properties.selectionMode !== "multiple") {
      return;
    }
    const current = (properties as Extract<ToggleGroupProperties, { selectionMode: "multiple" }>).value ?? [];
    const next = checked ? (current.includes(optionValue) ? current : [...current, optionValue]) : current.filter((v) => v !== optionValue);
    (properties as Extract<ToggleGroupProperties, { selectionMode: "multiple" }>).onChange?.(next);
  };

  return (
    <div class={mergeClasses("flex flex-col gap-3", properties.class)}>
      <For each={properties.options}>
        {(option) => {
          const isDisabled = () => properties.disabled || (option.disabled ?? false);
          const selected = () => isSelected(option.value);
          const traditional = () => properties.traditional ?? false;
          const traditionalInputClass = () => mergeClasses("mt-0.5 h-4 w-4 shrink-0 accent-blue-600 dark:accent-blue-500", isDisabled() ? "cursor-not-allowed" : "cursor-pointer");
          const inputClass = () => (traditional() ? traditionalInputClass() : mergeClasses(CHOICE_INPUT_SR_ONLY_CLASS, isDisabled() ? "cursor-not-allowed" : "cursor-pointer"));
          return (
            <label
              class={mergeClasses(
                traditional()
                  ? mergeClasses("flex items-start gap-2.5", isDisabled() ? "cursor-not-allowed opacity-60" : "cursor-pointer")
                  : mergeClasses(CHOICE_CONTROL_LABEL_CLASS, CHOICE_CONTROL_LABEL_HAS_INTERACTION_CLASSES, CHOICE_CONTROL_FACE_DISABLED_CLASS, isDisabled() ? "cursor-not-allowed" : "cursor-pointer transition-opacity duration-150 active:opacity-75")
              )}
            >
              <Show
                when={properties.selectionMode === "multiple"}
                fallback={
                  <input
                    type="radio"
                    name={properties.name}
                    value={option.value}
                    checked={selected()}
                    disabled={isDisabled()}
                    class={inputClass()}
                    onMouseDown={(event) => handleSingleSelectedMouseDown(event, option.value)}
                    onChange={() => handleSingleChange(option.value)}
                  />
                }
              >
                <input
                  type="checkbox"
                  name={properties.name}
                  value={option.value}
                  checked={selected()}
                  disabled={isDisabled()}
                  class={inputClass()}
                  onChange={(event) => handleMultipleInput(option.value, event.currentTarget.checked)}
                />
              </Show>
              <Show
                when={traditional()}
                fallback={
                  <span class={mergeClasses(CHOICE_CONTROL_FACE_CLASS, FORM_CONTROL_CHOICE_FACE_SIZE_CLASSES_BY_SIZE)}>
                    <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span class={CHOICE_CONTROL_TITLE_CLASS}>{option.label}</span>
                      <Show when={option.description != null}>
                        <span class={CHOICE_CONTROL_DESCRIPTION_CLASS}>{option.description}</span>
                      </Show>
                    </span>
                    <Icon name="check_circle" size={FORM_CONTROL_ICON_SIZE} class={CHOICE_CONTROL_CHECK_CLASS} aria-hidden="true" />
                  </span>
                }
              >
                <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span class={CHOICE_CONTROL_TITLE_CLASS}>{option.label}</span>
                  <Show when={option.description != null}>
                    <span class={CHOICE_CONTROL_DESCRIPTION_CLASS}>{option.description}</span>
                  </Show>
                </span>
              </Show>
            </label>
          );
        }}
      </For>
    </div>
  );
};

export { ToggleGroup };
