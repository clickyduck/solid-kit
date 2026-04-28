import { Icon, upload } from "@/components/icons";
import { FORM_CONTROL_AUXILIARY_TEXT_CLASS, FORM_CONTROL_ICON_SIZE, FORM_CONTROL_LINK_ACCENT_TEXT_CLASS, FORM_CONTROL_SIZE_CLASSES, FORM_CONTROL_TEXT_CLASS_BY_SIZE, mergeClasses, useEffectiveFormControlSize } from "@/utilities";
import type { JSX } from "solid-js";
import { splitProps } from "solid-js";

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
  const resolvedId = () => local.id ?? "upload";
  const effectiveSize = useEffectiveFormControlSize();

  const handleFileSelection: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    const fileList = event.currentTarget.files;
    if (!fileList || fileList.length === 0) {
      local.onSelectedFilesChange([]);
      return;
    }
    local.onSelectedFilesChange(local.multiple ? [...fileList] : [fileList[0]]);
  };

  return (
    <div class={mergeClasses("w-full has-focus-visible:[&_label]:border-blue-500 dark:has-focus-visible:[&_label]:border-blue-400", local.class)}>
      <input id={resolvedId()} type="file" class="sr-only" disabled={local.disabled} multiple={local.multiple} accept={local.accept} onInput={handleFileSelection} {...rest} />
      <label
        for={resolvedId()}
        class={mergeClasses(
          "flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-solid border-gray-300 bg-gray-50 text-gray-700 transition-colors duration-150 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-900/60",
          FORM_CONTROL_SIZE_CLASSES[effectiveSize()],
          local.disabled ? "cursor-not-allowed opacity-50 hover:border-gray-300 hover:bg-gray-50 dark:hover:border-gray-700 dark:hover:bg-gray-900/40" : ""
        )}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          if (local.disabled) {
            return;
          }
          const fileList = event.dataTransfer?.files;
          if (!fileList || fileList.length === 0) {
            local.onSelectedFilesChange([]);
            return;
          }
          local.onSelectedFilesChange(local.multiple ? [...fileList] : [fileList[0]]);
        }}
      >
        <span class="flex min-w-0 items-center gap-2">
          <Icon icon={upload} width={FORM_CONTROL_ICON_SIZE[effectiveSize()]} height={FORM_CONTROL_ICON_SIZE[effectiveSize()]} aria-hidden="true" />
          <span class="flex min-w-0 items-center gap-2">
            <span class={mergeClasses("truncate font-medium text-gray-900 dark:text-white", FORM_CONTROL_TEXT_CLASS_BY_SIZE[effectiveSize()])}>Select files</span>
            <span class={mergeClasses("truncate", FORM_CONTROL_AUXILIARY_TEXT_CLASS)}>{getFileCountLabel(local.selectedFiles)}</span>
          </span>
        </span>
        <span class={mergeClasses("shrink-0", FORM_CONTROL_LINK_ACCENT_TEXT_CLASS)}>Browse</span>
      </label>
    </div>
  );
};
