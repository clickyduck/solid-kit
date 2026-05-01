import { mergeClasses } from "@/utilities";
import type { JSX, ParentComponent } from "solid-js";

type BackgroundCardProperties = {
  children: JSX.Element;
  class?: string;
};

/**
 * Simple fixed-style card shell.
 *
 * Usage:
 * `<BackgroundCard>...content...</BackgroundCard>`
 */
export const BackgroundCard: ParentComponent<BackgroundCardProperties> = (properties) => {
  return <div class={mergeClasses("rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-100", properties.class)}>{properties.children}</div>;
};

export type { BackgroundCardProperties };
