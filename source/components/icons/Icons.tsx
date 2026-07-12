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

  // `material-symbols` is a required peer dependency (see package.json / README install line). It is
  // imported lazily on first icon use — as a normal dynamic import so the consumer's bundler resolves
  // and serves the stylesheet + font. The `.catch()` only guards a consumer that deliberately loads
  // the stylesheet another way (global <link> or their own import); it does NOT make the package
  // optional. Do not route this through `new Function`/string-built specifiers to "hide" it from the
  // bundler: that stops the bundler from serving the CSS, so the font never loads and every icon
  // silently degrades to its raw ligature name.
  import("material-symbols/rounded.css").catch(() => {
    // Intentionally ignore: a consumer may instead provide the stylesheet globally.
  });
};

interface IconProperties {
  name: string;
  size?: number;
  color?: IconColor;
  class?: string;
  [key: string]: unknown;
}

// Kept identical to typography's COLOR_CLASSES so an Icon and a Text with the same color name always match.
const iconColorClass: Record<IconColor, string> = {
  default: "",
  inherit: "text-inherit",
  muted: "text-gray-700 dark:text-gray-300",
  primary: "text-blue-700 dark:text-blue-300",
  secondary: "text-gray-800 dark:text-gray-200",
  success: "text-emerald-700 dark:text-emerald-300",
  warning: "text-amber-800 dark:text-amber-300",
  danger: "text-red-700 dark:text-red-300",
  info: "text-sky-700 dark:text-sky-300"
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
