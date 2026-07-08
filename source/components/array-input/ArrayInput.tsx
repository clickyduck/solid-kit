import { Badge } from "@/components/badge";
import { type Color, createEnterReveal, mergeClasses } from "@/utilities";
import type { JSX } from "solid-js";
import { For, createSignal, splitProps } from "solid-js";

export type ArrayInputProperties = {
  // Controlled list of committed string values. Render the chips from this and call onChange with
  // the next array on every add/remove — the component holds no value state of its own, only the
  // in-progress text of the field that hasn't been committed yet.
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  // Reject commits past this many values. Omit for unbounded.
  maximum?: number;
  // Chip colour, forwarded to Badge. Defaults to neutral.
  color?: Color;
  class?: string;
  id?: string;
};

const CONTAINER_CLASSES =
  "flex w-full flex-wrap items-center gap-1.5 rounded-lg border border-solid border-gray-300 bg-white px-2.5 py-1.5 text-sm transition-colors duration-100 ease-out focus-within:border-blue-500 dark:border-gray-700 dark:bg-gray-800/50 dark:focus-within:border-blue-400";

export const ArrayInput = (properties: ArrayInputProperties): JSX.Element => {
  const [local] = splitProps(properties, ["value", "onChange", "placeholder", "disabled", "maximum", "color", "class", "id"]);
  const [draft, setDraft] = createSignal("");

  // Commit the in-progress text as a new chip. Trim, drop empties, and reject case-insensitive
  // duplicates so the same tag can't be added twice under different casing. The cap is enforced
  // here rather than disabling the field so a paste/Enter past the limit is simply ignored.
  const commitDraft = (): void => {
    const trimmed = draft().trim();
    if (trimmed === "") {
      return;
    }
    if (local.maximum !== undefined && local.value.length >= local.maximum) {
      return;
    }
    const alreadyPresent = local.value.some((existing) => {
      return existing.toLowerCase() === trimmed.toLowerCase();
    });
    if (alreadyPresent) {
      setDraft("");
      return;
    }
    local.onChange([...local.value, trimmed]);
    setDraft("");
  };

  const removeAt = (index: number): void => {
    local.onChange(
      local.value.filter((_, currentIndex) => {
        return currentIndex !== index;
      })
    );
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft();
      return;
    }
    // Backspace on an empty field removes the last chip, matching the common token-input idiom.
    if (event.key === "Backspace" && draft() === "" && local.value.length > 0) {
      removeAt(local.value.length - 1);
    }
  };

  return (
    <div class={mergeClasses(CONTAINER_CLASSES, local.disabled ? "cursor-not-allowed opacity-50" : "", local.class)}>
      <For each={local.value}>
        {(item, index) => {
          // Fade + scale each chip in as it is added. Enter-only: `value` is a controlled
          // prop we don't own, so a removed chip can't be held for an exit transition.
          const entered = createEnterReveal();
          return (
            <Badge
              variant="outline"
              color={local.color ?? "neutral"}
              class={mergeClasses("origin-left transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none", entered() ? "scale-100 opacity-100" : "scale-95 opacity-0 motion-reduce:scale-100")}
              onRemove={
                local.disabled
                  ? undefined
                  : () => {
                      removeAt(index());
                    }
              }
            >
              {item}
            </Badge>
          );
        }}
      </For>
      <input
        id={local.id}
        type="text"
        class="min-w-24 flex-1 border-0 bg-transparent p-0 text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none disabled:cursor-not-allowed dark:text-white dark:placeholder-gray-500"
        placeholder={local.placeholder}
        disabled={local.disabled}
        autocomplete="off"
        value={draft()}
        onInput={(event) => {
          setDraft(event.currentTarget.value);
        }}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
      />
    </div>
  );
};
