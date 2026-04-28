import { Icon, type IconComponent } from "@/components/icons";
import { mergeClasses } from "@/utilities";
import type { ComponentProps, JSX } from "solid-js";
import { For, Show, splitProps } from "solid-js";

type DataCardFooterItem = {
  icon: IconComponent;
  label: string;
  value: string;
  valueClass?: string;
};

type DataCardProps = Omit<ComponentProps<"button">, "children"> & {
  title: string;
  description?: string;
  topRight?: JSX.Element;
  footerItems?: DataCardFooterItem[];
  active?: boolean;
  class?: string;
};

/**
 * Clickable data card with the same layout/styling as the app's ticket card.
 */
export const DataCard = (properties: DataCardProps) => {
  const [local, rest] = splitProps(properties, ["title", "description", "topRight", "footerItems", "active", "class"]);

  const isActive = (): boolean => {
    return local.active === true;
  };

  return (
    <button
      type="button"
      class={mergeClasses(
        "group w-full cursor-pointer rounded-lg border text-left transition focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:outline-none",
        isActive() ? "border-blue-500/70 bg-gray-800/90 ring-1 ring-blue-500/30" : "border-gray-700/60 bg-gray-800/60 hover:border-gray-600 hover:bg-gray-800/80",
        "h-auto min-h-0 items-stretch justify-start px-0 py-0",
        local.class
      )}
      {...rest}
    >
      <div class="flex w-full flex-col gap-2 p-3">
        <div class="flex items-start gap-2">
          <span class="line-clamp-2 min-w-0 flex-1 text-sm leading-snug font-semibold text-white">{local.title}</span>
          <Show when={local.topRight} keyed>
            {(resolvedTopRight) => {
              return <span class="shrink-0 opacity-80">{resolvedTopRight}</span>;
            }}
          </Show>
        </div>
        <Show when={local.description?.trim()}>
          <p class="line-clamp-2 text-xs leading-relaxed text-gray-400">{local.description!.trim()}</p>
        </Show>
        <Show when={(local.footerItems?.length ?? 0) > 0}>
          <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-t border-gray-700/50 pt-2 text-xs text-gray-400">
            <For each={local.footerItems ?? []}>
              {(footerItem) => {
                return (
                  <span class="inline-flex min-w-0 items-center gap-1.5">
                    <Icon icon={footerItem.icon} width={14} height={14} class="shrink-0 text-gray-500" aria-hidden="true" />
                    <span class="shrink-0 text-gray-500">{footerItem.label}</span>
                    <span class={mergeClasses("truncate text-gray-300", footerItem.valueClass)}>{footerItem.value}</span>
                  </span>
                );
              }}
            </For>
          </div>
        </Show>
      </div>
    </button>
  );
};
