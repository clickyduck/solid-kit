import { Button } from "@/components/button/Button";
import { Icon } from "@/components/icons";
import { Text } from "@/components/typography";
import { HOVER_WASH_NEUTRAL_CLASSES } from "@/utilities/componentClassStrings";
import { mergeClasses } from "@/utilities/mergeClasses";
import { themedScrollControlClassName } from "@/utilities/themedScrollControlClassName";
import { useIsMobile } from "@/utilities/useIsMobile";
import { A } from "@solidjs/router";
import type { Component, JSX } from "solid-js";
import { For, Show, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";

/** One navigation row rendered inside a group. */
export type LeftPanelNavigationItemJson = {
  href: string;
  label: string;
  /** Material Symbols icon name, e.g. "dashboard", "settings", "account_balance_wallet" */
  icon: string;
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
  /** When true the panel starts in icon-only (collapsed) mode. Defaults to false. */
  collapsed?: boolean;
};

export type LeftPanelLayoutNavigationDocumentJson = LeftPanelNavigationDocumentJson;

const NAVIGATION_LINK_ICON_CLASS = "nav-link-icon shrink-0 opacity-80 w-4.5 h-4.5";
// transition-colors (not transition-all): the row only animates its hover/active background and
// text color. Animating "all" would also tween the padding/width change between the expanded and
// collapsed layouts, double-animating against the panel's own transition-[width] and reading janky.
// The default (inactive) text color lives on NAVIGATION_LINK_INACTIVE_CLASS, not here, so the active
// and inactive classes are mutually exclusive on the text-color utility. @solidjs/router's <A>
// concatenates activeClass/inactiveClass onto this base as raw strings (no tailwind-merge), so a base
// text color would sit alongside the active blue and let stylesheet order — not intent — pick the
// winner. Keeping the color only in the two state classes avoids that.
const NAVIGATION_LINK_ROW_CLASS = "group flex min-w-0 items-center rounded-lg h-10 min-h-10 max-h-10 text-sm transition-colors duration-100 ease-out";
const NAVIGATION_LINK_LABEL_CLASS = "nav-link-label min-w-0 truncate";
const NAVIGATION_LINK_EXPANDED_LAYOUT_CLASS = "px-2.5 space-x-3";
const NAVIGATION_LINK_COLLAPSED_LAYOUT_CLASS = "size-10 mx-auto justify-center";
// The active row also steps its label to font-medium (matching Tabs/ToggleGroup's selected-state
// emphasis). The label is a <Text> that stamps its own `font-normal` on the span, so the bump is a
// descendant override with `!` to beat that element-level class — a plain inherited `font-medium`
// on the row would lose to it. Router's <A> concatenates activeClass as a raw string (no
// tailwind-merge), which the `!` also sidesteps: important wins regardless of source order.
const NAVIGATION_LINK_ACTIVE_CLASS = "bg-blue-500/10 text-blue-700 dark:text-blue-300 [&_.nav-link-label]:font-medium! [&_.nav-link-icon]:opacity-100 [&_.nav-link-icon]:text-blue-600 dark:[&_.nav-link-icon]:text-blue-400";
const NAVIGATION_LINK_INACTIVE_CLASS = `text-gray-800 dark:text-gray-100 ${HOVER_WASH_NEUTRAL_CLASSES}`;
/** Group label slot above each group's items, aligned to the same left edge so the label reads as belonging to the items beneath it. Sized to a standard control height (h-10) so the collapsible toggle matches every other button. */
const NAVIGATION_GROUP_HEADING_SLOT_CLASS = "mb-1.5 flex h-10 min-h-10 max-h-10 w-full shrink-0 items-stretch";
const GROUP_LABEL_TEXT_CLASS = "flex w-full min-w-0 items-center px-2.5 text-xs leading-none font-semibold tracking-wide text-gray-600 dark:text-gray-300 uppercase";

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
  anchorTag?: "A" | "a";
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
        fallback={
          <Text as="div" size="small" color="muted" display="block" class={mergeClasses("rounded-lg border border-dashed border-gray-200 p-4 dark:border-gray-800", properties.collapsed ? "hidden" : "")}>
            No matches. Try a different search term.
          </Text>
        }
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
              return group.collapsibleNavigationGroup === true && !properties.collapsed;
            });
            const isNavigationGroupBodyExpandedMemo = createMemo(() => {
              return resolveNavigationGroupBodyExpanded(navigationGroupIdentifierMemo(), navigationGroupInitiallyCollapsedMemo());
            });

            const renderNavigationItemLink = (item: LeftPanelLayoutNavigationItemJson): JSX.Element => {
              const usePlainAnchor = (properties.anchorTag ?? "A") === "a";
              const isHashLink = item.href.startsWith("#");
              // A function, not a plain string: <For> renders each item's element once and only re-runs
              // this callback when the *item* changes, so a `collapsed`-derived const captured here would
              // freeze at mount time. When the panel is first expanded from a persisted-collapsed load,
              // the row would keep the icon-only layout (fixed width, centred) while the label <Show>
              // below reactively reveals its text — crushing it to a truncated "H…". Passing a getter to
              // `class` keeps the layout class tracking `collapsed`.
              const baseLinkClass = (): string => mergeClasses(NAVIGATION_LINK_ROW_CLASS, properties.collapsed ? NAVIGATION_LINK_COLLAPSED_LAYOUT_CLASS : NAVIGATION_LINK_EXPANDED_LAYOUT_CLASS);
              const linkChildren = (
                <>
                  <Icon name={item.icon} size={18} class={NAVIGATION_LINK_ICON_CLASS} aria-hidden="true" />
                  <Show when={!properties.collapsed}>
                    <Text as="span" size="small" weight="normal" color="inherit" display="inline" truncate class={NAVIGATION_LINK_LABEL_CLASS}>
                      {item.label}
                    </Text>
                  </Show>
                </>
              );

              // Router route link: let @solidjs/router's <A> own active detection. It derives active
              // state from the reactive router location, so it updates on any navigation — including a
              // programmatic navigate() from elsewhere (e.g. the header account menu) that fires no
              // popstate/hashchange event, which the window-listener path below would miss. `end` maps
              // to exact matching; <A> also sets aria-current="page" itself.
              if (!usePlainAnchor && !isHashLink) {
                return (
                  <A
                    href={item.href}
                    end={item.matchRouteExactly === true}
                    class={baseLinkClass()}
                    activeClass={NAVIGATION_LINK_ACTIVE_CLASS}
                    inactiveClass={NAVIGATION_LINK_INACTIVE_CLASS}
                    aria-label={item.label}
                    onClick={() => {
                      properties.onItemClick?.();
                    }}
                  >
                    {linkChildren}
                  </A>
                );
              }

              // Hash-anchor links and non-router (plain <a>) links have no router-native active state,
              // so they keep the window-location signal + manual class. Hash links also intercept the
              // click to smooth-scroll to the in-page target.
              const isActive = (): boolean => computeIsNavigationItemActive(item, pathname(), hash());
              const linkClass = (): string => mergeClasses(baseLinkClass(), isActive() ? NAVIGATION_LINK_ACTIVE_CLASS : NAVIGATION_LINK_INACTIVE_CLASS);
              const handleClick = (event: MouseEvent): void => {
                if (typeof window === "undefined") return;
                if (isHashLink) {
                  event.preventDefault();
                  const targetIdentifier = item.href.slice(1);
                  if (targetIdentifier.length === 0) return;
                  const targetElement = window.document.getElementById(targetIdentifier);
                  if (!targetElement) return;
                  if (window.location.hash !== item.href) {
                    window.history.pushState(null, "", item.href);
                    setHash(item.href);
                  }
                  const scrollContainer = targetElement.closest(".layout-page") as HTMLElement | null;
                  if (scrollContainer) {
                    const scrollMargin = Number.parseInt(window.getComputedStyle(targetElement).scrollMarginTop, 10) || 0;
                    const targetTop = targetElement.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top + scrollContainer.scrollTop - scrollMargin;
                    scrollContainer.scrollTo({ top: targetTop, behavior: "smooth" });
                  } else {
                    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                } else {
                  setTimeout(() => {
                    setPathname(window.location.pathname);
                    setHash(window.location.hash);
                  }, 0);
                }
                properties.onItemClick?.();
              };
              return (
                <Dynamic component={usePlainAnchor ? "a" : A} href={item.href} class={linkClass()} aria-current={isActive() ? "page" : undefined} aria-label={item.label} onClick={handleClick}>
                  {linkChildren}
                </Dynamic>
              );
            };

            return (
              <div class="space-y-1">
                <div class={NAVIGATION_GROUP_HEADING_SLOT_CLASS}>
                  <Show
                    when={useCollapsibleNavigationGroupMemo()}
                    fallback={
                      <div class={mergeClasses("h-full min-h-0", GROUP_LABEL_TEXT_CLASS, properties.collapsed ? "pointer-events-none invisible" : "")} aria-hidden={properties.collapsed ? true : undefined}>
                        <Text as="span" size="caption" weight="semibold" color="inherit" transform="uppercase" display="inline" truncate class="min-w-0">
                          {group.groupLabel}
                        </Text>
                      </div>
                    }
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      class={mergeClasses("w-full min-w-0 justify-between gap-2 px-2.5 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300")}
                      aria-expanded={isNavigationGroupBodyExpandedMemo()}
                      onClick={() => {
                        toggleNavigationGroupBody(navigationGroupIdentifierMemo(), navigationGroupInitiallyCollapsedMemo());
                      }}
                    >
                      <Text as="span" size="caption" weight="semibold" color="inherit" transform="uppercase" display="inline" truncate class="min-w-0 flex-1">
                        {group.groupLabel}
                      </Text>
                      <span class={mergeClasses("inline-flex shrink-0 items-center justify-center text-gray-600 transition-transform duration-200 ease-out dark:text-gray-400", isNavigationGroupBodyExpandedMemo() ? "rotate-180" : "rotate-0")} aria-hidden>
                        <Icon name="keyboard_arrow_down" size={16} class="size-4" />
                      </span>
                    </Button>
                  </Show>
                </div>
                <Show
                  when={useCollapsibleNavigationGroupMemo()}
                  fallback={
                    <div class={mergeClasses("space-y-1", properties.collapsed ? "" : "ml-3 border-l border-gray-200 pl-2 dark:border-gray-700/80")}>
                      <For each={group.items}>{(item) => renderNavigationItemLink(item)}</For>
                    </div>
                  }
                >
                  {/* Collapsible body: animate the group open/closed at the layout tier via the
                      grid-rows 0fr↔1fr trick — no height measuring, and the inner overflow-hidden
                      clips the items as the track collapses. motion-reduce drops the height tween.
                      The items stay mounted (so they can animate), so `inert` when collapsed takes
                      them out of tab order and the accessibility tree. */}
                  <div
                    class={mergeClasses("grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none", isNavigationGroupBodyExpandedMemo() ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                    inert={!isNavigationGroupBodyExpandedMemo()}
                  >
                    <div class="overflow-hidden">
                      <div class={mergeClasses("space-y-1", properties.collapsed ? "" : "ml-3 border-l border-gray-200 pl-2 dark:border-gray-700/80")}>
                        <For each={group.items}>{(item) => renderNavigationItemLink(item)}</For>
                      </div>
                    </div>
                  </div>
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
  /** When true the panel is in icon-only mode. Defaults to `navigationDocument.collapsed ?? false`. */
  collapsed?: boolean;
  onOpenChange?: (isPanelOpen: boolean) => void;
  navigationDocument: LeftPanelLayoutNavigationDocumentJson;
  scrim?: boolean;
  /** Tailwind z-index for the scrim layer (panel stays above). Defaults to `z-30`. */
  scrimZIndexClass?: string;
  /** Tailwind z-index for the panel layer. Defaults to `z-40`. */
  panelZIndexClass?: string;
  /** Desktop width when expanded (defaults to `md:w-64`). */
  expandedWidthClass?: string;
  /** Desktop width when collapsed (defaults to `md:w-16`). */
  collapsedWidthClass?: string;
  /** Tag used for navigation links. "A" (default) is @solidjs/router's <A>; "a" is a plain anchor for non-router contexts. */
  anchorTag?: "A" | "a";
};

/**
 * Collapsible application sidebar with touch swipe-to-close on small viewports; navigation content comes from JSON.
 */
export const LeftPanelLayout: Component<LeftPanelLayoutProperties> = (properties) => {
  const resolvedCollapsed = (): boolean => properties.collapsed ?? properties.navigationDocument.collapsed ?? false;
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

  const isActiveSwipeTarget = (event: PointerEvent): boolean => {
    return !resolvedCollapsed() && isMobileViewport() && event.pointerType === "touch";
  };

  return (
    <>
      <Show when={(properties.scrim ?? true) && !resolvedCollapsed() && isMobileViewport()}>
        <div
          role="presentation"
          aria-hidden="true"
          class={mergeClasses(properties.scrimZIndexClass ?? "z-30", "fixed inset-0 bg-black/50", "top-(--solid-kit-header-height,4rem)", "transition-opacity duration-200 ease-out")}
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
          "layout-left-panel flex min-h-0 flex-col border-r border-gray-200 bg-white dark:border-gray-700/80 dark:bg-gray-950",
          isMobileViewport()
            ? [properties.panelZIndexClass ?? "z-40", "fixed inset-x-0 bottom-0 w-full transition-transform duration-200 ease-out", "top-(--solid-kit-header-height,4rem)", resolvedCollapsed() ? "-translate-x-full" : "translate-x-0"]
            : ["static h-full transition-[width] duration-200 ease-out", resolvedCollapsed() ? (properties.collapsedWidthClass ?? "w-16") : (properties.expandedWidthClass ?? "w-64")]
        )}
        style={
          !resolvedCollapsed() && isMobileViewport()
            ? {
                "grid-area": "left",
                transform: `translateX(${swipeTranslationX()}px)`,
                "touch-action": "pan-y",
                transition: isSwipeDragging() ? "none" : undefined
              }
            : { "grid-area": "left", "touch-action": "auto" }
        }
        onPointerDown={(event: PointerEvent) => {
          if (!isActiveSwipeTarget(event)) return;
          (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
          setSwipeStartClientX(event.clientX);
          setSwipeStartClientY(event.clientY);
          setSwipeTranslationX(0);
          setIsSwipeGestureActive(false);
          setIsSwipeDragging(false);
        }}
        onPointerMove={(event: PointerEvent) => {
          if (!isActiveSwipeTarget(event)) return;
          const initialClientX = swipeStartClientX();
          const initialClientY = swipeStartClientY();
          if (initialClientX == null || initialClientY == null) return;
          const deltaX = event.clientX - initialClientX;
          const deltaY = event.clientY - initialClientY;

          if (!isSwipeGestureActive()) {
            if (Math.abs(deltaX) < 8) return;
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
          if (!isActiveSwipeTarget(event)) return;
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
          if (!isActiveSwipeTarget(event)) return;
          resetSwipeGesture();
          setSwipeTranslationX(0);
        }}
      >
        <div class={mergeClasses("flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-y-auto px-3 py-4", themedScrollControlClassName)}>
          <LeftPanelNavigationBody
            collapsed={resolvedCollapsed()}
            navigationDocument={properties.navigationDocument}
            anchorTag={properties.anchorTag}
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
