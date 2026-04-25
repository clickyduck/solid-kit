import type { Component, ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

export type IconGlyphProperties = Omit<ComponentProps<"span">, "style" | "children"> & {
  width?: number;
  height?: number;
  fill?: string;
  style?: ComponentProps<"span">["style"];
};

export type IconComponent = Component<IconGlyphProperties>;

interface IconProperties {
  icon: IconComponent;
  width?: number;
  height?: number;
  fill?: string;
  class?: string;
  [key: string]: unknown;
}

/** Wraps a glyph component; requires Fontsource + `material-symbols-rounded-glyph-host.css` (see README). */
export const Icon = (properties: IconProperties) => {
  const [local, rest] = splitProps(properties, ["icon", "class", "width", "height", "fill"]);
  const IconComponent = local.icon;
  const baseClasses = "inline-flex shrink-0 items-center justify-center align-middle";
  const combinedClasses = local.class ? `${baseClasses} ${local.class}` : baseClasses;
  const forwardedRest = rest as Record<string, unknown>;
  const explicitWidth = local.width;
  const explicitHeight = local.height;
  return (
    <IconComponent
      {...forwardedRest}
      {...(explicitWidth !== undefined ? { width: explicitWidth } : {})}
      {...(explicitHeight !== undefined ? { height: explicitHeight } : {})}
      fill={(local.fill as string | undefined) ?? "currentColor"}
      class={combinedClasses}
    />
  );
};

function createMaterialSymbolRoundedFilledGlyph(materialSymbolGlyphName: string): IconComponent {
  return (properties) => {
    const [local, rest] = splitProps(properties as IconGlyphProperties, ["class", "width", "height", "fill", "style"] as const);
    const existingStyleRecord: Record<string, string | number> = typeof local.style === "object" && local.style !== null && !Array.isArray(local.style) ? { ...(local.style as Record<string, string | number>) } : {};
    const explicitWidth = local.width;
    const explicitHeight = local.height;
    const resolvedFontSizePixels = explicitWidth !== undefined ? explicitWidth : explicitHeight !== undefined ? explicitHeight : undefined;
    const resolvedHeightPixels = explicitHeight !== undefined ? explicitHeight : explicitWidth !== undefined ? explicitWidth : undefined;
    const spanStyle = (): Record<string, string | number> => ({
      ...existingStyleRecord,
      ...(resolvedFontSizePixels !== undefined ? { "font-size": `${resolvedFontSizePixels}px` } : {}),
      ...(explicitWidth !== undefined ? { width: `${explicitWidth}px` } : {}),
      ...(resolvedHeightPixels !== undefined ? { height: `${resolvedHeightPixels}px` } : {}),
      color: (local.fill as string | undefined) ?? "currentColor"
    });
    const combinedGlyphClass = () => ["material-symbols-rounded", local.class].filter(Boolean).join(" ");
    return (
      <span {...(rest as ComponentProps<"span">)} class={combinedGlyphClass()} style={spanStyle()}>
        {materialSymbolGlyphName}
      </span>
    );
  };
}

export const dashboard = createMaterialSymbolRoundedFilledGlyph("dashboard");
export const settings = createMaterialSymbolRoundedFilledGlyph("settings");
export const list = createMaterialSymbolRoundedFilledGlyph("list");
export const chat = createMaterialSymbolRoundedFilledGlyph("chat");
export const forum = createMaterialSymbolRoundedFilledGlyph("forum");
export const documentText = createMaterialSymbolRoundedFilledGlyph("description");
export const documentPlus = createMaterialSymbolRoundedFilledGlyph("note_add");
export const currencyRupee = createMaterialSymbolRoundedFilledGlyph("currency_rupee");
export const arrowTrendingUp = createMaterialSymbolRoundedFilledGlyph("trending_up");
export const wallet = createMaterialSymbolRoundedFilledGlyph("account_balance_wallet");
export const chevronDown = createMaterialSymbolRoundedFilledGlyph("keyboard_arrow_down");
export const chevronRight = createMaterialSymbolRoundedFilledGlyph("keyboard_arrow_right");
export const closeCircle = createMaterialSymbolRoundedFilledGlyph("cancel");
export const arrowPath = createMaterialSymbolRoundedFilledGlyph("refresh");
export const calendarDays = createMaterialSymbolRoundedFilledGlyph("calendar_today");
export const banknotes = createMaterialSymbolRoundedFilledGlyph("payments");
export const userCircle = createMaterialSymbolRoundedFilledGlyph("account_circle");
export const userPlus = createMaterialSymbolRoundedFilledGlyph("person_add");
export const checkCircle = createMaterialSymbolRoundedFilledGlyph("check_circle");
export const exclamationTriangle = createMaterialSymbolRoundedFilledGlyph("warning");
export const plusCircle = createMaterialSymbolRoundedFilledGlyph("add_circle");
export const playCircle = createMaterialSymbolRoundedFilledGlyph("play_circle");
export const pencil = createMaterialSymbolRoundedFilledGlyph("edit");
export const arrowLeft = createMaterialSymbolRoundedFilledGlyph("arrow_back");
export const arrowRight = createMaterialSymbolRoundedFilledGlyph("arrow_forward");
export const home = createMaterialSymbolRoundedFilledGlyph("home");
export const arrowLeftOnRectangle = createMaterialSymbolRoundedFilledGlyph("logout");
export const arrowRightOnRectangle = createMaterialSymbolRoundedFilledGlyph("login");
export const bars3 = createMaterialSymbolRoundedFilledGlyph("menu");
export const menuOpen = createMaterialSymbolRoundedFilledGlyph("menu_open");
export const ellipsisHorizontal = createMaterialSymbolRoundedFilledGlyph("more_horiz");
export const barcode = createMaterialSymbolRoundedFilledGlyph("barcode");
export const tag = createMaterialSymbolRoundedFilledGlyph("tag");
export const inventory = createMaterialSymbolRoundedFilledGlyph("inventory_2");
export const percent = createMaterialSymbolRoundedFilledGlyph("percent");
export const scale = createMaterialSymbolRoundedFilledGlyph("scale");
export const straighten = createMaterialSymbolRoundedFilledGlyph("straighten");
export const category = createMaterialSymbolRoundedFilledGlyph("category");
export const calculate = createMaterialSymbolRoundedFilledGlyph("calculate");
export const pieChart = createMaterialSymbolRoundedFilledGlyph("pie_chart");
export const search = createMaterialSymbolRoundedFilledGlyph("search");
export const save = createMaterialSymbolRoundedFilledGlyph("save");
export const groups = createMaterialSymbolRoundedFilledGlyph("groups");
export const work = createMaterialSymbolRoundedFilledGlyph("work");
export const candlestickChart = createMaterialSymbolRoundedFilledGlyph("candlestick_chart");
export const trash = createMaterialSymbolRoundedFilledGlyph("delete");
export const download = createMaterialSymbolRoundedFilledGlyph("download");
export const visibility = createMaterialSymbolRoundedFilledGlyph("visibility");
export const upload = createMaterialSymbolRoundedFilledGlyph("upload");
export const ellipsisVertical = createMaterialSymbolRoundedFilledGlyph("more_vert");
export const confirmationNumber = createMaterialSymbolRoundedFilledGlyph("confirmation_number");
export const circle = createMaterialSymbolRoundedFilledGlyph("circle");
export const darkMode = createMaterialSymbolRoundedFilledGlyph("dark_mode");
export const lightMode = createMaterialSymbolRoundedFilledGlyph("light_mode");
