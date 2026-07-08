import { CONTENT_CARD_SURFACE_CLASSES, SURFACE_RADIUS_SHELL, mergeClasses } from "@/utilities";
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
  return <div class={mergeClasses(SURFACE_RADIUS_SHELL, CONTENT_CARD_SURFACE_CLASSES, "p-3 sm:p-4 md:p-5 lg:p-6", properties.class)}>{properties.children}</div>;
};

export type { BackgroundCardProperties };
