import { mergeClasses } from "@/utilities";
import type { Component, ComponentProps, JSX } from "solid-js";
import { splitProps } from "solid-js";

export type SpinnerProperties = ComponentProps<"span"> & {
  /**
   * Pixel size for width/height. When omitted, defaults to Tailwind `size-8`.
   */
  size?: number;
  "aria-label"?: string;
};

export const Spinner: Component<SpinnerProperties> = (properties) => {
  const [local, rest] = splitProps(properties, ["size", "class", "style", "aria-label"]);

  const resolvedStyle = (): JSX.CSSProperties | string | undefined => {
    if (typeof local.size === "number" && Number.isFinite(local.size) && local.size > 0) {
      return { width: `${local.size}px`, height: `${local.size}px`, ...(typeof local.style === "object" ? local.style : {}) };
    }
    return local.style;
  };

  const resolvedSizeClass = (): string => {
    if (typeof local.size === "number" && Number.isFinite(local.size) && local.size > 0) {
      return "";
    }
    return "size-8";
  };

  return (
    <span
      {...rest}
      role="status"
      class={mergeClasses("inline-block animate-spin rounded-full border-2 border-current border-t-transparent", resolvedSizeClass(), local.class)}
      style={resolvedStyle()}
      aria-hidden={local["aria-label"] === undefined}
      aria-label={local["aria-label"]}
    />
  );
};
