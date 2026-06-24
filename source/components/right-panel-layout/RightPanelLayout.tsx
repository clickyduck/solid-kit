import { IconButton } from "@/components/icon-button/IconButton";
import { Text } from "@/components/typography";
import { mergeClasses } from "@/utilities/mergeClasses";
import { themedScrollControlClassName } from "@/utilities/themedScrollControlClassName";
import type { Component, JSX } from "solid-js";
import { Show, createEffect, createSignal, on, onCleanup, onMount, splitProps } from "solid-js";
import { Portal } from "solid-js/web";

type RightPanelLayoutProperties = {
  /**
   * Controlled open state. When omitted, the panel opens on mount (backwards compatible).
   * When provided, the panel will animate open/close as `open` changes.
   */
  open?: boolean;
  /** Header title content. */
  title: JSX.Element;
  /** Optional secondary header line. */
  subtitle?: JSX.Element;
  headerActions?: JSX.Element;
  children: JSX.Element;
  footer?: JSX.Element;
  /**
   * Called immediately when the close transition begins (e.g. so a parent can start shifting layout).
   * This fires before `onOpenChange(false)`.
   */
  onBeginClose?: () => void;
  /** Fires with `true` when the open transition is applied, and with `false` when the close animation has finished (200ms) so a parent can unmount after `Show`. */
  onOpenChange: (isPanelOpen: boolean) => void;
  closeAriaLabel: string;
  /**
   * Offset from the top for the mobile overlay variant.
   * Defaults to `var(--solid-kit-header-height, 4rem)` so it complements `MainLayout` + `HeaderLayout`.
   */
  topOffset?: string;
  /**
   * Optional props applied to the `<aside>` element (e.g. for drag/drop handlers).
   * If `class` is provided, it will be merged with the default classes.
   */
  panelProps?: JSX.HTMLAttributes<HTMLElement>;
  /**
   * Layout strategy:
   * - `grid`: intended for use as a sibling inside `MainLayout` (default).
   * - `overlay`: fixed right-panel overlay (useful when not using the `MainLayout` grid).
   */
  variant?: "grid" | "overlay";
};

/**
 * Right panel (grid area: `right`).
 *
 * From `md` and up, it is in the document flow (narrows the main column). Below `md`, the `aside`
 * becomes `fixed` to behave like a full-width overlay.
 */
