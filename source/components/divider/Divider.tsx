import { mergeClasses } from "@/utilities";
import type { ComponentProps } from "solid-js";

export type DividerProps = Omit<ComponentProps<"div">, "role">;

export const Divider = (properties: DividerProps) => {
  const className = () => {
    return mergeClasses("h-px w-full shrink-0 bg-gray-200/70 dark:bg-gray-800/50", properties.class);
  };

  return <div {...properties} role="separator" aria-orientation="horizontal" class={className()} />;
};
