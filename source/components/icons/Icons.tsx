import { mergeClasses } from "@/utilities";
import type { Component, ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

export type IconGlyphProperties = ComponentProps<"span">;
export type IconComponent = Component<IconGlyphProperties>;
export type IconColor = "default" | "inherit" | "muted" | "primary" | "secondary" | "success" | "warning" | "danger" | "info";

let hasMaterialSymbolsStylesheetLoadBeenRequested: boolean = false;

const requestMaterialSymbolsRoundedStylesheetLoad = (): void => {
  if (hasMaterialSymbolsStylesheetLoadBeenRequested) {
    return;
  }

  if (typeof document === "undefined") {
    return;
  }

  hasMaterialSymbolsStylesheetLoadBeenRequested = true;

  import("material-symbols/rounded.css").catch(() => {
    // Intentionally ignore: consumers may load the stylesheet globally (link tag or import).
  });
};

interface IconProperties {
  name: string;
  size?: number;
  color?: IconColor;
  class?: string;
  [key: string]: unknown;
}

const iconColorClass: Record<IconColor, string> = {
  default: "",
  inherit: "text-inherit",
  muted: "text-gray-500 dark:text-gray-400",
  primary: "text-blue-600 dark:text-blue-400",
  secondary: "text-gray-700 dark:text-gray-300",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-red-600 dark:text-red-400",
  info: "text-sky-600 dark:text-sky-400"
};

/** Renders a Material Symbol (rounded, filled) by ligature name, e.g. `<Icon name="account_balance_wallet" size={20} />` */
export const Icon = (properties: IconProperties) => {
  const [local, rest] = splitProps(properties, ["name", "size", "color", "class", "style"]);

  requestMaterialSymbolsRoundedStylesheetLoad();

  return (
    <span
      {...(rest as IconGlyphProperties)}
      class={mergeClasses("material-symbols-rounded inline-flex shrink-0 items-center justify-center align-middle leading-none", local.color !== undefined ? iconColorClass[local.color] : "", local.class)}
      style={
        typeof local.style === "string"
          ? `${local.style}${local.size !== undefined ? `; font-size: ${local.size}px; width: ${local.size}px; height: ${local.size}px` : ""}; font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24`
          : {
              ...(local.style ?? {}),
              ...(local.size !== undefined ? { "font-size": `${local.size}px`, width: `${local.size}px`, height: `${local.size}px` } : {}),
              "font-variation-settings": `'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24`
            }
      }
      aria-hidden={((rest as IconGlyphProperties)["aria-hidden"] ?? "true") as unknown as boolean | "true" | "false"}
    >
      {local.name}
    </span>
  );
};
