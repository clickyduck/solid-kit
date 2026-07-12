import { IconButton } from "@/components/icon-button/IconButton";
import { Icon } from "@/components/icons";
import { Text } from "@/components/typography";
import { CONTENT_CARD_SURFACE_CLASSES, FORM_CONTROL_ICON_SIZE, FORM_CONTROL_LINK_ACCENT_TEXT_CLASS, FORM_CONTROL_SIZE_CLASSES, createEnterReveal, mergeClasses } from "@/utilities";
import type { JSX } from "solid-js";
import { For, Show, createEffect, createMemo, createSignal, onCleanup, splitProps } from "solid-js";

let uploadIdCounter = 0;

export type UploadRejectionReason = "accept" | "maxSize" | "multiple";

export type UploadProperties = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onInput" | "onChange" | "class"> & {
  class?: string;
  selectedFiles: File[];
  onSelectedFilesChange: (selectedFiles: File[]) => void;
  /** Called when one or more files are rejected by `accept` / `maxSizeBytes` / single-mode overflow. */
  onReject?: (rejectedFiles: File[], reason: UploadRejectionReason) => void;
  /** Per-file maximum size in bytes. Rejected files trigger onReject with reason "maxSize". */
  maxSizeBytes?: number;
  /** Optional helper text below the drop zone (e.g. "PNG, JPG, PDF"). If omitted and `accept` is set, the accept value is shown. */
  acceptHint?: string;
  /** Optional upload progress per file, keyed by `${file.name}:${file.size}`. Values are 0–100. */
  progressByFile?: Record<string, number>;
  /** When true, image files render a thumbnail preview. Defaults to true. */
  showImagePreviews?: boolean;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(kilobytes < 10 ? 1 : 0)} KB`;
  }
  const megabytes = kilobytes / 1024;
  if (megabytes < 1024) {
    return `${megabytes.toFixed(megabytes < 10 ? 1 : 0)} MB`;
  }
  const gigabytes = megabytes / 1024;
  return `${gigabytes.toFixed(gigabytes < 10 ? 1 : 0)} GB`;
};

const getFileCountLabel = (count: number): string => {
  if (count === 1) {
    return "1 file selected";
  }
  return `${count.toString()} files selected`;
};

const getFileKey = (file: File): string => `${file.name}:${file.size.toString()}`;

const isImageFile = (file: File): boolean => file.type.startsWith("image/");

export const Upload = (properties: UploadProperties) => {
  const [local, rest] = splitProps(properties, ["class", "selectedFiles", "onSelectedFilesChange", "onReject", "maxSizeBytes", "acceptHint", "progressByFile", "showImagePreviews", "id", "disabled", "multiple", "accept"]);
  const resolvedId = local.id ?? `upload-${(uploadIdCounter++).toString()}`;
  const [isDragOver, setIsDragOver] = createSignal(false);
  const [previewUrlByKey, setPreviewUrlByKey] = createSignal<Record<string, string>>({});
  let fileInputElement: HTMLInputElement | undefined;

  const openFilePicker = (): void => {
    if (local.disabled) return;
    fileInputElement?.click();
  };

  const previewsEnabled = (): boolean => local.showImagePreviews !== false;

  const acceptTokens = createMemo<string[]>(() => {
    const acceptValue = local.accept;
    if (typeof acceptValue !== "string" || acceptValue.trim().length === 0) {
      return [];
    }
    return acceptValue
      .split(",")
      .map((token) => token.trim().toLowerCase())
      .filter((token) => token.length > 0);
  });

  const matchesAccept = (file: File): boolean => {
    const tokens = acceptTokens();
    if (tokens.length === 0) {
      return true;
    }
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    return tokens.some((token) => {
      if (token.startsWith(".")) {
        return fileName.endsWith(token);
      }
      if (token.endsWith("/*")) {
        const prefix = token.slice(0, token.length - 1);
        return fileType.startsWith(prefix);
      }
      return fileType === token;
    });
  };

  const withinSizeLimit = (file: File): boolean => {
    if (local.maxSizeBytes === undefined) {
      return true;
    }
    return file.size <= local.maxSizeBytes;
  };

  const partitionFiles = (files: File[]): { accepted: File[]; rejectedByAccept: File[]; rejectedBySize: File[] } => {
    const accepted: File[] = [];
    const rejectedByAccept: File[] = [];
    const rejectedBySize: File[] = [];
    for (const file of files) {
      if (!matchesAccept(file)) {
        rejectedByAccept.push(file);
        continue;
      }
      if (!withinSizeLimit(file)) {
        rejectedBySize.push(file);
        continue;
      }
      accepted.push(file);
    }
    return { accepted, rejectedByAccept, rejectedBySize };
  };

  const commitFiles = (incomingFiles: File[]): void => {
    const { accepted, rejectedByAccept, rejectedBySize } = partitionFiles(incomingFiles);
    if (rejectedByAccept.length > 0) {
      local.onReject?.(rejectedByAccept, "accept");
    }
    if (rejectedBySize.length > 0) {
      local.onReject?.(rejectedBySize, "maxSize");
    }
    if (accepted.length === 0) {
      return;
    }
    if (local.multiple) {
      const existingKeys = new Set(local.selectedFiles.map(getFileKey));
      const additions = accepted.filter((file) => !existingKeys.has(getFileKey(file)));
      if (additions.length === 0) {
        return;
      }
      local.onSelectedFilesChange([...local.selectedFiles, ...additions]);
      return;
    }
    if (accepted.length > 1) {
      local.onReject?.(accepted.slice(1), "multiple");
    }
    local.onSelectedFilesChange([accepted[0]]);
  };

  const handleFileSelection: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
    const fileList = event.currentTarget.files;
    if (!fileList || fileList.length === 0) {
      // Native cancel produces an empty FileList; do not clear the existing selection.
      return;
    }
    commitFiles([...fileList]);
    event.currentTarget.value = "";
  };

  const removeFile = (key: string): void => {
    const next = local.selectedFiles.filter((file) => getFileKey(file) !== key);
    local.onSelectedFilesChange(next);
  };

  const getPreviewUrl = (file: File): string | undefined => previewUrlByKey()[getFileKey(file)];

  createEffect(() => {
    const imageFiles = local.selectedFiles.filter(isImageFile);
    const activeKeys = new Set(imageFiles.map(getFileKey));
    setPreviewUrlByKey((previous) => {
      const next: Record<string, string> = {};
      let mutated = false;
      for (const [key, url] of Object.entries(previous)) {
        if (activeKeys.has(key)) {
          next[key] = url;
        } else {
          URL.revokeObjectURL(url);
          mutated = true;
        }
      }
      for (const file of imageFiles) {
        const key = getFileKey(file);
        if (next[key] === undefined) {
          next[key] = URL.createObjectURL(file);
          mutated = true;
        }
      }
      return mutated ? next : previous;
    });
  });

  onCleanup(() => {
    for (const url of Object.values(previewUrlByKey())) {
      URL.revokeObjectURL(url);
    }
  });

  const helperText = (): string | undefined => {
    if (typeof local.acceptHint === "string") {
      return local.acceptHint.length > 0 ? local.acceptHint : undefined;
    }
    const tokens = acceptTokens();
    if (tokens.length === 0 && local.maxSizeBytes === undefined) {
      return undefined;
    }
    const tokenLabel = tokens.length > 0 ? tokens.join(", ") : undefined;
    const sizeLabel = local.maxSizeBytes !== undefined ? `up to ${formatFileSize(local.maxSizeBytes)}` : undefined;
    return [tokenLabel, sizeLabel].filter((part): part is string => part !== undefined).join(" · ");
  };

  const dropZoneClass = (): string => {
    const hasFiles = local.selectedFiles.length > 0;
    return mergeClasses(
      "flex w-full items-center gap-3 rounded-lg border bg-gray-50 text-gray-700 transition-colors duration-100 ease-out dark:bg-gray-900/40 dark:text-gray-200",
      hasFiles ? mergeClasses("justify-between border-solid border-gray-300 dark:border-gray-700", FORM_CONTROL_SIZE_CLASSES) : "flex-col justify-center border-2 border-dashed border-gray-300 px-4 py-6 text-center dark:border-gray-700",
      local.disabled
        ? "cursor-not-allowed opacity-50"
        : mergeClasses("cursor-pointer", isDragOver() ? "border-blue-500 bg-blue-500/5 dark:border-blue-400 dark:bg-blue-500/10" : "hover:border-gray-400 hover:bg-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-900/60")
    );
  };

  const handleDragOver = (event: DragEvent): void => {
    event.preventDefault();
    if (local.disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (event: DragEvent): void => {
    const related = event.relatedTarget as Node | null;
    if (related && event.currentTarget instanceof Node && event.currentTarget.contains(related)) {
      return;
    }
    setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent): void => {
    event.preventDefault();
    setIsDragOver(false);
    if (local.disabled) return;
    const fileList = event.dataTransfer?.files;
    if (!fileList || fileList.length === 0) return;
    commitFiles([...fileList]);
  };

  return (
    <div class={mergeClasses("w-full has-focus-visible:[&_div[role=button]]:border-blue-500 dark:has-focus-visible:[&_div[role=button]]:border-blue-400", local.class)}>
      <input
        ref={(element) => {
          fileInputElement = element;
        }}
        id={resolvedId}
        type="file"
        class="sr-only"
        disabled={local.disabled}
        multiple={local.multiple}
        accept={local.accept}
        onChange={handleFileSelection}
        {...rest}
      />
      <div
        role="button"
        tabIndex={local.disabled ? -1 : 0}
        aria-disabled={local.disabled}
        class={dropZoneClass()}
        onClick={openFilePicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFilePicker();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Show
          when={local.selectedFiles.length > 0}
          fallback={
            <>
              <Icon name="cloud_upload" size={24} class="text-gray-500 dark:text-gray-400" aria-hidden="true" />
              <span class="flex flex-col items-center gap-0.5">
                <Text as="span" size="small" weight="normal" color="default" display="block">
                  {isDragOver() ? "Drop to upload" : "Drop files here or click to browse"}
                </Text>
                <Show when={helperText() !== undefined}>
                  <Text as="span" size="caption" color="muted" display="block">
                    {helperText()}
                  </Text>
                </Show>
              </span>
            </>
          }
        >
          <span class="flex min-w-0 items-center gap-2">
            <Icon name="upload" size={FORM_CONTROL_ICON_SIZE} aria-hidden="true" />
            <span class="flex min-w-0 items-center gap-2">
              <Text as="span" size="small" weight="normal" color="default" display="inline" truncate class="min-w-0">
                {local.multiple ? "Add more files" : "Replace file"}
              </Text>
              <Text as="span" size="caption" color="muted" display="inline" truncate class="min-w-0">
                {getFileCountLabel(local.selectedFiles.length)}
              </Text>
            </span>
          </span>
          <Text as="span" weight="normal" color="inherit" display="inline" class={mergeClasses("shrink-0", FORM_CONTROL_LINK_ACCENT_TEXT_CLASS)}>
            Browse
          </Text>
        </Show>
      </div>
      <Show when={local.selectedFiles.length > 0}>
        <ul class="mt-2 space-y-1">
          <For each={local.selectedFiles}>
            {(file) => {
              const key = getFileKey(file);
              const progress = (): number | undefined => local.progressByFile?.[key];
              const isUploading = (): boolean => {
                const value = progress();
                return typeof value === "number" && value >= 0 && value < 100;
              };
              const isComplete = (): boolean => progress() === 100;
              // Fade + slight rise as the row is added. Enter-only: selectedFiles is a
              // controlled prop we don't own, so a removed row can't be held for an exit.
              const entered = createEnterReveal();
              return (
                <li
                  class={mergeClasses(
                    "relative flex items-center gap-2 overflow-hidden rounded-lg px-2.5 py-1.5 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
                    entered() ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0 motion-reduce:translate-y-0",
                    CONTENT_CARD_SURFACE_CLASSES
                  )}
                >
                  <Show
                    when={previewsEnabled() && isImageFile(file) && getPreviewUrl(file) !== undefined}
                    fallback={
                      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300">
                        <Icon name={isImageFile(file) ? "image" : "draft"} size={FORM_CONTROL_ICON_SIZE} aria-hidden="true" />
                      </span>
                    }
                  >
                    <img src={getPreviewUrl(file)!} alt="" class="h-8 w-8 shrink-0 rounded-lg object-cover" />
                  </Show>
                  <span class="flex min-w-0 flex-1 flex-col">
                    <Text as="span" size="small" color="default" display="block" truncate>
                      {file.name}
                    </Text>
                    <Text as="span" size="caption" color="muted" display="block" truncate>
                      {formatFileSize(file.size)}
                      <Show when={isUploading()}> · {progress()!.toString()}%</Show>
                      <Show when={isComplete()}> · Uploaded</Show>
                    </Text>
                  </span>
                  <Show when={isComplete()}>
                    <Icon name="check_circle" size={FORM_CONTROL_ICON_SIZE} color="success" class="shrink-0" aria-hidden="true" />
                  </Show>
                  <IconButton variant="ghost" icon="close" aria-label={`Remove ${file.name}`} disabled={local.disabled} onClick={() => removeFile(key)} />
                  <Show when={isUploading()}>
                    <span class="absolute right-0 bottom-0 left-0 h-0.5 overflow-hidden bg-gray-100 dark:bg-gray-700/60">
                      <span class="block h-full bg-blue-500 transition-[width] duration-100 ease-out dark:bg-blue-400" style={{ width: `${progress()!.toString()}%` }} />
                    </span>
                  </Show>
                </li>
              );
            }}
          </For>
        </ul>
      </Show>
    </div>
  );
};
