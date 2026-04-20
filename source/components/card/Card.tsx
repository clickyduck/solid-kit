import { mergeClasses } from "@/utilities";
import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

/**
 * Compound card layout: container, header, title, description, content, and footer.
 */
export const Card = (properties: ComponentProps<"div">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return (
    <div
      class={mergeClasses(
        "rounded-lg border border-gray-200 bg-white p-6 shadow-[0_1px_2px_-1px_rgba(15,23,42,0.06),0_2px_4px_-2px_rgba(15,23,42,0.04),0_8px_24px_-6px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/20 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_2px_8px_-2px_rgba(0,0,0,0.45),0_16px_40px_-12px_rgba(0,0,0,0.35)]",
        local.class
      )}
      {...rest}
    />
  );
};

export const CardHeader = (properties: ComponentProps<"div">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("mb-4 flex flex-col space-y-1.5", local.class)} {...rest} />;
};

export const CardTitle = (properties: ComponentProps<"h3">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <h3 class={mergeClasses("text-2xl font-bold tracking-tight text-gray-900 dark:text-white", local.class)} {...rest} />;
};

export const CardDescription = (properties: ComponentProps<"p">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <p class={mergeClasses("text-sm text-gray-500 dark:text-gray-400", local.class)} {...rest} />;
};

export const CardContent = (properties: ComponentProps<"div">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("text-gray-700 dark:text-gray-300", local.class)} {...rest} />;
};

export const CardFooter = (properties: ComponentProps<"div">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("mt-4 flex items-center", local.class)} {...rest} />;
};
