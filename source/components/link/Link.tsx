import { RenderIcon } from "@/components/icons";
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
  truncateTextChildren
} from "@/components/typography/_typography";
import { FOCUS_OUTLINE_INLINE_CLASSES, type IconPosition } from "@/utilities/componentClassStrings";
import { mergeClasses } from "@/utilities/mergeClasses";
import { A } from "@solidjs/router";
import type { ComponentProps, JSX } from "solid-js";
import { Show, mergeProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

/** Anchor implementation: `"A"` is `@solidjs/router`'s client-side `<A>`; `"a"` is a plain anchor for non-router contexts. */
export type LinkAnchorTag = "A" | "a";

export type LinkProperties = Omit<ComponentProps<"a">, "children"> & {
  children: JSX.Element;
  /** `"A"` (default) uses `@solidjs/router`'s `<A>`; `"a"` is a plain anchor for use outside a router. */
  anchorTag?: LinkAnchorTag;
  size?: TextSize;
  /** Defaults to `primary` so links read as links. */
  color?: TextColor;
  weight?: TextWeight;
  align?: TextAlign;
  transform?: TextTransform;
  /** Layout mode. `inline` (default) flows the link within surrounding text; `flex`/`block` for standalone rows. */
  display?: TextDisplay;
  italic?: boolean;
  /** Single-line CSS ellipsis truncation. */
  truncate?: boolean;
  /** Clamp to N lines with an ellipsis. Overrides `truncate`. */
  lineClamp?: number;
  /** 0..100 (percent). Applied to the whole link row (including icon). */
  opacity?: number;
  icon?: string | JSX.Element;
  iconPosition?: IconPosition;
  /** Truncates string children with `…` at this length (operates on the string, not CSS). */
  maxLength?: number;
};

/**
 * Typographic link. Mirrors `Text`'s typographic props but renders an anchor. No underline by
 * default — color (and `cursor-pointer`) is the affordance. Use `anchorTag="a"` outside a router.
 */
export const Link = (properties: LinkProperties): JSX.Element => {
  const [local, rest] = splitProps(properties, ["children", "class", "anchorTag", "size", "color", "weight", "align", "transform", "display", "italic", "truncate", "lineClamp", "opacity", "icon", "iconPosition", "maxLength", "style"]);

  const config = (): SizeConfig => SIZE_CONFIG[local.size ?? "body"];
  const display = (): TextDisplay => local.display ?? "inline";
  const iconPosition = (): IconPosition => local.iconPosition ?? "start";

  const text = () => truncateTextChildren(local.children, local.maxLength);

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
      "m-0 no-underline cursor-pointer transition-opacity duration-100 ease-out hover:opacity-80 active:opacity-75",
      FOCUS_OUTLINE_INLINE_CLASSES,
      DISPLAY_CLASSES[display()],
      config().textClass,
      config().gapClass,
      // Links default to `primary` (not `default`) so they read as links.
      COLOR_CLASSES[local.color ?? "primary"],
      WEIGHT_CLASSES[local.weight ?? config().defaultWeight],
      local.align ? ALIGN_CLASSES[local.align] : "",
      TRANSFORM_CLASSES[local.transform ?? "none"],
      local.italic ? "italic" : "",
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

  // `@solidjs/router`'s <A> requires an `href`; the plain anchor accepts the same attributes.
  const component = () => (local.anchorTag === "a" ? "a" : A);

  return (
    <Dynamic component={component()} {...restProps}>
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
