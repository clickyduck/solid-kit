import { IconButton } from "@/components/icon-button/IconButton";
import { closeCircle } from "@/components/icons";
import { mergeClasses } from "@/utilities/mergeClasses";
import { themedScrollControlClassName } from "@/utilities/themedScrollControlClassName";
import type { Component, JSX } from "solid-js";
import { createSignal, onMount } from "solid-js";

type RightPanelProperties = {
  title: string;
  subtitle?: string;
  headerActions?: JSX.Element;
  children: JSX.Element;
  footer?: JSX.Element;
  /** Fires with `true` when the open transition is applied, and with `false` when the close animation has finished (200ms) so a parent can unmount after `Show`. */
  onOpenChange: (isPanelOpen: boolean) => void;
  closeAriaLabel: string;
};

/**
 * Sibling of the main column inside a `flex` row: from `md` and up the panel is in the document flow (pushes the main area). Below `md` the root unwraps to `display: contents` and the `aside` is `fixed` for a full width overlay. Parent shell should be `class="flex min-h-0 min-w-0 flex-1 flex-row"` (or similar) with `RightPanelLayout` (main) then `Show` + this component.
 */
export const RightPanel: Component<RightPanelProperties> = (properties) => {
  const [isPanelVisible, setIsPanelVisible] = createSignal<boolean>(false);

  onMount(() => {
    requestAnimationFrame(() => {
      setIsPanelVisible(true);
      properties.onOpenChange(true);
    });
  });

  const closeRightPanel = (): void => {
    setIsPanelVisible(false);
    setTimeout(() => {
      properties.onOpenChange(false);
    }, 200);
  };

  return (
    <div class={mergeClasses("min-h-0 shrink-0 max-md:contents", "md:min-w-0 md:overflow-hidden md:transition-[width] md:duration-200 md:ease-in-out", isPanelVisible() ? "md:w-md lg:w-xl" : "md:w-0")}>
      <aside
        class={mergeClasses(
          "flex h-full min-h-0 w-full min-w-0 flex-col bg-white text-gray-900 shadow-xl dark:bg-gray-950 dark:text-gray-100",
          "max-md:fixed max-md:top-16 max-md:right-0 max-md:bottom-0 max-md:left-0 max-md:z-50",
          "max-md:max-h-[calc(100dvh-4rem)]",
          "md:static md:max-h-none",
          "border-l border-gray-200 dark:border-gray-700/80",
          "transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isPanelVisible() ? "translate-x-0" : "max-md:translate-x-full"
        )}
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

type RightPanelLayoutProperties = {
  children: JSX.Element;
  class?: string;
};

/**
 * Main column: `flex-1` scroll region. Place as the first `flex` child; place `RightPanel` after as a sibling when open so the main area narrows on desktop. On small viewports the right `aside` is `fixed` and this column keeps full width.
 */
export const RightPanelLayout: Component<RightPanelLayoutProperties> = (properties) => {
  return <div class={mergeClasses("min-h-0 min-w-0 flex-1 overflow-auto", themedScrollControlClassName, properties.class)}>{properties.children}</div>;
};
