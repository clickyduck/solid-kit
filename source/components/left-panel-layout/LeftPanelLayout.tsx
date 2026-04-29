import { Button } from "@/components/button/Button";
import { Icon, type IconComponent, arrowTrendingUp, calendarDays, chat, checkCircle, chevronDown, confirmationNumber, currencyRupee, dashboard, forum, groups, inventory, list, pieChart, settings, tag, wallet, work } from "@/components/icons";
import { mergeClasses } from "@/utilities/mergeClasses";
import { themedScrollControlClassName } from "@/utilities/themedScrollControlClassName";
import { useIsMobile } from "@/utilities/useIsMobile";
import type { Component, JSX } from "solid-js";
import { For, Show, createMemo, createSignal, onCleanup, onMount } from "solid-js";

/** Maps JSON `iconExportName` values to icon components; extend this object when supporting new icon names in navigation JSON. */
export const leftPanelNavigationIconByExportName = {
  arrowTrendingUp,
  calendarDays,
  chat,
  checkCircle,
  confirmationNumber,
  currencyRupee,
  dashboard,
  forum,
  groups,
  inventory,
  list,
  pieChart,
  settings,
  tag,
  wallet,
  work
} as const satisfies Record<string, IconComponent>;

export const leftPanelLayoutNavigationIconByExportName = leftPanelNavigationIconByExportName;

export type LeftPanelLayoutNavigationIconExportName = keyof typeof leftPanelLayoutNavigationIconByExportName;

/** One navigation row rendered inside a group. */
export type LeftPanelNavigationItemJson = {
  href: string;
  label: string;
  iconExportName: LeftPanelLayoutNavigationIconExportName;
  /** When true, only the exact pathname matches (Solid Router `end` on root). */
  matchRouteExactly?: boolean;
};

export type LeftPanelLayoutNavigationItemJson = LeftPanelNavigationItemJson;

/** Labeled section containing one or more links; optional collapsible body. */
export type LeftPanelNavigationGroupJson = {
  groupLabel: string;
  /** Stable identifier for expansion memory when `collapsibleNavigationGroup` is true. */
  navigationGroupIdentifier?: string;
  /** When true, a control toggles visibility of the group items (ignored when the sidebar is in icon-only mode). */
  collapsibleNavigationGroup?: boolean;
  /** When true, the group body starts collapsed; omit or false for expanded (default). */
  navigationGroupInitiallyCollapsed?: boolean;
  items: LeftPanelNavigationItemJson[];
};

export type LeftPanelLayoutNavigationGroupJson = LeftPanelNavigationGroupJson;

/** Full navigation tree consumed by the left panel. */
export type LeftPanelNavigationDocumentJson = {
  groups: LeftPanelNavigationGroupJson[];
};

export type LeftPanelLayoutNavigationDocumentJson = LeftPanelNavigationDocumentJson;

const NAVIGATION_LINK_ICON_CLASS = "nav-link-icon shrink-0 opacity-80 w-4 h-4 md:w-3.5 md:h-3.5";
const NAVIGATION_LINK_ROW_CLASS = "group flex min-w-0 items-center rounded-lg h-11 min-h-11 text-sm font-medium transition-all duration-150 text-gray-800 dark:text-white md:h-9 md:min-h-9 md:max-h-9 md:text-xs";
const NAVIGATION_LINK_LABEL_CLASS = "min-w-0 truncate";
const NAVIGATION_LINK_EXPANDED_LAYOUT_CLASS = "px-4 space-x-3.5 md:px-3 md:space-x-3";
const NAVIGATION_LINK_COLLAPSED_LAYOUT_CLASS = "size-9 mx-auto justify-center";
const NAVIGATION_LINK_ACTIVE_CLASS = "border-l-2 border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 [&_.nav-link-icon]:opacity-100 [&_.nav-link-icon]:text-blue-600 dark:[&_.nav-link-icon]:text-blue-400";
const NAVIGATION_LINK_INACTIVE_CLASS = "border-l-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50";
/** Same vertical rhythm as navigation link rows on desktop so toggling icon-only mode does not move links. */
const NAVIGATION_GROUP_HEADING_SLOT_CLASS = "mb-2 flex min-h-11 w-full shrink-0 items-stretch md:mb-2 md:h-9 md:min-h-9 md:max-h-9";
const GROUP_LABEL_TEXT_CLASS = "flex w-full min-w-0 items-center text-xs leading-none font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase md:px-2";

