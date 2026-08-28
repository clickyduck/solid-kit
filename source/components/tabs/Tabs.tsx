import { Button } from "@/components/button/Button";
import { Text } from "@/components/typography";
import { LAYOUT_TRANSITION_DURATION, TRANSITION_EASING, mergeClasses } from "@/utilities";
import type { Accessor, JSX } from "solid-js";
import { For, Show, createEffect, createSignal, on, onCleanup, onMount } from "solid-js";

export type TabDefinition<TabValue extends string> = {
  tabValue: TabValue;
  label: string;
  tabElementIdentifier: string;
  panelElementIdentifier: string;
  icon?: string | JSX.Element;
};

export type TabsProperties<TabValue extends string> = {
  tabDefinitions: readonly TabDefinition<TabValue>[];
  activeTabValue: Accessor<TabValue>;
  onTabSelect: (selectedTabValue: TabValue) => void;
  isDisabled?: Accessor<boolean>;
  // When true, tabs keep their natural width and the strip scrolls horizontally instead of every
  // tab sharing the row equally and truncating. Use for an unbounded set (e.g. menu categories).
  scrollable?: boolean;
  class?: string;
};

// Classes for a single tab button. Hover and selection are deliberately kept in two different visual
// languages so a hovered tab never reads as the selected one:
//   - Selection is BLUE — blue text + `font-medium` — with the underline drawn by the sliding
//     indicator bar below (one bar that glides to the active tab in BOTH the equal-width and the
//     scrollable strip), so the button itself keeps a transparent bottom border.
//   - Hover is a NEUTRAL preview — the label darkens to the default text tier and a faint *gray*
//     underline appears. Gray, not blue, so "you can pick this" never mimics "this is picked".
// Button already transitions `color`/`border-color` at `duration-100`, so both cues fade in.
function tabButtonClasses(isSelected: boolean, scrollable: boolean): string {
  return mergeClasses(
    "rounded-t-lg rounded-b-none border-x-0 border-t-0 border-b-2 border-solid bg-transparent shadow-none hover:bg-transparent focus-visible:border-x-transparent focus-visible:border-t-transparent focus-visible:border-b-blue-500 dark:focus-visible:border-b-blue-400",
    scrollable ? "w-auto whitespace-nowrap" : "w-full min-w-0",
    isSelected
      ? "border-b-transparent text-blue-700 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-300"
      : "border-b-transparent text-gray-700 hover:border-b-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:border-b-gray-600 dark:hover:text-gray-100"
  );
}

// The active tab's underline placement, in pixels measured from the live DOM. Measuring the real
// element (rather than deriving the position from the tab index) is what lets ONE sliding bar serve
// both strips: the earlier percentage translate assumed every tab was exactly `1/count` wide, so a
// variable-width scrollable strip had no closed-form position and fell back to a per-tab border that
// snapped. `null` until first measured — or when no tab is selected — which keeps the bar hidden.
type IndicatorPlacement = { left: number; width: number };

