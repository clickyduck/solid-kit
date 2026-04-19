import { IconButton } from "@/components/icon-button/IconButton";
import { Icon, checkCircle, closeCircle, exclamationTriangle } from "@/components/icons";
import { mergeClasses } from "@/utilities/mergeClasses";
import type { ComponentProps } from "solid-js";
import { Match, Show, Switch, createSignal } from "solid-js";

export type ToastData = {
  id: string;
  title?: string;
  description?: string;
  variant?: "success" | "danger" | "warning" | "default";
};

const [toastStore, setToastStore] = createSignal<ToastData[]>([]);

export { toastStore };

/**
 * Adds a toast notification. Returns the toast id. Auto-removes after 5 seconds.
 */
export const addToast = (toast: Omit<ToastData, "id">): string => {
  const toastId = `toast-${Date.now()}-${Math.random().toString()}`;
  setToastStore([...toastStore(), { ...toast, id: toastId }]);

  setTimeout(() => {
    removeToast(toastId);
  }, 5000);

  return toastId;
};

/**
 * Removes a toast from the store by id.
 */
export const removeToast = (toastId: string): void => {
  setToastStore(
    toastStore().filter((toast) => {
      return toast.id !== toastId;
    })
  );
};

const getIconContainerClasses = (variant: ToastData["variant"]): string => {
  switch (variant) {
    case "success":
      return "bg-emerald-500/15 text-emerald-400";
    case "danger":
      return "bg-red-500/15 text-red-400";
    case "warning":
      return "bg-amber-500/15 text-amber-400";
    default:
      return "bg-emerald-500/15 text-emerald-400";
  }
};

/**
 * Single toast item with icon, title, description and close button.
 */
export const Toast = (properties: ComponentProps<"div"> & { toast: ToastData }) => {
  const { toast, ...rest } = properties;

  return (
    <div class="flex w-full max-w-sm items-center rounded-lg border border-gray-700 bg-gray-800/80 p-4 text-gray-300 shadow-lg backdrop-blur-sm" role="alert" {...rest}>
      <div class={mergeClasses("inline-flex h-7 w-7 shrink-0 items-center justify-center rounded", getIconContainerClasses(toast.variant))}>
        <Switch fallback={<Icon icon={checkCircle} width={20} height={20} aria-hidden="true" />}>
          <Match when={toast.variant === "success"}>
            <Icon icon={checkCircle} width={20} height={20} aria-hidden="true" />
            <span class="sr-only">Check icon</span>
          </Match>
          <Match when={toast.variant === "danger"}>
            <Icon icon={closeCircle} width={20} height={20} aria-hidden="true" />
            <span class="sr-only">Error icon</span>
          </Match>
          <Match when={toast.variant === "warning"}>
            <Icon icon={exclamationTriangle} width={20} height={20} aria-hidden="true" />
            <span class="sr-only">Warning icon</span>
          </Match>
        </Switch>
      </div>
      <div class="ms-3 text-sm font-normal">
        <Show when={toast.title}>
          <div class="font-medium text-white">{toast.title}</div>
        </Show>
        <Show when={toast.description}>
          <div>{toast.description}</div>
        </Show>
      </div>
      <IconButton
        icon={closeCircle}
        variant="ghost"
        class="ms-auto"
        onClick={() => {
          removeToast(toast.id);
        }}
        aria-label="Close"
      />
    </div>
  );
};

export const ToastTitle = (properties: ComponentProps<"div">) => {
  return <div {...properties} />;
};

export const ToastDescription = (properties: ComponentProps<"div">) => {
  return <div {...properties} />;
};

export const ToastContent = (properties: ComponentProps<"div">) => {
  return <div {...properties} />;
};

export const ToastRegion = (properties: ComponentProps<"div">) => {
  return <div {...properties} />;
};

export const ToastList = (properties: ComponentProps<"ol">) => {
  return <ol {...properties} />;
};
