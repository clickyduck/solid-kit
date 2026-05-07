import { mergeClasses } from "@/utilities";
import type { Component, ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

export type IconGlyphProperties = ComponentProps<"span">;
export type IconComponent = Component<IconGlyphProperties>;

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
  filled?: boolean;
  class?: string;
  [key: string]: unknown;
}

/** Renders a Material Symbol (rounded, optionally filled) by ligature name, e.g. `<Icon name="account_balance_wallet" size={20} />` */
export const Icon = (properties: IconProperties) => {
  const [local, rest] = splitProps(properties, ["name", "size", "filled", "class", "style"]);

  requestMaterialSymbolsRoundedStylesheetLoad();

  return (
    <span
      {...(rest as IconGlyphProperties)}
      class={mergeClasses("material-symbols-rounded inline-flex shrink-0 items-center justify-center align-middle leading-none", local.class)}
      style={
        typeof local.style === "string"
          ? `${local.style}${local.size !== undefined ? `; font-size: ${local.size}px; width: ${local.size}px; height: ${local.size}px` : ""}; font-variation-settings: 'FILL' ${local.filled === false ? 0 : 1}, 'wght' 400, 'GRAD' 0, 'opsz' 24`
          : {
              ...(local.style ?? {}),
              ...(local.size !== undefined ? { "font-size": `${local.size}px`, width: `${local.size}px`, height: `${local.size}px` } : {}),
              "font-variation-settings": `'FILL' ${local.filled === false ? 0 : 1}, 'wght' 400, 'GRAD' 0, 'opsz' 24`
            }
      }
      aria-hidden={((rest as IconGlyphProperties)["aria-hidden"] ?? "true") as unknown as boolean | "true" | "false"}
    >
      {local.name}
    </span>
  );
};
