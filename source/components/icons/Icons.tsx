/**
 * Symbols below are the only Material SVGs shipped with solid-kit: each is referenced
 * by a component under `source/components`. Applications should define their own icon
 * module (for example wrapping `@material-symbols/svg-500`) and pass `IconComponent`
 * into props such as `Button` `icon`, `Metric` `icon`, `EmptyState` `icon`, and tab icons.
 */
import AccountBalanceWalletSvg from "@material-symbols/svg-500/rounded/account_balance_wallet-fill.svg";
import ArrowBackSvg from "@material-symbols/svg-500/rounded/arrow_back-fill.svg";
import ArrowForwardSvg from "@material-symbols/svg-500/rounded/arrow_forward-fill.svg";
import CalendarTodaySvg from "@material-symbols/svg-500/rounded/calendar_today-fill.svg";
import CancelSvg from "@material-symbols/svg-500/rounded/cancel-fill.svg";
import ChatSvg from "@material-symbols/svg-500/rounded/chat-fill.svg";
import CheckCircleSvg from "@material-symbols/svg-500/rounded/check_circle-fill.svg";
import ConfirmationNumberSvg from "@material-symbols/svg-500/rounded/confirmation_number-fill.svg";
import CurrencyRupeeSvg from "@material-symbols/svg-500/rounded/currency_rupee-fill.svg";
import DashboardSvg from "@material-symbols/svg-500/rounded/dashboard-fill.svg";
import ForumSvg from "@material-symbols/svg-500/rounded/forum-fill.svg";
import GroupsSvg from "@material-symbols/svg-500/rounded/groups-fill.svg";
import Inventory2Svg from "@material-symbols/svg-500/rounded/inventory_2-fill.svg";
import KeyboardArrowDownSvg from "@material-symbols/svg-500/rounded/keyboard_arrow_down-fill.svg";
import ListSvg from "@material-symbols/svg-500/rounded/list-fill.svg";
import PieChartSvg from "@material-symbols/svg-500/rounded/pie_chart-fill.svg";
import SearchSvg from "@material-symbols/svg-500/rounded/search-fill.svg";
import SettingsSvg from "@material-symbols/svg-500/rounded/settings-fill.svg";
import TagSvg from "@material-symbols/svg-500/rounded/tag-fill.svg";
import TrendingUpSvg from "@material-symbols/svg-500/rounded/trending_up-fill.svg";
import UploadSvg from "@material-symbols/svg-500/rounded/upload-fill.svg";
import WarningSvg from "@material-symbols/svg-500/rounded/warning-fill.svg";
import WorkSvg from "@material-symbols/svg-500/rounded/work-fill.svg";
import type { Component, ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

export type IconGlyphProperties = ComponentProps<"svg">;

export type IconComponent = Component<IconGlyphProperties>;

interface IconProperties {
  icon: IconComponent;
  width?: number;
  height?: number;
  fill?: string;
  class?: string;
  [key: string]: unknown;
}

/** Wraps an SVG `IconComponent` (your own or one of the kit symbols used by built-in components). */
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

export const arrowLeft: IconComponent = ArrowBackSvg;
export const arrowRight: IconComponent = ArrowForwardSvg;
export const arrowTrendingUp: IconComponent = TrendingUpSvg;
export const calendarDays: IconComponent = CalendarTodaySvg;
export const chat: IconComponent = ChatSvg;
export const checkCircle: IconComponent = CheckCircleSvg;
export const chevronDown: IconComponent = KeyboardArrowDownSvg;
export const closeCircle: IconComponent = CancelSvg;
export const confirmationNumber: IconComponent = ConfirmationNumberSvg;
export const currencyRupee: IconComponent = CurrencyRupeeSvg;
export const dashboard: IconComponent = DashboardSvg;
export const forum: IconComponent = ForumSvg;
export const groups: IconComponent = GroupsSvg;
export const inventory: IconComponent = Inventory2Svg;
export const list: IconComponent = ListSvg;
export const pieChart: IconComponent = PieChartSvg;
export const search: IconComponent = SearchSvg;
export const settings: IconComponent = SettingsSvg;
export const tag: IconComponent = TagSvg;
export const upload: IconComponent = UploadSvg;
export const wallet: IconComponent = AccountBalanceWalletSvg;
export const work: IconComponent = WorkSvg;
export const exclamationTriangle: IconComponent = WarningSvg;
