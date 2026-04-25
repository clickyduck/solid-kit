import { mergeClasses } from "@/utilities";
import type { Component } from "solid-js";

interface SpinnerProperties {
  class?: string;
  "aria-label"?: string;
}

export const Spinner: Component<SpinnerProperties> = (properties) => {
  return <span role="status" class={mergeClasses("inline-block size-8 animate-spin rounded-full border-2 border-current border-t-transparent", properties.class)} aria-hidden={properties["aria-label"] === undefined} aria-label={properties["aria-label"]} />;
};