export const RightPanelLayout: Component<RightPanelLayoutProperties> = (properties) => {
  const [isPanelMounted, setIsPanelMounted] = createSignal<boolean>(properties.open !== false);
  const [isPanelVisible, setIsPanelVisible] = createSignal<boolean>(false);

  onMount(() => {
    if (properties.open === false) {
      setIsPanelMounted(false);
      setIsPanelVisible(false);
      return;
    }
    setIsPanelMounted(true);
    requestAnimationFrame(() => {
      setIsPanelVisible(true);
      properties.onOpenChange(true);
    });
  });

  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => {
    clearTimeout(closeTimer);
  });

  const closeRightPanel = (): void => {
    if (!isPanelMounted()) {
      return;
    }
    if (closeTimer !== undefined) {
      return;
    }
    properties.onBeginClose?.();
    setIsPanelVisible(false);
    closeTimer = setTimeout(() => {
      closeTimer = undefined;
      setIsPanelMounted(false);
      properties.onOpenChange(false);
    }, 200);
  };

  const openRightPanel = (): void => {
    clearTimeout(closeTimer);
    closeTimer = undefined;
    setIsPanelMounted(true);
    requestAnimationFrame(() => {
      setIsPanelVisible(true);
      properties.onOpenChange(true);
    });
  };

  createEffect(
    on(
      () => properties.open,
      (nextOpen) => {
        if (nextOpen === undefined) {
          return;
        }
        if (nextOpen) {
          openRightPanel();
        } else {
          closeRightPanel();
        }
      },
      { defer: true }
    )
  );

  const resolvedTopOffset = (): string => properties.topOffset ?? "var(--solid-kit-header-height, 4rem)";
  const resolvedVariant = (): "grid" | "overlay" => properties.variant ?? "grid";
  const panelPropsClass = (): string => {
    const incoming = properties.panelProps?.class;
    return incoming ? String(incoming) : "";
  };
  const panelPropsRest = (): JSX.HTMLAttributes<HTMLElement> => {
    const incoming = properties.panelProps;
    if (!incoming) {
      return {};
    }
    const [, rest] = splitProps(incoming, ["class"]);
    return rest;
  };
  const portalMount = (): HTMLElement | undefined => {
    if (typeof document === "undefined") {
      return undefined;
    }
    return document.body;
  };

  const layout = (
    <div
      class={mergeClasses(
        "min-h-0 shrink-0",
        resolvedVariant() === "grid" ? "max-md:contents md:min-w-0 md:overflow-hidden md:transition-[width] md:duration-200 md:ease-in-out" : "",
        resolvedVariant() === "grid" ? (isPanelVisible() ? "md:w-md lg:w-xl" : "md:w-0") : ""
      )}
      style={resolvedVariant() === "grid" ? { "grid-area": "right" } : undefined}
    >
      <aside
        {...panelPropsRest()}
        class={mergeClasses(
          "flex h-full min-h-0 w-full min-w-0 flex-col bg-white text-gray-900 shadow-xl dark:bg-gray-950 dark:text-gray-100",
          "border-l border-gray-200 dark:border-gray-700/80",
          resolvedVariant() === "overlay"
            ? "fixed right-0 bottom-0 left-0 z-40 w-full max-w-full transform transition-transform duration-200 ease-in-out md:left-auto md:w-md lg:w-xl"
            : "max-md:fixed max-md:right-0 max-md:bottom-0 max-md:left-0 max-md:z-40 max-md:transform max-md:transition-transform max-md:duration-200 max-md:ease-in-out md:static md:max-h-none",
          resolvedVariant() === "overlay"
            ? isPanelVisible()
              ? "pointer-events-auto translate-x-0"
              : "pointer-events-none translate-x-full"
            : isPanelVisible()
              ? "pointer-events-auto translate-x-0"
              : "max-md:pointer-events-none max-md:translate-x-full md:pointer-events-none md:opacity-0",
          panelPropsClass()
        )}
        style={{
          top: resolvedTopOffset(),
          "max-height": `calc(100dvh - ${resolvedTopOffset()})`
        }}
        aria-hidden={isPanelVisible() ? undefined : true}
      >
        <header class="shrink-0 border-b border-gray-200 dark:border-gray-700/80">
          <div class="flex items-center justify-between gap-3 px-4 py-3">
            <div class="min-w-0">
              <Text as="div" weight="semibold" color="default" display="block" truncate class="min-w-0 text-lg tracking-tight">
                {properties.title}
              </Text>
              <Show when={properties.subtitle}>
                <Text as="div" size="small" color="muted" display="block" truncate class="mt-1 min-w-0">
                  {properties.subtitle}
                </Text>
              </Show>
            </div>
            <div class="flex shrink-0 items-center gap-1">
              <Show when={properties.headerActions}>{properties.headerActions}</Show>
              <IconButton
                icon="cancel"
                class="shrink-0"
                variant="ghost"
                aria-label={properties.closeAriaLabel}
                onClick={() => {
                  closeRightPanel();
                }}
              />
            </div>
          </div>
        </header>
        <div class={mergeClasses("min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-3", themedScrollControlClassName)}>{properties.children}</div>
        <Show when={properties.footer}>
          <div class="shrink-0 border-t border-gray-200 px-4 py-3 dark:border-gray-700/80">{properties.footer}</div>
        </Show>
      </aside>
    </div>
  );

  return (
    <Show when={isPanelMounted()}>
      <Show when={resolvedVariant() === "overlay"} fallback={layout}>
        <Portal mount={portalMount()}>{layout}</Portal>
      </Show>
    </Show>
  );
};
export type { RightPanelLayoutProperties };
