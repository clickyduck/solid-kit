import { IconButton } from "@/components/icon-button/IconButton";
import { Icon } from "@/components/icons";
import { Text } from "@/components/typography";
import { mergeClasses } from "@/utilities";
import type { ComponentProps } from "solid-js";
import { Match, Show, Switch, createSignal, splitProps } from "solid-js";

export type ToastData = {
  id: string;
  title?: string;
  description?: string;
  variant?: "success" | "danger" | "warning" | "default";
};

const [toastStore, setToastStore] = createSignal<ToastData[]>([]);
const toastTimers = new Map<string, ReturnType<typeof setTimeout>>();

export { toastStore };

const generateToastId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `toast-${crypto.randomUUID()}`;
  }
  return `toast-${Date.now().toString()}-${Math.random().toString(36).slice(2)}`;
};

/**
 * Adds a toast notification. Returns the toast id. Auto-removes after 5 seconds.
 */
export const addToast = (toast: Omit<ToastData, "id">): string => {
  const toastId = generateToastId();
  setToastStore([...toastStore(), { ...toast, id: toastId }]);

  const timerId = setTimeout(() => {
    toastTimers.delete(toastId);
    removeToast(toastId);
  }, 5000);
  toastTimers.set(toastId, timerId);

  return toastId;
};

/**
 * Removes a toast from the store by id.
 */
export const removeToast = (toastId: string): void => {
  const timerId = toastTimers.get(toastId);
  if (timerId !== undefined) {
    clearTimeout(timerId);
    toastTimers.delete(toastId);
  }
  setToastStore(
    toastStore().filter((toast) => {
      return toast.id !== toastId;
    })
  );
};

const getIconContainerClasses = (variant: ToastData["variant"]): string => {
  switch (variant) {
    case "success":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
    case "danger":
      return "bg-red-500/15 text-red-700 dark:text-red-400";
    case "warning":
      return "bg-amber-500/15 text-amber-800 dark:text-amber-400";
    default:
      return "bg-gray-500/15 text-gray-700 dark:bg-slate-500/15 dark:text-gray-300";
  }
};

/**
 * Single toast item with icon, title, description and close button.
 */
export const Toast = (properties: ComponentProps<"div"> & { toast: ToastData }) => {
  const [local, rest] = splitProps(properties, ["toast", "class"]);
  const toast = () => local.toast;

  return (
    <div class={mergeClasses("flex w-full max-w-sm items-center rounded-lg border border-gray-200 bg-white/95 p-4 text-gray-600 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300", local.class)} role="alert" {...rest}>
      <div class={mergeClasses("inline-flex h-7 w-7 shrink-0 items-center justify-center rounded", getIconContainerClasses(toast().variant))}>
        <Switch
          fallback={
            <>
              <Icon name="check_circle" size={20} aria-hidden="true" />
              <span class="sr-only">Notification icon</span>
            </>
          }
        >
          <Match when={toast().variant === "success"}>
            <Icon name="check_circle" size={20} aria-hidden="true" />
            <span class="sr-only">Check icon</span>
          </Match>
          <Match when={toast().variant === "danger"}>
            <Icon name="cancel" size={20} aria-hidden="true" />
            <span class="sr-only">Error icon</span>
          </Match>
          <Match when={toast().variant === "warning"}>
            <Icon name="warning" size={20} aria-hidden="true" />
            <span class="sr-only">Warning icon</span>
          </Match>
        </Switch>
      </div>
      <div class="ms-3">
        <Show when={toast().title}>
          <Text as="div" size="small" weight="normal" color="default" display="block">
            {toast().title}
          </Text>
        </Show>
        <Show when={toast().description}>
          <Text as="div" size="small" weight="normal" color="muted" display="block">
            {toast().description}
          </Text>
        </Show>
      </div>
      <IconButton
        icon="cancel"
        variant="ghost"
        class="ms-auto"
        onClick={() => {
          removeToast(toast().id);
        }}
        aria-label="Close"
      />
    </div>
  );
};