export function Tabs<TabValue extends string>(properties: TabsProperties<TabValue>): JSX.Element {
  const resolvedIsDisabled = (): boolean => {
    if (!properties.isDisabled) {
      return false;
    }
    return properties.isDisabled();
  };

  let tabListElement: HTMLUListElement | undefined;
  const [indicator, setIndicator] = createSignal<IndicatorPlacement | null>(null);
  // Gate the glide off until the first placement has painted, so the bar appears already sitting under
  // the active tab on mount rather than sweeping in from the left edge. Selection changes after mount
  // then animate. onMount runs before the browser's first paint, so the initial (transition-less)
  // placement is what the user first sees.
  const [hasSettled, setHasSettled] = createSignal(false);

  // Measure the selected tab straight from the DOM. Reading the live element is deliberate — a
  // variable-width scrollable tab has no position derivable from data alone. Falls back to `null` when
  // nothing is selected so the bar hides rather than freezing on a stale spot. The tab button is the
  // list's only positioned reference (the `<ul>` is `relative`), so its offsets are already in the
  // bar's coordinate space, and inside the scrolling list the bar tracks the tab through scroll for free.
  const measureIndicator = (): void => {
    if (!tabListElement) {
      setIndicator(null);
      return;
    }
    const selectedTab = tabListElement.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (!selectedTab) {
      setIndicator(null);
      return;
    }
    setIndicator({ left: selectedTab.offsetLeft, width: selectedTab.offsetWidth });
  };

  // Re-measure whenever the selection or the tab set changes. Reading `tabDefinitions` also tracks
  // label / count / order edits, since those move a variable-width tab's neighbours (and so its offset).
  createEffect(
    on([(): TabValue => properties.activeTabValue(), (): readonly TabDefinition<TabValue>[] => properties.tabDefinitions], () => {
      measureIndicator();
    })
  );

  onMount(() => {
    measureIndicator();
    // Enable the glide only after the first frame so the initial placement lands instantly.
    const settleFrame = requestAnimationFrame(() => {
      setHasSettled(true);
    });
    // The equal-width strip's tab widths track the container width, and a font swap can re-flow the
    // scrollable strip — both change the measurement with no selection change, so watch the box.
    // ResizeObserver is absent in some test DOMs; skipping it there only forgoes resize re-measures.
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => measureIndicator()) : null;
    if (resizeObserver && tabListElement) {
      resizeObserver.observe(tabListElement);
    }
    if (typeof document !== "undefined" && "fonts" in document) {
      void document.fonts.ready.then(() => {
        measureIndicator();
      });
    }
    onCleanup(() => {
      cancelAnimationFrame(settleFrame);
      resizeObserver?.disconnect();
    });
  });

  return (
    <div class={mergeClasses("w-full min-w-0 border-b border-gray-200 text-center text-gray-700 dark:border-gray-700 dark:text-gray-300", properties.class)}>
      <ul
        ref={(element) => {
          tabListElement = element;
        }}
        class={mergeClasses(
          "relative -mb-px flex w-full flex-nowrap",
          // Scrollable strips overflow horizontally; the default strip shares the row across tabs.
          properties.scrollable ? "overflow-x-auto" : ""
        )}
        role="tablist"
      >
        <For each={properties.tabDefinitions}>
          {(tabDefinition) => {
            const isSelected = (): boolean => {
              return properties.activeTabValue() === tabDefinition.tabValue;
            };
            // Only the selected tab's panel is in the document, so only the selected tab may point
            // at one. An aria-controls naming an element that does not exist is an invalid attribute
            // value, and assistive technology follows the reference into nothing.
            const controlledPanelIdentifier = (): string | undefined => {
              return isSelected() ? tabDefinition.panelElementIdentifier : undefined;
            };
            return (
              <li class={mergeClasses("flex", properties.scrollable ? "shrink-0" : "min-w-0 flex-1 basis-0")} role="presentation">
                <Button
                  variant="ghost"
                  id={tabDefinition.tabElementIdentifier}
                  role="tab"
                  aria-controls={controlledPanelIdentifier()}
                  aria-selected={isSelected()}
                  disabled={resolvedIsDisabled()}
                  icon={tabDefinition.icon}
                  class={tabButtonClasses(isSelected(), properties.scrollable === true)}
                  onClick={() => {
                    properties.onTabSelect(tabDefinition.tabValue);
                  }}
                >
                  <TabLabel label={tabDefinition.label} isSelected={isSelected()} scrollable={properties.scrollable === true} />
                </Button>
              </li>
            );
          }}
        </For>
        {/* One sliding underline for every strip. Positioned in pixels from the measured active tab, it
            glides under equal-width AND variable-width scrollable tabs alike (the old percentage bar
            could only do equal-width, so scrollable snapped a per-tab border instead). It lives inside
            the list, so in scrollable mode it scrolls with the tabs. The transition is withheld until
            the first placement so the bar never sweeps in from the edge on mount. */}
        <div
          aria-hidden="true"
          class={mergeClasses(
            "pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-blue-500 dark:bg-blue-400",
            hasSettled() ? mergeClasses("transition-[transform,width,opacity] motion-reduce:transition-none", LAYOUT_TRANSITION_DURATION, TRANSITION_EASING) : "",
            indicator() ? "opacity-100" : "opacity-0"
          )}
          style={{
            width: `${indicator()?.width ?? 0}px`,
            transform: `translateX(${indicator()?.left ?? 0}px)`
          }}
        />
      </ul>
    </div>
  );
}

// The tab label. In `scrollable` mode the tab is content-sized, so switching a selected label to
// `font-medium` (the design system's active-state emphasis) would widen the tab and shift the whole
// strip on every selection. An invisible bold ghost, overlaid in the same grid cell, permanently
// reserves the medium width so the visible copy can change weight without reflowing its neighbours.
// The equal-width strip doesn't need this (tabs are fixed at `flex-1 basis-0` and truncate), so it
// renders a single truncating label.
function TabLabel(properties: { label: string; isSelected: boolean; scrollable: boolean }): JSX.Element {
  return (
    <Show
      when={properties.scrollable}
      fallback={
        <Text as="span" size="small" weight={properties.isSelected ? "medium" : "normal"} color="inherit" display="inline" truncate class="min-w-0">
          {properties.label}
        </Text>
      }
    >
      <span class="grid">
        <Text as="span" aria-hidden="true" size="small" weight="medium" color="inherit" display="inline" class="invisible col-start-1 row-start-1">
          {properties.label}
        </Text>
        <Text as="span" size="small" weight={properties.isSelected ? "medium" : "normal"} color="inherit" display="inline" class="col-start-1 row-start-1">
          {properties.label}
        </Text>
      </span>
    </Show>
  );
}
