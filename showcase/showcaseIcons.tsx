/**
 * Showcase-only icons: the library itself only exports symbols it uses internally
 * (`source/components/icons/Icons.tsx`). Consumer applications should follow this pattern
 * and install `@material-symbols/svg-500` (or another source) for app-specific icons.
 */
import type { IconComponent } from "@/components/icons";
import AccountBalanceWalletSvg from "@material-symbols/svg-500/rounded/account_balance_wallet-fill.svg";
import CalendarTodaySvg from "@material-symbols/svg-500/rounded/calendar_today-fill.svg";
import CheckCircleSvg from "@material-symbols/svg-500/rounded/check_circle-fill.svg";
import DarkModeSvg from "@material-symbols/svg-500/rounded/dark_mode-fill.svg";
import DashboardSvg from "@material-symbols/svg-500/rounded/dashboard-fill.svg";
import PencilSvg from "@material-symbols/svg-500/rounded/edit-fill.svg";
import Inventory2Svg from "@material-symbols/svg-500/rounded/inventory_2-fill.svg";
import LightModeSvg from "@material-symbols/svg-500/rounded/light_mode-fill.svg";
import MenuSvg from "@material-symbols/svg-500/rounded/menu-fill.svg";
import MenuOpenSvg from "@material-symbols/svg-500/rounded/menu_open-fill.svg";
import MoreVertSvg from "@material-symbols/svg-500/rounded/more_vert-fill.svg";
import SearchSvg from "@material-symbols/svg-500/rounded/search-fill.svg";
import SettingsSvg from "@material-symbols/svg-500/rounded/settings-fill.svg";
import TagSvg from "@material-symbols/svg-500/rounded/tag-fill.svg";

export const bars3: IconComponent = MenuSvg;
export const calendarDays: IconComponent = CalendarTodaySvg;
export const checkCircle: IconComponent = CheckCircleSvg;
export const darkMode: IconComponent = DarkModeSvg;
export const dashboard: IconComponent = DashboardSvg;
export const ellipsisVertical: IconComponent = MoreVertSvg;
export const inventory: IconComponent = Inventory2Svg;
export const lightMode: IconComponent = LightModeSvg;
export const menuOpen: IconComponent = MenuOpenSvg;
export const pencil: IconComponent = PencilSvg;
export const search: IconComponent = SearchSvg;
export const settings: IconComponent = SettingsSvg;
export const tag: IconComponent = TagSvg;
export const wallet: IconComponent = AccountBalanceWalletSvg;
