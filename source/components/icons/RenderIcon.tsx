import { Icon } from "@/components/icons/Icons";
import { mergeClasses } from "@/utilities/mergeClasses";
import type { JSX } from "solid-js";
import { Show } from "solid-js";

type RenderIconProperties = {
  icon: string | JSX.Element;
  size: number;
  class?: string;
};

/**
 * Renders either a Material Symbols icon (when `icon` is a string slug) or an
 * inline element wrapped in a fixed-size span. Single point for sizing,
 * `aria-hidden`, and `pointer-events-none` so adornments do not affect layout
 * or capture clicks.
 */
export const RenderIcon = (properties: RenderIconProperties): JSX.Element => {
  return (
    <Show
      when={typeof properties.icon === "string"}
      fallback={
        <span class={mergeClasses("pointer-events-none inline-flex shrink-0 items-center justify-center", properties.class)} style={{ width: `${properties.size}px`, height: `${properties.size}px` }} aria-hidden="true">
          {properties.icon}
        </span>
      }
    >
      <Icon name={properties.icon as string} size={properties.size} class={mergeClasses("pointer-events-none shrink-0 text-current", properties.class)} aria-hidden="true" />
    </Show>
  );
};
