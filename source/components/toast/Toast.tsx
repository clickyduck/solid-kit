import { IconButton } from "@/components/icon-button/IconButton";
import { Icon } from "@/components/icons";
import { Text } from "@/components/typography";
import { DROPDOWN_MENU_SURFACE_CLASSES, mergeClasses } from "@/utilities";
import type { ComponentProps } from "solid-js";
import { Match, Show, Switch, createSignal, splitProps } from "solid-js";

export type ToastData = {
  id: string;
  title?: string;
  description?: string;
  variant?: "success" | "danger" | "warning" | "default";
};

// Toasts slide in and out rather than fade: off-screen bottom on mobile (the
// stack sits bottom-center), off-screen right on desktop (bottom-right stack).
// The transform end-states compose with the container's layout classes — each
// toast owns only its own translate. `ease-out` per the design system.
const TOAST_TRANSITION_DURATION_MS = 300;
const TOAST_TRANSITION_CLASSES = "transition-transform duration-300 ease-out motion-reduce:transition-none";
// Hidden (enter-from / exit-to): below the viewport on mobile, right of it on desktop.
const TOAST_HIDDEN_CLASSES = "translate-y-full sm:translate-x-full sm:translate-y-0";
// Shown: settled into place.
const TOAST_SHOWN_CLASSES = "translate-y-0 sm:translate-x-0";

const [toastStore, setToastStore] = createSignal<ToastData[]>([]);
// IDs currently sliding out. Kept separate from the store (rather than a field on
// ToastData) so the store's objects keep stable references and the <For> in
// Toaster reuses each toast's DOM row instead of remounting it — which would
// otherwise restart the animation from scratch.
const [exitingToastIds, setExitingToastIds] = createSignal<ReadonlySet<string>>(new Set());
const toastTimers = new Map<string, ReturnType<typeof setTimeout>>();

export { toastStore };

/** Whether a toast is currently playing its exit (slide-out) transition. */
export const isToastExiting = (toastId: string): boolean => exitingToastIds().has(toastId);

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
 * Removes a toast from the store by id. The toast first slides out, then is
 * dropped from the store once the exit transition finishes.
 */
export const removeToast = (toastId: string): void => {
  const timerId = toastTimers.get(toastId);
  if (timerId !== undefined) {
    clearTimeout(timerId);
    toastTimers.delete(toastId);
  }
  // Already sliding out — nothing more to do (e.g. auto-timeout racing a manual close).
  if (isToastExiting(toastId)) {
    return;
  }
  const nextExiting = new Set(exitingToastIds());
  nextExiting.add(toastId);
  setExitingToastIds(nextExiting);
  const purgeTimerId = setTimeout(() => {
    toastTimers.delete(toastId);
    setToastStore(toastStore().filter((toast) => toast.id !== toastId));
    const remainingExiting = new Set(exitingToastIds());
    remainingExiting.delete(toastId);
    setExitingToastIds(remainingExiting);
  }, TOAST_TRANSITION_DURATION_MS);
  toastTimers.set(toastId, purgeTimerId);
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
      return "bg-gray-500/15 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300";
  }
};

/**
 * Single toast item with icon, title, description and close button.
 */
export const Toast = (properties: ComponentProps<"div"> & { toast: ToastData }) => {
  const [local, rest] = splitProps(properties, ["toast", "class"]);
  const toast = () => local.toast;

  // Slide in on the frame after mount so the transform transition runs from the
  // off-screen start position rather than snapping into place.
  const [entered, setEntered] = createSignal(false);
  requestAnimationFrame(() => setEntered(true));
  const visible = () => entered() && !isToastExiting(toast().id);

  return (
    <div
      class={mergeClasses(
        // Shares the floating-surface chrome (rounded-lg, border, shadow) with Dropdown/DatePicker
        // menus; the toast layers a translucent, blurred fill on top so it reads as floating over
        // page content rather than an opaque panel.
        DROPDOWN_MENU_SURFACE_CLASSES,
        // A toast floats free over arbitrary page content, so it keeps a fuller shadow than an
        // anchored menu (which sits tight to its trigger and only needs shadow-lg/10).
        "flex w-full max-w-sm items-center bg-white/95 p-4 text-gray-700 shadow-lg backdrop-blur-sm dark:bg-gray-800/80 dark:text-gray-200",
        TOAST_TRANSITION_CLASSES,
        visible() ? TOAST_SHOWN_CLASSES : TOAST_HIDDEN_CLASSES,
        local.class
      )}
      role="alert"
      {...rest}
    >
      <div class={mergeClasses("inline-flex size-7 shrink-0 items-center justify-center rounded-lg", getIconContainerClasses(toast().variant))}>
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
