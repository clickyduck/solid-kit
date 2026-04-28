import { Button } from "@/components/button/Button";
import type { IconComponent } from "@/components/icons";
import { mergeClasses } from "@/utilities";
import type { Accessor, JSX } from "solid-js";
import { For, Show } from "solid-js";

export type TabDefinition<TabValue extends string> = {
  tabValue: TabValue;
  label: string;
  tabElementIdentifier: string;
  panelElementIdentifier: string;
  icon?: IconComponent;
};

export type TabsProperties<TabValue extends string> = {
  tabDefinitions: readonly TabDefinition<TabValue>[];
  activeTabValue: Accessor<TabValue>;
  onTabSelect: (selectedTabValue: TabValue) => void;
  isDisabled?: Accessor<boolean>;
  class?: string;
  tabListClass?: string;
  listItemClass?: string;
  tabButtonClass?: string;
};

export function Tabs<TabValue extends string>(properties: TabsProperties<TabValue>): JSX.Element {
  const resolvedIsDisabled = (): boolean => {
    if (!properties.isDisabled) {
      return false;
    }
    return properties.isDisabled();
  };

  return (
    <div class={mergeClasses("w-full min-w-0 border-b border-gray-200 text-center font-medium text-gray-600 dark:border-gray-700 dark:text-gray-400", properties.class)}>
      <ul class={mergeClasses("-mb-px flex w-full flex-nowrap", properties.tabListClass)} role="tablist">
        <For each={[...properties.tabDefinitions]}>
          {(tabDefinition) => {
            const isSelected = (): boolean => {
              return properties.activeTabValue() === tabDefinition.tabValue;
            };
            return (
              <li class={mergeClasses("flex min-w-0", properties.listItemClass ?? "flex-1 basis-0")} role="presentation">
                <Button
                  variant="ghost"
                  id={tabDefinition.tabElementIdentifier}
                  role="tab"
                  aria-controls={tabDefinition.panelElementIdentifier}
                  aria-selected={isSelected()}
                  disabled={resolvedIsDisabled()}
                  icon={tabDefinition.icon}
                  class={mergeClasses(
                    "w-full min-w-0 rounded-t-md rounded-b-none border-x-0 border-t-0 border-b-2 border-solid bg-transparent font-medium shadow-none hover:bg-transparent focus-visible:border-x-transparent focus-visible:border-t-transparent focus-visible:border-b-blue-500 dark:focus-visible:border-b-blue-400",
                    isSelected()
                      ? "relative z-1 border-b-blue-500 text-blue-700 hover:border-b-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-400"
                      : "border-b-transparent text-gray-600 hover:border-b-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400",
                    properties.tabButtonClass
                  )}
                  onClick={() => {
                    properties.onTabSelect(tabDefinition.tabValue);
                  }}
                >
                  <Show when={tabDefinition.icon !== undefined} fallback={tabDefinition.label}>
                    <span class="min-w-0 truncate">{tabDefinition.label}</span>
                  </Show>
                </Button>
              </li>
            );
          }}
        </For>
      </ul>
    </div>
  );
}
