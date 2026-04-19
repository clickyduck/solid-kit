import { mergeClasses } from "@/utilities/mergeClasses";
import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

/**
 * Compound card layout: container, header, title, description, content, and footer.
 */
export const Card = (properties: ComponentProps<"div">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("rounded-lg border border-gray-700 bg-gray-800/20 p-6 shadow backdrop-blur-sm", local.class)} {...rest} />;
};

export const CardHeader = (properties: ComponentProps<"div">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("mb-4 flex flex-col space-y-1.5", local.class)} {...rest} />;
};

export const CardTitle = (properties: ComponentProps<"h3">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <h3 class={mergeClasses("text-2xl font-bold tracking-tight text-white", local.class)} {...rest} />;
};

export const CardDescription = (properties: ComponentProps<"p">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <p class={mergeClasses("text-sm text-gray-400", local.class)} {...rest} />;
};

export const CardContent = (properties: ComponentProps<"div">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("text-gray-300", local.class)} {...rest} />;
};

export const CardFooter = (properties: ComponentProps<"div">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("mt-4 flex items-center", local.class)} {...rest} />;
};
