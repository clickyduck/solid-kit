import { mergeClasses } from "@/utilities";
import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

/**
 * Compound background card layout: container, header, title, description, content, and footer.
 */
export const BackgroundCard = (properties: ComponentProps<"div">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("rounded-lg border border-gray-200 bg-white p-6 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/20", local.class)} {...rest} />;
};

export const BackgroundCardHeader = (properties: ComponentProps<"div">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("mb-4 flex flex-col space-y-1.5", local.class)} {...rest} />;
};

export const BackgroundCardTitle = (properties: ComponentProps<"h3">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <h3 class={mergeClasses("text-2xl font-bold tracking-tight text-gray-900 dark:text-white", local.class)} {...rest} />;
};

export const BackgroundCardDescription = (properties: ComponentProps<"p">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <p class={mergeClasses("text-sm text-gray-500 dark:text-gray-400", local.class)} {...rest} />;
};

export const BackgroundCardContent = (properties: ComponentProps<"div">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("text-gray-700 dark:text-gray-300", local.class)} {...rest} />;
};

export const BackgroundCardFooter = (properties: ComponentProps<"div">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("mt-4 flex items-center", local.class)} {...rest} />;
};
