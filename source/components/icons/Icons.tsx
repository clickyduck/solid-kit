import AccountBalanceWalletIcon from "@material-symbols/svg-500/rounded/account_balance_wallet-fill.svg";
import AccountCircleIcon from "@material-symbols/svg-500/rounded/account_circle-fill.svg";
import AddCircleIcon from "@material-symbols/svg-500/rounded/add_circle-fill.svg";
import ArrowBackIcon from "@material-symbols/svg-500/rounded/arrow_back-fill.svg";
import ArrowForwardIcon from "@material-symbols/svg-500/rounded/arrow_forward-fill.svg";
import BarcodeIcon from "@material-symbols/svg-500/rounded/barcode-fill.svg";
import CalculateIcon from "@material-symbols/svg-500/rounded/calculate-fill.svg";
import CalendarTodayIcon from "@material-symbols/svg-500/rounded/calendar_today-fill.svg";
import CancelIcon from "@material-symbols/svg-500/rounded/cancel-fill.svg";
import CandlestickChartIcon from "@material-symbols/svg-500/rounded/candlestick_chart-fill.svg";
import CategoryIcon from "@material-symbols/svg-500/rounded/category-fill.svg";
import ChatIcon from "@material-symbols/svg-500/rounded/chat-fill.svg";
import CheckCircleIcon from "@material-symbols/svg-500/rounded/check_circle-fill.svg";
import CircleIcon from "@material-symbols/svg-500/rounded/circle_circle-fill.svg";
import ConfirmationNumberIcon from "@material-symbols/svg-500/rounded/confirmation_number-fill.svg";
import CurrencyRupeeIcon from "@material-symbols/svg-500/rounded/currency_rupee-fill.svg";
import DashboardIcon from "@material-symbols/svg-500/rounded/dashboard-fill.svg";
import DeleteIcon from "@material-symbols/svg-500/rounded/delete-fill.svg";
import DescriptionIcon from "@material-symbols/svg-500/rounded/description-fill.svg";
import DownloadIcon from "@material-symbols/svg-500/rounded/download-fill.svg";
import EditIcon from "@material-symbols/svg-500/rounded/edit-fill.svg";
import ForumIcon from "@material-symbols/svg-500/rounded/forum-fill.svg";
import GroupsIcon from "@material-symbols/svg-500/rounded/groups-fill.svg";
import HomeIcon from "@material-symbols/svg-500/rounded/home-fill.svg";
import Inventory2Icon from "@material-symbols/svg-500/rounded/inventory_2-fill.svg";
import KeyboardArrowDownIcon from "@material-symbols/svg-500/rounded/keyboard_arrow_down-fill.svg";
import KeyboardArrowRightIcon from "@material-symbols/svg-500/rounded/keyboard_arrow_right-fill.svg";
import ListIcon from "@material-symbols/svg-500/rounded/list-fill.svg";
import LoginIcon from "@material-symbols/svg-500/rounded/login-fill.svg";
import LogoutIcon from "@material-symbols/svg-500/rounded/logout-fill.svg";
import MenuIcon from "@material-symbols/svg-500/rounded/menu-fill.svg";
import MenuOpenIcon from "@material-symbols/svg-500/rounded/menu_open-fill.svg";
import MoreHorizIcon from "@material-symbols/svg-500/rounded/more_horiz-fill.svg";
import MoreVertIcon from "@material-symbols/svg-500/rounded/more_vert-fill.svg";
import NoteAddIcon from "@material-symbols/svg-500/rounded/note_add-fill.svg";
import PaymentsIcon from "@material-symbols/svg-500/rounded/payments-fill.svg";
import PercentIcon from "@material-symbols/svg-500/rounded/percent-fill.svg";
import PersonAddIcon from "@material-symbols/svg-500/rounded/person_add-fill.svg";
import PieChartIcon from "@material-symbols/svg-500/rounded/pie_chart-fill.svg";
import PlayCircleIcon from "@material-symbols/svg-500/rounded/play_circle-fill.svg";
import RefreshIcon from "@material-symbols/svg-500/rounded/refresh-fill.svg";
import SaveIcon from "@material-symbols/svg-500/rounded/save-fill.svg";
import ScaleIcon from "@material-symbols/svg-500/rounded/scale-fill.svg";
import SearchIcon from "@material-symbols/svg-500/rounded/search-fill.svg";
import SettingsIcon from "@material-symbols/svg-500/rounded/settings-fill.svg";
import StraightenIcon from "@material-symbols/svg-500/rounded/straighten-fill.svg";
import TagIcon from "@material-symbols/svg-500/rounded/tag-fill.svg";
import TrendingUpIcon from "@material-symbols/svg-500/rounded/trending_up-fill.svg";
import UploadIcon from "@material-symbols/svg-500/rounded/upload-fill.svg";
import VisibilityIcon from "@material-symbols/svg-500/rounded/visibility-fill.svg";
import WarningIcon from "@material-symbols/svg-500/rounded/warning-fill.svg";
import WorkIcon from "@material-symbols/svg-500/rounded/work-fill.svg";
import type { Component, ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

export type IconComponent = Component<ComponentProps<"svg">>;

interface IconProperties {
  icon: IconComponent;
  width?: number;
  height?: number;
  fill?: string;
  class?: string;
  [key: string]: unknown;
}

/**
 * Icon wrapper for Material Symbols SVG icons. Inherits text colour and centres vertically.
 */
export const Icon = (properties: IconProperties) => {
  const [local, rest] = splitProps(properties, ["icon", "class", "width", "height", "fill"]);
  const IconComponent = local.icon;
  const baseClasses = "inline-flex items-center justify-center";
  const combinedClasses = local.class ? `${baseClasses} ${local.class}` : baseClasses;

  const svgRest = rest as ComponentProps<"svg">;
  const explicitWidth = local.width;
  const explicitHeight = local.height;
  return (
    <IconComponent {...svgRest} {...(explicitWidth !== undefined ? { width: explicitWidth } : {})} {...(explicitHeight !== undefined ? { height: explicitHeight } : {})} fill={(local.fill as string | undefined) ?? "currentColor"} class={combinedClasses} />
  );
};

export const dashboard = DashboardIcon as unknown as IconComponent;
export const settings = SettingsIcon as unknown as IconComponent;
export const list = ListIcon as unknown as IconComponent;
export const chat = ChatIcon as unknown as IconComponent;
export const forum = ForumIcon as unknown as IconComponent;
export const documentText = DescriptionIcon as unknown as IconComponent;
export const documentPlus = NoteAddIcon as unknown as IconComponent;
export const currencyRupee = CurrencyRupeeIcon as unknown as IconComponent;
export const arrowTrendingUp = TrendingUpIcon as unknown as IconComponent;
export const wallet = AccountBalanceWalletIcon as unknown as IconComponent;
export const chevronDown = KeyboardArrowDownIcon as unknown as IconComponent;
export const chevronRight = KeyboardArrowRightIcon as unknown as IconComponent;
export const closeCircle = CancelIcon as unknown as IconComponent;
export const arrowPath = RefreshIcon as unknown as IconComponent;
export const calendarDays = CalendarTodayIcon as unknown as IconComponent;
export const banknotes = PaymentsIcon as unknown as IconComponent;
export const userCircle = AccountCircleIcon as unknown as IconComponent;
export const userPlus = PersonAddIcon as unknown as IconComponent;
export const checkCircle = CheckCircleIcon as unknown as IconComponent;
export const exclamationTriangle = WarningIcon as unknown as IconComponent;
export const plusCircle = AddCircleIcon as unknown as IconComponent;
export const playCircle = PlayCircleIcon as unknown as IconComponent;
export const pencil = EditIcon as unknown as IconComponent;
export const arrowLeft = ArrowBackIcon as unknown as IconComponent;
export const arrowRight = ArrowForwardIcon as unknown as IconComponent;
export const home = HomeIcon as unknown as IconComponent;
export const arrowLeftOnRectangle = LogoutIcon as unknown as IconComponent;
export const arrowRightOnRectangle = LoginIcon as unknown as IconComponent;
export const bars3 = MenuIcon as unknown as IconComponent;
export const menuOpen = MenuOpenIcon as unknown as IconComponent;
export const ellipsisHorizontal = MoreHorizIcon as unknown as IconComponent;
export const barcode = BarcodeIcon as unknown as IconComponent;
export const tag = TagIcon as unknown as IconComponent;
export const inventory = Inventory2Icon as unknown as IconComponent;
export const percent = PercentIcon as unknown as IconComponent;
export const scale = ScaleIcon as unknown as IconComponent;
export const straighten = StraightenIcon as unknown as IconComponent;
export const category = CategoryIcon as unknown as IconComponent;
export const calculate = CalculateIcon as unknown as IconComponent;
export const pieChart = PieChartIcon as unknown as IconComponent;
export const search = SearchIcon as unknown as IconComponent;
export const save = SaveIcon as unknown as IconComponent;
export const groups = GroupsIcon as unknown as IconComponent;
export const work = WorkIcon as unknown as IconComponent;
export const candlestickChart = CandlestickChartIcon as unknown as IconComponent;
export const trash = DeleteIcon as unknown as IconComponent;
export const download = DownloadIcon as unknown as IconComponent;
export const visibility = VisibilityIcon as unknown as IconComponent;
export const upload = UploadIcon as unknown as IconComponent;
export const ellipsisVertical = MoreVertIcon as unknown as IconComponent;
export const confirmationNumber = ConfirmationNumberIcon as unknown as IconComponent;
export const circle = CircleIcon as unknown as IconComponent;
