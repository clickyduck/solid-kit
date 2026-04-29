import { mergeClasses } from "@/utilities/mergeClasses";
import type { ParentComponent } from "solid-js";

type MainLayoutProperties = {
  /**
   * Optional className for the root grid wrapper.
   * The layout uses CSS grid areas: header, left, main, right.
   */
  class?: string;
};

/**
 * Application shell layout.
 *
 * Intended usage (direct children):
 * - `HeaderLayout` (grid area: header)
 * - `LeftPanelLayout` (grid area: left)
 * - `PageLayout` (grid area: main)
 * - `RightPanelLayout` (grid area: right)
 */
export const MainLayout: ParentComponent<MainLayoutProperties> = (properties) => {
  return (
    <div
      class={mergeClasses("grid min-h-screen w-full min-w-0 overflow-hidden", "bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100", "gap-x-6", properties.class)}
      style={{
        "--solid-kit-header-height": "4rem",
        "grid-template-areas": `"header header header" "left main right"`,
        "grid-template-rows": "auto 1fr",
        "grid-template-columns": "auto 1fr auto"
      }}
    >
      {properties.children}
    </div>
  );
};

export type { MainLayoutProperties };
