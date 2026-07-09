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

  // `material-symbols` is an OPTIONAL peer dependency: consumers may instead load the stylesheet
  // globally (a <link> tag or their own import), or ship their own icon font. So this dynamic import
  // must never be able to break a consumer's build.
  //
  // The import is routed through `new Function` so that neither this library's bundler nor the
  // consumer's (Vite / Rolldown) can statically see the specifier: a bare `import("material-symbols/
  // rounded.css")` — even one built by string concatenation or tagged `/* @vite-ignore */` — is
  // constant-folded back to a literal and then statically resolved at optimize/build time, which
  // hard-fails the consumer's dev server or build when the peer is absent, regardless of the
  // `.catch()`. Routing through a function body constructed from a string defeats that folding:
  // resolution is deferred to true runtime, where a genuine miss (package not installed) is caught
  // and ignored below. `dynamicImport` returns the native `import()` promise.
  const dynamicImport = new Function("specifier", "return import(specifier);") as (specifier: string) => Promise<unknown>;

  dynamicImport("material-symbols/rounded.css").catch(() => {
    // Intentionally ignore: the stylesheet is optional and may be provided globally by the consumer.
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
  muted: "text-gray-600 dark:text-gray-400",
  primary: "text-blue-700 dark:text-blue-400",
  secondary: "text-gray-700 dark:text-gray-300",
  success: "text-emerald-700 dark:text-emerald-400",
  warning: "text-amber-800 dark:text-amber-400",
  danger: "text-red-700 dark:text-red-400",
  info: "text-sky-700 dark:text-sky-400"
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
