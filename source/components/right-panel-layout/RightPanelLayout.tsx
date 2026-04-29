import { IconButton } from "@/components/icon-button/IconButton";
import { closeCircle } from "@/components/icons";
import { mergeClasses } from "@/utilities/mergeClasses";
import { themedScrollControlClassName } from "@/utilities/themedScrollControlClassName";
import type { Component, JSX } from "solid-js";
import { createSignal, onCleanup, onMount } from "solid-js";

type RightPanelLayoutProperties = {
  title: string;
  subtitle?: string;
  headerActions?: JSX.Element;
  children: JSX.Element;
  footer?: JSX.Element;
  /** Fires with `true` when the open transition is applied, and with `false` when the close animation has finished (200ms) so a parent can unmount after `Show`. */
  onOpenChange: (isPanelOpen: boolean) => void;
  closeAriaLabel: string;
  /**
   * Offset from the top for the mobile overlay variant.
   * Defaults to `var(--solid-kit-header-height, 4rem)` so it complements `MainLayout` + `HeaderLayout`.
   */
  topOffset?: string;
};

/**
 * Right panel (grid area: `right`).
 *
 * From `md` and up, it is in the document flow (narrows the main column). Below `md`, the `aside`
 * becomes `fixed` to behave like a full-width overlay.
 */
export const RightPanelLayout: Component<RightPanelLayoutProperties> = (properties) => {
  const [isPanelVisible, setIsPanelVisible] = createSignal<boolean>(false);

  onMount(() => {
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
    if (closeTimer !== undefined) {
      return;
    }
    setIsPanelVisible(false);
    closeTimer = setTimeout(() => {
      closeTimer = undefined;
      properties.onOpenChange(false);
    }, 200);
  };

  const resolvedTopOffset = properties.topOffset ?? "var(--solid-kit-header-height, 4rem)";

  return (
    <div class={mergeClasses("layout-right-panel min-h-0 shrink-0 max-md:contents", "md:min-w-0 md:overflow-hidden md:transition-[width] md:duration-200 md:ease-in-out", isPanelVisible() ? "md:w-md lg:w-xl" : "md:w-0")} style={{ "grid-area": "right" }}>
      <aside
        class={mergeClasses(
          "flex h-full min-h-0 w-full min-w-0 flex-col bg-white text-gray-900 shadow-xl dark:bg-gray-950 dark:text-gray-100",
          "max-md:fixed max-md:right-0 max-md:bottom-0 max-md:left-0 max-md:z-50",
          "md:static md:max-h-none",
          "border-l border-gray-200 dark:border-gray-700/80",
          "transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isPanelVisible() ? "translate-x-0" : "max-md:translate-x-full"
        )}
        style={{
          top: resolvedTopOffset,
          "max-height": `calc(100dvh - ${resolvedTopOffset})`
        }}
      >
        <header class="shrink-0 border-b border-gray-200 px-4 py-3 dark:border-gray-700/80">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <h2 class="min-w-0 truncate text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{properties.title}</h2>
              {properties.subtitle ? <p class="mt-1 truncate text-sm text-gray-600 dark:text-gray-400">{properties.subtitle}</p> : null}
            </div>
            <div class="flex shrink-0 items-center gap-1">
              {properties.headerActions ?? null}
              <IconButton
                icon={closeCircle}
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

        <div class={mergeClasses("min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-4", themedScrollControlClassName)}>{properties.children}</div>

        {properties.footer ? <div class="shrink-0 border-t border-gray-200 px-4 py-3 dark:border-gray-700/80">{properties.footer}</div> : null}
      </aside>
    </div>
  );
};

type MainContentLayoutProperties = {
  children: JSX.Element;
  class?: string;
};

/**
 * Main column scroll region (grid area: `main`).
 *
 * Place as the `main` grid child when you want the main column itself to be the scroll container,
 * and the `PageLayout` to be a padded inner wrapper.
 */
export const MainContentLayout: Component<MainContentLayoutProperties> = (properties) => {
  return (
    <div class={mergeClasses("min-h-0 min-w-0 overflow-auto", themedScrollControlClassName, properties.class)} style={{ "grid-area": "main" }}>
      {properties.children}
    </div>
  );
};

export type { RightPanelLayoutProperties, MainContentLayoutProperties };
