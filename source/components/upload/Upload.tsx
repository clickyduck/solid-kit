import { Icon, upload } from "@/components/icons";
import { CLICKABLE_COMPONENT_PADDING, INLINE_ICON_START_PADDING_CLASS, PRIMARY_LABEL_TEXT_CLASS } from "@/utilities/controlLayoutClasses";
import { INLINE_ICON_WITHIN_CLICKABLE_CLASS } from "@/utilities/icon";
import { mergeClasses } from "@/utilities/mergeClasses";
import type { JSX } from "solid-js";
import { splitProps } from "solid-js";

const UPLOAD_AUXILIARY_TEXT_CLASS = "text-xs text-gray-500";

const UPLOAD_LINK_ACCENT_TEXT_CLASS = "text-base font-medium text-blue-400 hover:text-blue-300 md:text-sm";

export type UploadProperties = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onInput" | "onChange"> & {
  selectedFiles: File[];
  onSelectedFilesChange: (selectedFiles: File[]) => void;
  class?: string;
};

const getFileCountLabel = (files: File[]): string => {
  const count = files.length;
  if (count === 0) {
    return "No files selected";
  }
  return `${count.toString()} file(s) selected`;
};

export const Upload = (properties: UploadProperties) => {
  const [local, rest] = splitProps(properties, ["selectedFiles", "onSelectedFilesChange", "class", "id", "disabled", "multiple", "accept"]);
  const resolvedId = () => {
    return local.id ?? "upload";
  };

  const handleFileSelection: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    const fileList = event.currentTarget.files;
    if (!fileList || fileList.length === 0) {
      local.onSelectedFilesChange([]);
      return;
    }
    local.onSelectedFilesChange([...fileList]);
  };

  return (
    <div class={mergeClasses("w-full", local.class)}>
      <input id={resolvedId()} type="file" class="sr-only" disabled={local.disabled} multiple={local.multiple} accept={local.accept} onInput={handleFileSelection} {...rest} />
      <label
        for={resolvedId()}
        class={mergeClasses(
          "flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-900/40 text-gray-200 transition-colors duration-150 hover:border-gray-600 hover:bg-gray-900/60",
          CLICKABLE_COMPONENT_PADDING,
          local.disabled ? "cursor-not-allowed opacity-50 hover:border-gray-700 hover:bg-gray-900/40" : ""
        )}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
        }}
      >
        <span class="flex min-w-0 items-center gap-2">
          <Icon icon={upload} class={mergeClasses(INLINE_ICON_WITHIN_CLICKABLE_CLASS, INLINE_ICON_START_PADDING_CLASS)} aria-hidden="true" />
          <span class="flex min-w-0 items-center gap-2">
            <span class={mergeClasses("truncate font-medium text-white", PRIMARY_LABEL_TEXT_CLASS)}>Select files</span>
            <span class={mergeClasses("truncate", UPLOAD_AUXILIARY_TEXT_CLASS)}>{getFileCountLabel(local.selectedFiles)}</span>
          </span>
        </span>
        <span class={mergeClasses("shrink-0", UPLOAD_LINK_ACCENT_TEXT_CLASS)}>Browse</span>
      </label>
    </div>
  );
};