const computeIsNavigationItemActive = (item: LeftPanelNavigationItemJson, pathname: string, hash: string): boolean => {
  if (item.href.startsWith("#")) {
    if (hash.length === 0) {
      return false;
    }
    return hash === item.href;
  }
  const normalizedPathname = pathname.replace(/\/$/, "") || "/";
  const normalizedHref = item.href.replace(/\/$/, "") || "/";
  if (item.matchRouteExactly === true) {
    return normalizedPathname === normalizedHref;
  }
  if (normalizedHref === "/") {
    return normalizedPathname === "/";
  }
  if (normalizedPathname === normalizedHref) {
    return true;
  }
  return normalizedPathname.startsWith(`${normalizedHref}/`);
};

type LeftPanelNavigationBodyProperties = {
  collapsed: boolean;
  navigationDocument: LeftPanelLayoutNavigationDocumentJson;
  onItemClick?: () => void;
};

const LeftPanelNavigationBody: Component<LeftPanelNavigationBodyProperties> = (properties) => {
  const [pathname, setPathname] = createSignal(typeof window === "undefined" ? "" : window.location.pathname);
  const [hash, setHash] = createSignal(typeof window === "undefined" ? "" : window.location.hash);
  const [groupBodyExpandedByIdentifier, setGroupBodyExpandedByIdentifier] = createSignal<Record<string, boolean>>({});

  const hasAnyNavigationItems = createMemo(() => {
    return properties.navigationDocument.groups.some((group) => {
      return group.items.length > 0;
    });
  });

  onMount(() => {
    if (typeof window === "undefined") {
      return;
    }
    const synchronizeLocation = (): void => {
      setPathname(window.location.pathname);
      setHash(window.location.hash);
    };
    synchronizeLocation();
    window.addEventListener("popstate", synchronizeLocation);
    window.addEventListener("hashchange", synchronizeLocation);
    onCleanup(() => {
      window.removeEventListener("popstate", synchronizeLocation);
      window.removeEventListener("hashchange", synchronizeLocation);
    });
  });

  const resolveNavigationGroupBodyExpanded = (navigationGroupIdentifier: string, navigationGroupInitiallyCollapsed: boolean): boolean => {
    const stored = groupBodyExpandedByIdentifier()[navigationGroupIdentifier];
    if (stored !== undefined) {
      return stored;
    }
    return !navigationGroupInitiallyCollapsed;
  };

  const toggleNavigationGroupBody = (navigationGroupIdentifier: string, navigationGroupInitiallyCollapsed: boolean): void => {
    const nextExpanded = !resolveNavigationGroupBodyExpanded(navigationGroupIdentifier, navigationGroupInitiallyCollapsed);
    setGroupBodyExpandedByIdentifier((previous) => {
      return { ...previous, [navigationGroupIdentifier]: nextExpanded };
    });
  };

  return (
    <nav class="space-y-8 md:space-y-7">
      <Show
        when={hasAnyNavigationItems()}
        fallback={<div class={mergeClasses("rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400", properties.collapsed ? "hidden" : "")}>No matches. Try a different search term.</div>}
      >
        <For each={properties.navigationDocument.groups}>
          {(group, groupIndex) => {
            const navigationGroupIdentifierMemo = createMemo(() => {
              if (group.navigationGroupIdentifier !== undefined && group.navigationGroupIdentifier.length > 0) {
                return group.navigationGroupIdentifier;
              }
              return `${group.groupLabel}-${groupIndex()}`;
            });
            const navigationGroupInitiallyCollapsedMemo = createMemo(() => {
              return group.navigationGroupInitiallyCollapsed === true;
            });
            const useCollapsibleNavigationGroupMemo = createMemo(() => {
              // Collapsible-by-default so consumers get the "group header button" UX without extra flags.
              // Opt out explicitly with `collapsibleNavigationGroup: false`.
              return group.collapsibleNavigationGroup !== false && !properties.collapsed;
            });
            const isNavigationGroupBodyExpandedMemo = createMemo(() => {
              return resolveNavigationGroupBodyExpanded(navigationGroupIdentifierMemo(), navigationGroupInitiallyCollapsedMemo());
            });

            const renderNavigationItemLink = (item: LeftPanelLayoutNavigationItemJson): JSX.Element => {
              const isActive = (): boolean => {
                return computeIsNavigationItemActive(item, pathname(), hash());
              };
              return (
                <a
                  href={item.href}
                  class={mergeClasses(NAVIGATION_LINK_ROW_CLASS, properties.collapsed ? NAVIGATION_LINK_COLLAPSED_LAYOUT_CLASS : NAVIGATION_LINK_EXPANDED_LAYOUT_CLASS, isActive() ? NAVIGATION_LINK_ACTIVE_CLASS : NAVIGATION_LINK_INACTIVE_CLASS)}
                  aria-current={isActive() ? "page" : undefined}
                  aria-label={item.label}
                  onClick={(event: MouseEvent) => {
                    if (typeof window === "undefined") {
                      return;
                    }
                    if (item.href.startsWith("#")) {
                      event.preventDefault();
                      const targetIdentifier = item.href.slice(1);
                      if (targetIdentifier.length === 0) {
                        return;
                      }
                      const targetElement = window.document.getElementById(targetIdentifier);
                      if (!targetElement) {
                        return;
                      }
                      if (window.location.hash !== item.href) {
                        window.history.pushState(null, "", item.href);
                        setHash(item.href);
                      }
                      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                    properties.onItemClick?.();
                  }}
                >
                  <Icon icon={leftPanelLayoutNavigationIconByExportName[item.iconExportName]} class={NAVIGATION_LINK_ICON_CLASS} aria-hidden="true" />
                  <Show when={!properties.collapsed}>
                    <span class={NAVIGATION_LINK_LABEL_CLASS}>{item.label}</span>
                  </Show>
                </a>
              );
            };

            return (
              <div class="space-y-1">
                <div class={NAVIGATION_GROUP_HEADING_SLOT_CLASS}>
                  <Show
                    when={useCollapsibleNavigationGroupMemo()}
                    fallback={
                      <div class={mergeClasses("h-full min-h-0", GROUP_LABEL_TEXT_CLASS, properties.collapsed ? "pointer-events-none invisible" : "")} aria-hidden={properties.collapsed ? true : undefined}>
                        <span class="min-w-0 truncate">{group.groupLabel}</span>
                      </div>
                    }
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      class={mergeClasses("h-full min-h-0 w-full min-w-0 justify-between gap-2 px-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase hover:bg-gray-100 md:h-full md:px-2 dark:text-gray-400 dark:hover:bg-gray-800/60")}
                      aria-expanded={isNavigationGroupBodyExpandedMemo()}
                      onClick={() => {
                        toggleNavigationGroupBody(navigationGroupIdentifierMemo(), navigationGroupInitiallyCollapsedMemo());
                      }}
                    >
                      <span class="min-w-0 flex-1 truncate">{group.groupLabel}</span>
                      <span class={mergeClasses("inline-flex shrink-0 items-center justify-center text-gray-500 transition-transform duration-200 ease-out", isNavigationGroupBodyExpandedMemo() ? "rotate-180" : "rotate-0")} aria-hidden>
                        <Icon icon={chevronDown} class="size-4" />
                      </span>
                    </Button>
                  </Show>
                </div>
                <Show when={!useCollapsibleNavigationGroupMemo() || isNavigationGroupBodyExpandedMemo()}>
                  <For each={group.items}>{(item) => renderNavigationItemLink(item)}</For>
                </Show>
              </div>
            );
          }}
        </For>
      </Show>
    </nav>
  );
};

type LeftPanelLayoutProperties = {
  collapsed: boolean;
  /**
   * Fires when the panel becomes open or closed. Use `false` from link tap or swipe to request closing; the parent should set `collapsed` to match.
   */
  onOpenChange?: (isPanelOpen: boolean) => void;
  navigationDocument: LeftPanelLayoutNavigationDocumentJson;
  /**
   * When true, renders a mobile scrim behind the panel when it is open.
   * Clicking the scrim triggers `onOpenChange(false)`.
   *
   * Defaults to `true` so consumers don't need to re-implement overlay behavior.
   */
  scrim?: boolean;
  /** Tailwind z-index for the scrim layer (panel stays above). */
  scrimZIndexClass?: string;
  /** Tailwind z-index for the panel layer. */
  panelZIndexClass?: string;
  /** Desktop width when expanded (defaults to `md:w-64`). */
  expandedWidthClass?: string;
  /** Desktop width when collapsed (defaults to `md:w-16`). */
  collapsedWidthClass?: string;
};

/**
 * Collapsible application sidebar with touch swipe-to-close on small viewports; navigation content comes from JSON.
 * On small viewports the panel is full width, fixed under the header, and stacks above the scrim so links stay usable.
 */
export const LeftPanelLayout: Component<LeftPanelLayoutProperties> = (properties) => {
  const isMobileViewport = useIsMobile();
  const [sidebarElement, setSidebarElement] = createSignal<HTMLElement | undefined>(undefined);
  const [swipeStartClientX, setSwipeStartClientX] = createSignal<number | null>(null);
  const [swipeStartClientY, setSwipeStartClientY] = createSignal<number | null>(null);
  const [swipeTranslationX, setSwipeTranslationX] = createSignal<number>(0);
  const [isSwipeGestureActive, setIsSwipeGestureActive] = createSignal<boolean>(false);
  const [isSwipeDragging, setIsSwipeDragging] = createSignal<boolean>(false);

  const resetSwipeGesture = (): void => {
    setSwipeStartClientX(null);
    setSwipeStartClientY(null);
    setIsSwipeGestureActive(false);
    setIsSwipeDragging(false);
  };

  return (
    <>
      <Show when={(properties.scrim ?? true) && !properties.collapsed && isMobileViewport()}>
        <div
          role="presentation"
          aria-hidden="true"
          class={mergeClasses(properties.scrimZIndexClass ?? "z-40", "fixed inset-0 bg-black/50", "top-(--solid-kit-header-height,4rem)", "transition-opacity duration-200")}
          onClick={() => {
            properties.onOpenChange?.(false);
          }}
        />
      </Show>

      <aside
        ref={(element: HTMLElement) => {
          setSidebarElement(element);
        }}
        class={mergeClasses(
          "layout-left-panel flex min-h-0 flex-col overflow-hidden bg-white md:border-r md:border-gray-200 dark:bg-gray-950 dark:md:border-gray-700/60",
          properties.panelZIndexClass ?? "z-50",
          "fixed inset-x-0 top-(--solid-kit-header-height,4rem) bottom-0 w-full max-w-none transition-transform duration-200 ease-in-out",
          "md:static md:z-auto md:h-full md:max-w-none md:transition-[width] md:duration-200 md:ease-in-out",
          properties.collapsed ? "-translate-x-full md:pointer-events-auto md:translate-x-0" : "translate-x-0",
          properties.collapsed ? (properties.collapsedWidthClass ?? "md:w-16") : (properties.expandedWidthClass ?? "md:w-64")
        )}
        style={
          !properties.collapsed && isMobileViewport()
            ? {
                "grid-area": "left",
                transform: `translateX(${swipeTranslationX()}px)`,
                "touch-action": "pan-y",
                transition: isSwipeDragging() ? "none" : undefined
              }
            : { "grid-area": "left", "touch-action": "auto" }
        }
        onPointerDown={(event: PointerEvent) => {
          if (properties.collapsed) {
            return;
          }
          if (!isMobileViewport()) {
            return;
          }
          if (event.pointerType !== "touch") {
            return;
          }
          (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
          setSwipeStartClientX(event.clientX);
          setSwipeStartClientY(event.clientY);
          setSwipeTranslationX(0);
          setIsSwipeGestureActive(false);
          setIsSwipeDragging(false);
        }}
        onPointerMove={(event: PointerEvent) => {
          if (properties.collapsed) {
            return;
          }
          if (!isMobileViewport()) {
            return;
          }
          if (event.pointerType !== "touch") {
            return;
          }
          const initialClientX = swipeStartClientX();
          const initialClientY = swipeStartClientY();
          if (initialClientX == null || initialClientY == null) {
            return;
          }
          const deltaX = event.clientX - initialClientX;
          const deltaY = event.clientY - initialClientY;

          if (!isSwipeGestureActive()) {
            if (Math.abs(deltaX) < 8) {
              return;
            }
            if (Math.abs(deltaY) > 12 && Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
              resetSwipeGesture();
              setSwipeTranslationX(0);
              return;
            }
            setIsSwipeGestureActive(true);
          }

          event.preventDefault();
          setIsSwipeDragging(true);
          setSwipeTranslationX(Math.min(0, deltaX));
        }}
        onPointerUp={(event: PointerEvent) => {
          if (properties.collapsed) {
            return;
          }
          if (!isMobileViewport()) {
            return;
          }
          if (event.pointerType !== "touch") {
            return;
          }
          const translationX = swipeTranslationX();
          const width = sidebarElement()?.offsetWidth ?? 0;
          const closeThreshold = Math.max(60, Math.floor(width / 2));
          const shouldClose = isSwipeGestureActive() && translationX <= -closeThreshold;
          resetSwipeGesture();
          if (shouldClose) {
            setSwipeTranslationX(0);
            properties.onOpenChange?.(false);
            return;
          }
          setSwipeTranslationX(0);
        }}
        onPointerCancel={(event: PointerEvent) => {
          if (properties.collapsed) {
            return;
          }
          if (!isMobileViewport()) {
            return;
          }
          if (event.pointerType !== "touch") {
            return;
          }
          resetSwipeGesture();
          setSwipeTranslationX(0);
        }}
      >
        <div class={mergeClasses("flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto", themedScrollControlClassName, properties.collapsed ? "px-2 py-3" : "p-3")}>
          <LeftPanelNavigationBody
            collapsed={properties.collapsed}
            navigationDocument={properties.navigationDocument}
            onItemClick={() => {
              properties.onOpenChange?.(false);
            }}
          />
        </div>
      </aside>
    </>
  );
};

export type { LeftPanelLayoutProperties };
