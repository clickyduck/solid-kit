import type { IconPosition } from "@/utilities/componentClassStrings";
import { mergeClasses } from "@/utilities/mergeClasses";
import type { ComponentProps, JSX, ParentComponent } from "solid-js";
import { Show, splitProps } from "solid-js";

export type TextColor = "default" | "inherit" | "muted" | "primary" | "secondary" | "success" | "warning" | "danger" | "info";
export type TextWeight = "thin" | "normal" | "medium" | "semibold" | "bold";

const COLOR_CLASSES: Record<TextColor, string> = {
  inherit: "",
  default: "text-gray-900 dark:text-gray-100",
  muted: "text-gray-600 dark:text-gray-400",
  primary: "text-blue-700 dark:text-blue-400",
  secondary: "text-gray-700 dark:text-gray-300",
  success: "text-emerald-700 dark:text-emerald-400",
  warning: "text-amber-800 dark:text-amber-400",
  danger: "text-red-700 dark:text-red-400",
  info: "text-sky-700 dark:text-sky-400"
};

const WEIGHT_CLASSES: Record<TextWeight, string> = {
  thin: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold"
};

export type TypographyBaseProps = Omit<ComponentProps<"div">, "children"> & {
  children: JSX.Element;
  color?: TextColor;
  weight?: TextWeight;
  italic?: boolean;
  underline?: boolean;
  /** 0..100 (percent). Applied to the whole text row (including icon). */
  opacity?: number;
  icon?: JSX.Element;
  iconPosition?: IconPosition;
};

type CreateTypographyOptions = {
  sizeClasses: string;
  defaultColor?: TextColor;
  defaultWeight?: TextWeight;
  defaultItalic?: boolean;
  defaultUnderline?: boolean;
  iconClasses?: string;
};

const DEFAULT_ICON_CLASSES = "inline-flex shrink-0 items-center justify-center align-middle text-current opacity-70 [&_svg]:h-[1em] [&_svg]:w-[1em] [&_svg]:fill-current";

export const createTypography = (options: CreateTypographyOptions): ParentComponent<TypographyBaseProps> => {
  const iconWrapperClasses = () => mergeClasses(DEFAULT_ICON_CLASSES, options.iconClasses);
  return (properties) => {
    const [local, rest] = splitProps(properties, ["children", "class", "color", "weight", "italic", "underline", "opacity", "icon", "iconPosition"]);
    const iconPosition = () => local.iconPosition ?? "start";
    const color = (): TextColor => local.color ?? options.defaultColor ?? "default";
    const weight = (): TextWeight => local.weight ?? options.defaultWeight ?? "normal";
    const italic = (): boolean => local.italic ?? options.defaultItalic ?? false;
    const underline = (): boolean => local.underline ?? options.defaultUnderline ?? false;
    const opacity = (): number | undefined => local.opacity;

    const style = () => {
      const baseStyle = rest.style;
      if (opacity() === undefined) {
        return baseStyle;
      }
      const clamped = Math.max(0, Math.min(100, opacity()!)) / 100;
      if (typeof baseStyle === "object" && baseStyle !== null) {
        return { ...(baseStyle as JSX.CSSProperties), opacity: clamped };
      }
      return { opacity: clamped } satisfies JSX.CSSProperties;
    };

    return (
      <div class={mergeClasses("inline-flex items-center gap-2", options.sizeClasses, COLOR_CLASSES[color()], WEIGHT_CLASSES[weight()], italic() ? "italic" : "", underline() ? "underline" : "", local.class)} {...rest} style={style()}>
        <Show when={local.icon !== undefined && iconPosition() === "start"}>
          <span class={iconWrapperClasses()} aria-hidden="true">
            {local.icon}
          </span>
        </Show>
        <div class="min-w-0">{local.children}</div>
        <Show when={local.icon !== undefined && iconPosition() === "end"}>
          <span class={iconWrapperClasses()} aria-hidden="true">
            {local.icon}
          </span>
        </Show>
      </div>
    );
  };
};
