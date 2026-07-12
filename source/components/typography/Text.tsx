import { RenderIcon } from "@/components/icons";
import type { IconPosition } from "@/utilities/componentClassStrings";
import { mergeClasses } from "@/utilities/mergeClasses";
import type { ComponentProps, JSX, ValidComponent } from "solid-js";
import { Show, mergeProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  ALIGN_CLASSES,
  COLOR_CLASSES,
  DISPLAY_CLASSES,
  SIZE_CONFIG,
  type SizeConfig,
  TRANSFORM_CLASSES,
  TYPOGRAPHY_ICON_CLASSES,
  type TextAlign,
  type TextColor,
  type TextDisplay,
  type TextSize,
  type TextTransform,
  type TextWeight,
  WEIGHT_CLASSES,
  titleCaseTextChildren,
  truncateTextChildren
} from "./_typography";

export type { TextColor, TextWeight, TextSize, TextAlign, TextTransform, TextDisplay };

export type TextElement = "div" | "p" | "span" | "label" | "h1" | "h2" | "h3" | "h4";

export type TextProperties = Omit<ComponentProps<"div">, "children"> & {
  children: JSX.Element;
  /** Render element. Use `label` for form labels, `h1`–`h4` for headings, `p`/`span` for prose. */
  as?: TextElement;
  size?: TextSize;
  color?: TextColor;
  weight?: TextWeight;
  align?: TextAlign;
  transform?: TextTransform;
  /** Layout mode. `flex` (default) lays out an icon row; `block`/`inline` for plain runs of text. */
  display?: TextDisplay;
  italic?: boolean;
  underline?: boolean;
  /** Single-line CSS ellipsis truncation. */
  truncate?: boolean;
  /** Clamp to N lines with an ellipsis. Overrides `truncate`. */
  lineClamp?: number;
  /** 0..100 (percent). Applied to the whole text row (including icon). */
  opacity?: number;
  icon?: string | JSX.Element;
  iconPosition?: IconPosition;
  /** Truncates string children with `…` at this length (operates on the string, not CSS). */
  maxLength?: number;
};

export const Text = (properties: TextProperties): JSX.Element => {
  const [local, rest] = splitProps(properties, ["children", "class", "as", "size", "color", "weight", "align", "transform", "display", "italic", "underline", "truncate", "lineClamp", "opacity", "icon", "iconPosition", "maxLength", "style"]);

  const config = (): SizeConfig => SIZE_CONFIG[local.size ?? "body"];
  const display = (): TextDisplay => local.display ?? "flex";
  const iconPosition = (): IconPosition => local.iconPosition ?? "start";

  // `transform="title"` rewrites string children into strict title case (see `toTitleCase`); CSS can only
  // ever uppercase every word's first letter, so this casing has to happen on the string itself.
  const text = () => {
    const truncated = truncateTextChildren(local.children, local.maxLength);
    return local.transform === "title" ? titleCaseTextChildren(truncated) : truncated;
  };

  const truncationClass = () => {
    if (local.lineClamp !== undefined) {
      return "overflow-hidden";
    }
    return local.truncate ? "truncate" : "";
  };

  const style = (): JSX.CSSProperties => {
    const base = (typeof local.style === "object" && local.style !== null ? local.style : {}) as JSX.CSSProperties;
    const merged: JSX.CSSProperties = { ...base };
    if (local.opacity !== undefined) {
      merged.opacity = Math.max(0, Math.min(100, local.opacity)) / 100;
    }
    if (local.lineClamp !== undefined) {
      merged.display = "-webkit-box";
      merged["-webkit-line-clamp"] = String(local.lineClamp);
      merged["-webkit-box-orient"] = "vertical";
    }
    return merged;
  };

  const containerClass = () =>
    mergeClasses(
      DISPLAY_CLASSES[display()],
      config().textClass,
      config().gapClass,
      COLOR_CLASSES[local.color ?? "default"],
      WEIGHT_CLASSES[local.weight ?? config().defaultWeight],
      local.align ? ALIGN_CLASSES[local.align] : "",
      TRANSFORM_CLASSES[local.transform ?? "none"],
      local.italic ? "italic" : "",
      local.underline ? "underline" : "",
      truncationClass(),
      local.class
    );

  const restProps = mergeProps(rest, {
    get class() {
      return containerClass();
    },
    get style() {
      return style();
    }
  });

  return (
    <Dynamic component={(local.as ?? "div") as ValidComponent} {...restProps}>
      <Show when={local.icon != null && iconPosition() === "start"}>
        <RenderIcon icon={local.icon!} size={config().iconSize} class={TYPOGRAPHY_ICON_CLASSES} />
      </Show>
      <span class={mergeClasses("min-w-0", truncationClass())}>{text()}</span>
      <Show when={local.icon != null && iconPosition() === "end"}>
        <RenderIcon icon={local.icon!} size={config().iconSize} class={TYPOGRAPHY_ICON_CLASSES} />
      </Show>
    </Dynamic>
  );
};
