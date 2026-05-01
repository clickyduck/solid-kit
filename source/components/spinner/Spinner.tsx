import { mergeClasses } from "@/utilities";
import type { Component, ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

export type SpinnerProperties = Omit<ComponentProps<"span">, "style"> & {
  "aria-label"?: string;
};

export const Spinner: Component<SpinnerProperties> = (properties) => {
  const [local, rest] = splitProps(properties, ["aria-label", "class"]);

  return (
    <span
      {...rest}
      role="status"
      class={mergeClasses("inline-block size-8 animate-spin rounded-full border-2 border-current border-t-transparent text-blue-500 dark:text-blue-400", local.class)}
      aria-hidden={local["aria-label"] === undefined}
      aria-label={local["aria-label"]}
    />
  );
};
