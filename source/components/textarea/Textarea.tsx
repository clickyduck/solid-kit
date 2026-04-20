import { TEXTAREA_CLASSES, mergeClasses } from "@/utilities";
import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

type ResizeOption = "none" | "vertical" | "horizontal" | "both";

const TEXTAREA_LINE_HEIGHT_REM = 1.5;

const RESIZE_CLASS: Record<ResizeOption, string> = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize"
};

type TextareaProperties = ComponentProps<"textarea"> & {
  class?: string;
  resize?: ResizeOption;
  autoGrow?: boolean;
  minRows?: number;
  maxRows?: number;
};

const adjustAutoGrowHeight = (element: HTMLTextAreaElement, minRows: number, maxRows: number): void => {
  element.style.height = "auto";
  const lineHeightRem = TEXTAREA_LINE_HEIGHT_REM;
  const minHeightRem = minRows * lineHeightRem;
  const maxHeightRem = maxRows * lineHeightRem;
  const scrollHeightPx = element.scrollHeight;
  const scrollHeightRem = scrollHeightPx / 16;
  const clampedRem = Math.min(maxHeightRem, Math.max(minHeightRem, scrollHeightRem));
  element.style.height = `${clampedRem}rem`;
};

/**
 * Textarea matching Input visual style. Supports resize behaviour and auto-grow height.
 */
export const Textarea = (properties: TextareaProperties) => {
  const [local, rest] = splitProps(properties, ["class", "resize", "autoGrow", "minRows", "maxRows", "ref", "onInput", "rows"]);
  const resizeClass = () => {
    return local.resize !== undefined ? RESIZE_CLASS[local.resize] : "";
  };
  const minRows = () => {
    return local.minRows ?? 1;
  };
  const maxRows = () => {
    return local.maxRows ?? 8;
  };

  const handleInput = (event: InputEvent & { currentTarget: HTMLTextAreaElement; target: HTMLTextAreaElement }): void => {
    const element = event.currentTarget;
    if (local.autoGrow) {
      adjustAutoGrowHeight(element, minRows(), maxRows());
    }
    const userOnInput = local.onInput;
    if (typeof userOnInput === "function") {
      userOnInput(event);
    } else if (Array.isArray(userOnInput)) {
      const [handler, data] = userOnInput;
      handler(data, event);
    }
  };

  const handleRef = (element: HTMLTextAreaElement): void => {
    if (local.autoGrow) {
      adjustAutoGrowHeight(element, minRows(), maxRows());
    }
    const reference = local.ref;
    if (typeof reference === "function") {
      reference(element);
    } else if (reference !== undefined && reference !== null) {
      (reference as { current?: HTMLTextAreaElement }).current = element;
    }
  };

  return (
    <textarea
      ref={local.autoGrow ? handleRef : local.ref}
      rows={local.autoGrow ? minRows() : local.rows}
      class={mergeClasses(
        "block w-full rounded-lg border border-solid border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors duration-150 focus:border-blue-500 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400",
        TEXTAREA_CLASSES,
        local.autoGrow && "overflow-hidden",
        resizeClass(),
        local.class
      )}
      onInput={local.autoGrow ? handleInput : local.onInput}
      {...rest}
    />
  );
};
