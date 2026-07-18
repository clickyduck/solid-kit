import { Button } from "@/components/button/Button";
import { Text } from "@/components/typography";
import { LAYOUT_TRANSITION_DURATION, TRANSITION_EASING, mergeClasses } from "@/utilities";
import type { Accessor, JSX } from "solid-js";
import { For, Show } from "solid-js";

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
//   - Selection is BLUE — blue text + `font-medium`, plus the underline (the sliding bar below in the
//     equal-width strip, or a per-tab `border-b-blue-500` in `scrollable` mode where variable widths
//     can't be expressed as a percentage translate).
//   - Hover is a NEUTRAL preview — the label darkens to the default text tier and a faint *gray*
//     underline appears. Gray, not blue, so "you can pick this" never mimics "this is picked".
// Button already transitions `color`/`border-color` at `duration-100`, so both cues fade in.
function tabButtonClasses(isSelected: boolean, scrollable: boolean): string {
  return mergeClasses(
    "rounded-t-lg rounded-b-none border-x-0 border-t-0 border-b-2 border-solid bg-transparent shadow-none hover:bg-transparent focus-visible:border-x-transparent focus-visible:border-t-transparent focus-visible:border-b-blue-500 dark:focus-visible:border-b-blue-400",
    scrollable ? "w-auto whitespace-nowrap" : "w-full min-w-0",
    isSelected
      ? mergeClasses("text-blue-700 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-300", scrollable ? "relative z-1 border-b-blue-500 hover:border-b-blue-500" : "border-b-transparent")
      : "border-b-transparent text-gray-700 hover:border-b-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:border-b-gray-600 dark:hover:text-gray-100"
  );
}

export function Tabs<TabValue extends string>(properties: TabsProperties<TabValue>): JSX.Element {
  const resolvedIsDisabled = (): boolean => {
    if (!properties.isDisabled) {
      return false;
    }
    return properties.isDisabled();
  };

  // Index of the active tab in the equal-width strip, used to position the sliding indicator. `-1`
  // (no tab matches) hides the bar. Each tab occupies an equal `1/count` slice, so the indicator is
  // `count`-wide and translated by whole multiples of its own width.
  const activeTabIndex = (): number => properties.tabDefinitions.findIndex((tabDefinition) => tabDefinition.tabValue === properties.activeTabValue());
  const tabCount = (): number => Math.max(properties.tabDefinitions.length, 1);

  return (
    <div class={mergeClasses("w-full min-w-0 border-b border-gray-200 text-center text-gray-700 dark:border-gray-700 dark:text-gray-300", properties.class)}>
      <ul
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
            return (
              <li class={mergeClasses("flex", properties.scrollable ? "shrink-0" : "min-w-0 flex-1 basis-0")} role="presentation">
                <Button
                  variant="ghost"
                  id={tabDefinition.tabElementIdentifier}
                  role="tab"
                  aria-controls={tabDefinition.panelElementIdentifier}
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
        {/* Sliding underline for the equal-width strip: one bar that glides between tabs instead of
            the border snapping tab-to-tab. `scrollable` keeps the per-tab fallback border instead
            (variable widths can't be expressed as a percentage translate). */}
        <Show when={!properties.scrollable}>
          <div
            aria-hidden="true"
            class={mergeClasses(
              "pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-blue-500 dark:bg-blue-400",
              "transition-[transform,width,opacity] motion-reduce:transition-none",
              LAYOUT_TRANSITION_DURATION,
              TRANSITION_EASING,
              activeTabIndex() < 0 ? "opacity-0" : "opacity-100"
            )}
            style={{
              width: `${100 / tabCount()}%`,
              transform: `translateX(${Math.max(activeTabIndex(), 0) * 100}%)`
            }}
          />
        </Show>
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
