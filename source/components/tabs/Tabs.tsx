import { Button } from "@/components/button/Button";
import { Text } from "@/components/typography";
import { mergeClasses } from "@/utilities";
import type { Accessor, JSX } from "solid-js";
import { For } from "solid-js";

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

export function Tabs<TabValue extends string>(properties: TabsProperties<TabValue>): JSX.Element {
  const resolvedIsDisabled = (): boolean => {
    if (!properties.isDisabled) {
      return false;
    }
    return properties.isDisabled();
  };

  return (
    <div class={mergeClasses("w-full min-w-0 border-b border-gray-200 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400", properties.class)}>
      <ul
        class={mergeClasses(
          "-mb-px flex w-full flex-nowrap",
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
                  class={mergeClasses(
                    "rounded-t-lg rounded-b-none border-x-0 border-t-0 border-b-2 border-solid bg-transparent shadow-none hover:bg-transparent focus-visible:border-x-transparent focus-visible:border-t-transparent focus-visible:border-b-blue-500 dark:focus-visible:border-b-blue-400",
                    properties.scrollable ? "w-auto whitespace-nowrap" : "w-full min-w-0",
                    isSelected()
                      ? "relative z-1 border-b-blue-500 text-blue-700 hover:border-b-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-400"
                      : "border-b-transparent text-gray-600 hover:border-b-blue-500 hover:text-blue-600 dark:text-gray-400 dark:hover:border-b-blue-400 dark:hover:text-blue-400"
                  )}
                  onClick={() => {
                    properties.onTabSelect(tabDefinition.tabValue);
                  }}
                >
                  <Text as="span" size="small" weight={isSelected() ? "medium" : "normal"} color="inherit" display="inline" truncate={!properties.scrollable} class={properties.scrollable ? "" : "min-w-0"}>
                    {tabDefinition.label}
                  </Text>
                </Button>
              </li>
            );
          }}
        </For>
      </ul>
    </div>
  );
}
