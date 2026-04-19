import type { Component } from "solid-js";

interface SpinnerProperties {
  class?: string;
  size?: number;
  "aria-label"?: string;
}

/**
 * Loading spinner using Tailwind's animate-spin. No custom CSS required.
 */
export const Spinner: Component<SpinnerProperties> = (properties) => {
  return (
    <span
      role="status"
      class={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${properties.class ?? ""}`.trim()}
      style={{ width: `${(properties.size ?? 32).toString()}px`, height: `${(properties.size ?? 32).toString()}px` }}
      aria-hidden={properties["aria-label"] === undefined}
      aria-label={properties["aria-label"]}
    />
  );
};
