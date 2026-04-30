import { mergeClasses } from "@/utilities/mergeClasses";
import type { ComponentProps, ParentComponent } from "solid-js";
import { splitProps } from "solid-js";

export type DividerProps = Omit<ComponentProps<"div">, "role">;

export const Divider: ParentComponent<DividerProps> = (properties) => {
  const [local, rest] = splitProps(properties, ["class"]);

  return <div role="separator" aria-orientation="horizontal" class={mergeClasses("shrink-0", "h-px w-full", "bg-gray-200/70 dark:bg-gray-800/50", local.class)} {...rest} />;
};
