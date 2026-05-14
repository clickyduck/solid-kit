import type { BadgeVariant } from "@/components/badge/Badge";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { BackgroundCard } from "@/components/card/BackgroundCard";
import { DataCard } from "@/components/card/DataCard";
import { MetricCard } from "@/components/card/MetricCard";
import { DatePicker, type DatePickerValue } from "@/components/date-picker/DatePicker";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/dialog/Dialog";
import { Divider } from "@/components/divider/Divider";
import { Dropdown, DropdownContent, DropdownIconTrigger, DropdownItem, DropdownSeparator, DropdownTrigger, DropdownValue } from "@/components/dropdown/Dropdown";
import { EmptyState } from "@/components/empty-state/EmptyState";
import { Field } from "@/components/field/Field";
import { HeaderLayout } from "@/components/header-layout";
import { IconButton } from "@/components/icon-button/IconButton";
import { Icon } from "@/components/icons/Icons";
import { Input } from "@/components/input/Input";
import { LeftPanelLayout, type LeftPanelLayoutNavigationDocumentJson } from "@/components/left-panel-layout";
import { Loading } from "@/components/loading/Loading";
import { MainLayout } from "@/components/main-layout";
import { PageLayout } from "@/components/page-layout";
import { RightPanelLayout } from "@/components/right-panel-layout";
import { SectionHeading } from "@/components/section-heading/SectionHeading";
import { Spinner } from "@/components/spinner/Spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TablePagination, TableRow } from "@/components/table/Table";
import type { TabDefinition } from "@/components/tabs/Tabs";
import { Tabs } from "@/components/tabs/Tabs";
import { Textarea } from "@/components/textarea/Textarea";
import { addToast } from "@/components/toast/Toast";
import { Toaster } from "@/components/toast/Toaster";
import { ToggleGroup } from "@/components/toggle-group/ToggleGroup";
import { Text } from "@/components/typography/Text";
import { Upload } from "@/components/upload/Upload";
import { type Color, createDocumentColorSchemePreferenceSignal, useIsMobile } from "@/utilities";
import type { JSX } from "solid-js";
import { For, Show, createMemo, createSignal } from "solid-js";

import showcaseLeftPanelNavigationDocumentJson from "./showcaseLeftPanelNavigationDocument.json";

const showcaseLeftPanelNavigationDocument = showcaseLeftPanelNavigationDocumentJson as LeftPanelLayoutNavigationDocumentJson;

type ShowcaseTabValue = "overview" | "reports" | "settings";

type ShowcaseSectionProperties = {
  sectionHeadingIdentifier: string;
  sectionTitle: string;
  sectionDescription?: string;
  children: JSX.Element;
};

type ShowcaseCategoryProperties = {
  categoryTitle: string;
  children: JSX.Element;
};

const badgeVariants: BadgeVariant[] = ["solid", "outline"];

const semanticColors: Color[] = ["primary", "secondary", "neutral", "success", "warning", "danger"];

const tableRows: { name: string; status: string; amount: string }[] = [
  { name: "North warehouse", status: "Active", amount: "₹12,450" },
  { name: "South warehouse", status: "Paused", amount: "₹8,120" },
  { name: "East hub", status: "Active", amount: "₹21,980" }
];

const tabDefinitions: readonly TabDefinition<ShowcaseTabValue>[] = [
  {
    tabValue: "overview",
    label: "Overview",
    tabElementIdentifier: "showcase-tab-overview",
    panelElementIdentifier: "showcase-panel-overview",
    icon: "dashboard"
  },
  {
    tabValue: "reports",
    label: "Reports",
    tabElementIdentifier: "showcase-tab-reports",
    panelElementIdentifier: "showcase-panel-reports",
    icon: "bar_chart"
  },
  {
    tabValue: "settings",
    label: "Settings",
    tabElementIdentifier: "showcase-tab-settings",
    panelElementIdentifier: "showcase-panel-settings",
    icon: "settings"
  }
];

export const ShowcaseApplication = (): JSX.Element => {
  const isMobileViewport = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = createSignal(isMobileViewport());

  const toggleSidebar = (): void => {
    setSidebarCollapsed((prev) => !prev);
  };

  const closeSidebar = (): void => {
    if (isMobileViewport()) {
      setSidebarCollapsed(true);
    }
  };

  // Dialog state
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dropdownDialogOpen, setDropdownDialogOpen] = createSignal(false);
  const [dropdownDialogValue, setDropdownDialogValue] = createSignal<string | undefined>("Cherry");
  const [headerDropdownDialogOpen, setHeaderDropdownDialogOpen] = createSignal(false);
  const [headerDropdownDialogView, setHeaderDropdownDialogView] = createSignal("Details");
  const [datePickerDialogValue, setDatePickerDialogValue] = createSignal<DatePickerValue>({ mode: "single", date: undefined });

  // Date picker state
  const [singleDateValue, setSingleDateValue] = createSignal<DatePickerValue>({ mode: "single", date: undefined });
  const [rangeDateValue, setRangeDateValue] = createSignal<DatePickerValue>({ mode: "range", from: undefined, to: undefined });

  // Dropdown state
  const [dropdownValue, setDropdownValue] = createSignal<string | undefined>("Cherry");
  const [itemizedDropdownValue, setItemizedDropdownValue] = createSignal<string | undefined>("Banana");
  const [searchableDropdownValue, setSearchableDropdownValue] = createSignal<string | undefined>("Mumbai");
  const [iconTriggerDropdownValue, setIconTriggerDropdownValue] = createSignal<string | undefined>("Two");
  const [multiSelectDropdownValues, setMultiSelectDropdownValues] = createSignal<string[]>(["Banana", "Date"]);
  const [multiSelectCityValues, setMultiSelectCityValues] = createSignal<string[]>([]);

  // Input state
  const [currencyInputValue, setCurrencyInputValue] = createSignal("1234567.50");
  const [plainInputValue, setPlainInputValue] = createSignal("Solid Kit");
  const [textareaAutoGrowValue, setTextareaAutoGrowValue] = createSignal("Type multiple lines to watch auto-grow clamp between min and max rows.");
  const [uploadSelectedFiles, setUploadSelectedFiles] = createSignal<File[]>([]);

  // Toggle group state
  const [digestSelection, setDigestSelection] = createSignal<string[]>(["weekly"]);
  const [shippingMethod, setShippingMethod] = createSignal<string | undefined>("standard");
  const [contactChannels, setContactChannels] = createSignal<string[]>(["email"]);

  // Navigation state
  const [activeShowcaseTab, setActiveShowcaseTab] = createSignal<ShowcaseTabValue>("overview");
  const [tablePagination, setTablePagination] = createSignal<{ limit: number; offset: number }>({ limit: 25, offset: 0 });
  const [isRightPanelOpen, setIsRightPanelOpen] = createSignal(false);
  const [activeDataCard, setActiveDataCard] = createSignal<number | undefined>(0);

  const [documentColorSchemeName, setDocumentColorSchemeName] = createDocumentColorSchemePreferenceSignal();

  const openRightPanel = (): void => {
    if (isMobileViewport()) {
      setSidebarCollapsed(true);
    }
    setIsRightPanelOpen(true);
  };

  const dropdownOptions = (): string[] => ["Apple", "Banana", "Cherry", "Date", "Elderberry"];
  const cityOptions = (): string[] => ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Kolkata"];
  const numericOptions = (): string[] => ["One", "Two", "Three"];

  const tabPanelCopy = createMemo(() => {
    switch (activeShowcaseTab()) {
      case "overview":
        return "Overview panel content: summary metrics and alerts.";
      case "reports":
        return "Reports panel content: exports and scheduled deliveries.";
      case "settings":
        return "Settings panel content: workspace preferences.";
      default:
        return "";
    }
  });

  return (
    <div class="flex h-full min-h-0 flex-col">
      <Toaster />

      <MainLayout>
        <HeaderLayout
          titleElement={
            <div class="flex min-w-0 items-center gap-3">
              <IconButton variant="ghost" icon={sidebarCollapsed() ? "menu" : "menu_open"} onClick={toggleSidebar} aria-label={sidebarCollapsed() ? "Expand sidebar" : "Collapse sidebar"} />
              <Text size="1">Solid Kit showcase</Text>
            </div>
          }
        >
          <div class="flex items-center gap-1">
            <IconButton variant={documentColorSchemeName() === "light" ? "solid" : "ghost"} icon="light_mode" aria-label="Use light color scheme" onClick={() => setDocumentColorSchemeName("light")} />
            <IconButton variant={documentColorSchemeName() === "dark" ? "solid" : "ghost"} icon="dark_mode" aria-label="Use dark color scheme" onClick={() => setDocumentColorSchemeName("dark")} />
          </div>
        </HeaderLayout>

        <LeftPanelLayout
          collapsed={sidebarCollapsed()}
          onOpenChange={(isPanelOpen) => {
            if (!isPanelOpen) closeSidebar();
          }}
          navigationDocument={showcaseLeftPanelNavigationDocument}
        />

        <PageLayout>
          <div class="mx-auto max-w-6xl space-y-16">
            {/* ── Primitives ─────────────────────────────────────────────── */}
            <ShowcaseCategory categoryTitle="Primitives">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-badges" sectionTitle="Badges" sectionDescription="Variants crossed with semantic colors; optional leading icon and removable chip.">
                <div class="space-y-6">
                  <For each={badgeVariants}>
                    {(variant) => (
                      <div class="space-y-2">
                        <Text size="4" weight="semibold">
                          {variant}
                        </Text>
                        <div class="flex flex-wrap gap-2">
                          <For each={semanticColors}>
                            {(color) => (
                              <Badge variant={variant} color={color}>
                                {color}
                              </Badge>
                            )}
                          </For>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
                <div class="flex flex-wrap gap-2">
                  <Badge variant="outline" color="primary" icon="tag">
                    With icon
                  </Badge>
                  <Badge variant="solid" color="warning" onRemove={() => {}}>
                    Removable
                  </Badge>
                </div>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-buttons" sectionTitle="Buttons and icon buttons" sectionDescription="Responsive size: large on mobile (≤767 px), default on desktop.">
                <div class="flex flex-wrap gap-3">
                  <Button variant="solid">Solid</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link style</Button>
                  <Button variant="solid" disabled>
                    Disabled
                  </Button>
                </div>
                <div class="flex flex-wrap gap-3">
                  <Button variant="solid" icon="edit">
                    Leading icon
                  </Button>
                  <Button variant="outline" icon="check_circle" iconPosition="end">
                    Trailing icon
                  </Button>
                </div>
                <div class="flex flex-wrap gap-3">
                  <IconButton variant="solid" icon="check_circle" aria-label="Solid icon button" />
                  <IconButton variant="outline" icon="settings" aria-label="Outline icon button" />
                  <IconButton variant="ghost" icon="more_vert" aria-label="Ghost icon button" />
                  <IconButton variant="link" icon="search" aria-label="Link icon button" />
                  <IconButton variant="solid" icon="settings" aria-label="Disabled icon button" disabled />
                </div>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-icons" sectionTitle="Icons" sectionDescription="Material Symbols rounded set. Pass the slug as name; filled is the default. The stylesheet is loaded lazily on first use.">
                <div class="flex flex-wrap items-end gap-6">
                  <div class="flex flex-col items-center gap-2">
                    <Icon name="account_balance_wallet" size={32} />
                    <Text size="4" color="muted">
                      filled (default)
                    </Text>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <Icon name="account_balance_wallet" size={32} filled={false} />
                    <Text size="4" color="muted">
                      outline
                    </Text>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <Icon name="settings" size={24} />
                    <Text size="4" color="muted">
                      size 24
                    </Text>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <Icon name="settings" size={16} />
                    <Text size="4" color="muted">
                      size 16
                    </Text>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <Icon name="notifications" size={28} />
                    <Text size="4" color="muted">
                      size 28
                    </Text>
                  </div>
                </div>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-spinner-loading" sectionTitle="Spinner and loading">
                <div class="flex flex-wrap items-center gap-6">
                  <Spinner />
                  <Spinner aria-label="Loading content" />
                </div>
                <BackgroundCard>
                  <Loading message="Loading workspace preferences…" />
                </BackgroundCard>
              </ShowcaseSection>
            </ShowcaseCategory>

            {/* ── Typography and layout ───────────────────────────────────── */}
            <ShowcaseCategory categoryTitle="Typography and layout">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-text" sectionTitle="Text" sectionDescription="Five size steps with semantic color, weight, style, and icon options.">
                {/* Sizes */}
                <div class="space-y-3">
                  <Text size="4" weight="semibold" color="muted">
                    Sizes
                  </Text>
                  <div class="space-y-3">
                    <Text size="0">Size 0 — Display (bold, 4xl tight)</Text>
                    <Text size="1">Size 1 — Heading (semibold, 2xl tight)</Text>
                    <Text size="2">Size 2 — Body (medium, base)</Text>
                    <Text size="3">Size 3 — Small (medium, sm)</Text>
                    <Text size="4">Size 4 — Caption (medium, xs)</Text>
                  </div>
                </div>

                {/* Colors × sizes */}
                <div class="space-y-3">
                  <Text size="4" weight="semibold" color="muted">
                    Colors × sizes
                  </Text>
                  <div class="overflow-x-auto">
                    <table class="w-full border-collapse text-left">
                      <thead>
                        <tr>
                          <th class="pr-6 pb-2">
                            <Text size="4" color="muted">
                              color ↓ / size →
                            </Text>
                          </th>
                          {(["0", "1", "2", "3", "4"] as const).map((s) => (
                            <th class="pr-6 pb-2">
                              <Text size="4" color="muted">
                                size {s}
                              </Text>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(["default", "muted", "primary", "secondary", "success", "warning", "danger", "info"] as const).map((c) => (
                          <tr>
                            <td class="py-1 pr-6">
                              <Text size="4" color="muted">
                                {c}
                              </Text>
                            </td>
                            {(["0", "1", "2", "3", "4"] as const).map((s) => (
                              <td class="py-1 pr-6">
                                <Text size={s} color={c}>
                                  {c}
                                </Text>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Weights × sizes */}
                <div class="space-y-3">
                  <Text size="4" weight="semibold" color="muted">
                    Weights × sizes
                  </Text>
                  <div class="overflow-x-auto">
                    <table class="w-full border-collapse text-left">
                      <thead>
                        <tr>
                          <th class="pr-6 pb-2">
                            <Text size="4" color="muted">
                              weight ↓ / size →
                            </Text>
                          </th>
                          {(["0", "1", "2", "3", "4"] as const).map((s) => (
                            <th class="pr-6 pb-2">
                              <Text size="4" color="muted">
                                size {s}
                              </Text>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(["thin", "normal", "medium", "semibold", "bold"] as const).map((w) => (
                          <tr>
                            <td class="py-1 pr-6">
                              <Text size="4" color="muted">
                                {w}
                              </Text>
                            </td>
                            {(["0", "1", "2", "3", "4"] as const).map((s) => (
                              <td class="py-1 pr-6">
                                <Text size={s} weight={w}>
                                  {w}
                                </Text>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Styles: italic, underline, opacity */}
                <div class="space-y-3">
                  <Text size="4" weight="semibold" color="muted">
                    Style modifiers
                  </Text>
                  <div class="flex flex-wrap gap-4">
                    <Text italic>Italic</Text>
                    <Text underline>Underline</Text>
                    <Text italic underline>
                      Italic + underline
                    </Text>
                    <Text opacity={75}>75% opacity</Text>
                    <Text opacity={50}>50% opacity</Text>
                    <Text opacity={25}>25% opacity</Text>
                    <Text italic color="primary">
                      Italic primary
                    </Text>
                    <Text underline color="danger">
                      Underline danger
                    </Text>
                    <Text italic underline color="success">
                      Italic + underline success
                    </Text>
                    <Text opacity={50} color="warning">
                      50% warning
                    </Text>
                  </div>
                </div>

                {/* Icons leading — all sizes */}
                <div class="space-y-3">
                  <Text size="4" weight="semibold" color="muted">
                    Leading icon × sizes
                  </Text>
                  <div class="flex flex-wrap items-center gap-6">
                    <Text size="0" icon="star">
                      Size 0
                    </Text>
                    <Text size="1" icon="star">
                      Size 1
                    </Text>
                    <Text size="2" icon="star">
                      Size 2
                    </Text>
                    <Text size="3" icon="star">
                      Size 3
                    </Text>
                    <Text size="4" icon="star">
                      Size 4
                    </Text>
                  </div>
                </div>

                {/* Icons trailing — all sizes */}
                <div class="space-y-3">
                  <Text size="4" weight="semibold" color="muted">
                    Trailing icon × sizes
                  </Text>
                  <div class="flex flex-wrap items-center gap-6">
                    <Text size="0" icon="arrow_forward" iconPosition="end">
                      Size 0
                    </Text>
                    <Text size="1" icon="arrow_forward" iconPosition="end">
                      Size 1
                    </Text>
                    <Text size="2" icon="arrow_forward" iconPosition="end">
                      Size 2
                    </Text>
                    <Text size="3" icon="arrow_forward" iconPosition="end">
                      Size 3
                    </Text>
                    <Text size="4" icon="arrow_forward" iconPosition="end">
                      Size 4
                    </Text>
                  </div>
                </div>

                {/* Icons × colors */}
                <div class="space-y-3">
                  <Text size="4" weight="semibold" color="muted">
                    Leading icon × colors
                  </Text>
                  <div class="flex flex-wrap gap-4">
                    <Text icon="circle" color="default">
                      Default
                    </Text>
                    <Text icon="circle" color="muted">
                      Muted
                    </Text>
                    <Text icon="circle" color="primary">
                      Primary
                    </Text>
                    <Text icon="circle" color="secondary">
                      Secondary
                    </Text>
                    <Text icon="circle" color="success">
                      Success
                    </Text>
                    <Text icon="circle" color="warning">
                      Warning
                    </Text>
                    <Text icon="circle" color="danger">
                      Danger
                    </Text>
                    <Text icon="circle" color="info">
                      Info
                    </Text>
                  </div>
                  <Text size="4" weight="semibold" color="muted">
                    Trailing icon × colors
                  </Text>
                  <div class="flex flex-wrap gap-4">
                    <Text icon="open_in_new" iconPosition="end" color="default">
                      Default
                    </Text>
                    <Text icon="open_in_new" iconPosition="end" color="muted">
                      Muted
                    </Text>
                    <Text icon="open_in_new" iconPosition="end" color="primary">
                      Primary
                    </Text>
                    <Text icon="open_in_new" iconPosition="end" color="secondary">
                      Secondary
                    </Text>
                    <Text icon="open_in_new" iconPosition="end" color="success">
                      Success
                    </Text>
                    <Text icon="open_in_new" iconPosition="end" color="warning">
                      Warning
                    </Text>
                    <Text icon="open_in_new" iconPosition="end" color="danger">
                      Danger
                    </Text>
                    <Text icon="open_in_new" iconPosition="end" color="info">
                      Info
                    </Text>
                  </div>
                </div>

                {/* Icons × weights */}
                <div class="space-y-3">
                  <Text size="4" weight="semibold" color="muted">
                    Leading icon × weights
                  </Text>
                  <div class="flex flex-wrap gap-4">
                    <Text icon="label" weight="thin">
                      Thin
                    </Text>
                    <Text icon="label" weight="normal">
                      Normal
                    </Text>
                    <Text icon="label" weight="medium">
                      Medium
                    </Text>
                    <Text icon="label" weight="semibold">
                      Semibold
                    </Text>
                    <Text icon="label" weight="bold">
                      Bold
                    </Text>
                  </div>
                </div>

                {/* Icons + style modifiers */}
                <div class="space-y-3">
                  <Text size="4" weight="semibold" color="muted">
                    Icon + style modifiers
                  </Text>
                  <div class="flex flex-wrap gap-4">
                    <Text icon="edit" italic color="primary">
                      Italic primary
                    </Text>
                    <Text icon="check_circle" underline color="success">
                      Underline success
                    </Text>
                    <Text icon="warning" italic underline color="warning">
                      Italic + underline warning
                    </Text>
                    <Text icon="cancel" opacity={50} color="danger">
                      50% danger
                    </Text>
                    <Text icon="info" opacity={75} color="info">
                      75% info
                    </Text>
                    <Text icon="arrow_forward" iconPosition="end" italic color="secondary">
                      Trailing + italic
                    </Text>
                  </div>
                </div>

                {/* JSX icon element */}
                <div class="space-y-3">
                  <Text size="4" weight="semibold" color="muted">
                    JSX element as icon
                  </Text>
                  <div class="flex flex-wrap gap-6">
                    <Text icon={<img src="https://api.dicebear.com/7.x/thumbs/svg?seed=solid" alt="" class="rounded-full" />} size="2">
                      Custom avatar icon
                    </Text>
                    <Text icon={<span class="inline-block h-[1em] w-[1em] rounded-full bg-emerald-500" />} color="success">
                      Green dot indicator
                    </Text>
                    <Text icon={<span class="inline-block h-[1em] w-[1em] rounded-full bg-red-500" />} iconPosition="end" color="danger">
                      Red dot trailing
                    </Text>
                  </div>
                </div>

                {/* maxLength */}
                <div class="space-y-3">
                  <Text size="4" weight="semibold" color="muted">
                    maxLength truncation
                  </Text>
                  <div class="space-y-2">
                    <Text maxLength={30}>Truncated at 30 chars: this sentence is longer than thirty characters</Text>
                    <Text maxLength={20} color="muted">
                      Truncated at 20 chars: this sentence is longer
                    </Text>
                    <Text maxLength={10} size="1" color="danger">
                      Short limit
                    </Text>
                    <Text maxLength={50} icon="tag" color="primary">
                      With icon, truncated at 50 chars: this sentence is definitely longer than fifty characters
                    </Text>
                  </div>
                </div>

                {/* Realistic usage examples */}
                <div class="space-y-3">
                  <Text size="4" weight="semibold" color="muted">
                    Realistic usage
                  </Text>
                  <div class="space-y-4">
                    <div class="space-y-1">
                      <Text size="1" icon="account_balance_wallet">
                        Wallet balance
                      </Text>
                      <Text size="0" color="success">
                        ₹4,28,500
                      </Text>
                    </div>
                    <div class="space-y-1">
                      <Text size="3" color="muted">
                        Status
                      </Text>
                      <Text size="2" icon="check_circle" color="success" weight="semibold">
                        Active
                      </Text>
                    </div>
                    <div class="space-y-1">
                      <Text size="3" color="muted">
                        Alert
                      </Text>
                      <Text size="2" icon="warning" color="warning" weight="semibold">
                        Pending review
                      </Text>
                    </div>
                    <div class="space-y-1">
                      <Text size="3" color="muted">
                        Error
                      </Text>
                      <Text size="2" icon="cancel" color="danger">
                        Payment declined by bank
                      </Text>
                    </div>
                    <div class="space-y-1">
                      <Text size="3" color="muted">
                        Navigation link
                      </Text>
                      <Text size="2" icon="arrow_forward" iconPosition="end" color="primary" underline>
                        View all transactions
                      </Text>
                    </div>
                    <div class="space-y-1">
                      <Text size="3" color="muted">
                        Disabled / inactive
                      </Text>
                      <Text size="2" opacity={40} icon="block">
                        Feature unavailable
                      </Text>
                    </div>
                  </div>
                </div>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-divider" sectionTitle="Divider and SectionHeading" sectionDescription="Use Divider to separate content regions and SectionHeading for labelled subsections.">
                <div class="space-y-4">
                  <SectionHeading>Section heading example</SectionHeading>
                  <Divider />
                  <Text color="muted">Content below the divider. Pair with SectionHeading inside cards to create structured forms or detail panels.</Text>
                  <Divider />
                  <SectionHeading>Another section</SectionHeading>
                  <Text color="muted">Second section body text.</Text>
                </div>
              </ShowcaseSection>
            </ShowcaseCategory>

            {/* ── Data surfaces ───────────────────────────────────────────── */}
            <ShowcaseCategory categoryTitle="Data surfaces">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-metrics" sectionTitle="Metric cards" sectionDescription="Stat card with accent color, icon, value, and optional footer link.">
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <MetricCard title="Gross volume" accent="emerald" icon="account_balance_wallet" value="₹4.2M" linkHref="#" linkLabel="View settlements" />
                  <MetricCard title="Active users" accent="blue" icon="dashboard" value="1,284" />
                  <MetricCard title="Risk score" accent="amber" icon="tag" value="Medium" />
                  <MetricCard title="Automation" accent="violet" icon="settings" value="Running" />
                  <MetricCard title="Incidents" accent="rose" icon="check_circle" value="0 open" />
                  <MetricCard title="Revenue" accent="emerald" icon="currency_rupee" value="—" loading />
                </div>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-background-card" sectionTitle="BackgroundCard" sectionDescription="Fixed-style card shell for content panels. Compose your own header, body, and footer inside.">
                <BackgroundCard>
                  <div class="space-y-4">
                    <div class="space-y-1">
                      <Text size="1">Workspace usage</Text>
                      <Text color="muted">Pair with Metric cards for dashboard layouts.</Text>
                    </div>
                    <Text color="muted">Card content uses muted body copy. Use multiple BackgroundCards per page to group related information.</Text>
                    <div class="flex justify-end gap-2">
                      <Button variant="ghost">Dismiss</Button>
                      <Button>Save layout</Button>
                    </div>
                  </div>
                </BackgroundCard>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-data-card" sectionTitle="DataCard" sectionDescription="Ticket-style data surface. Can be clickable with an optional active/selected state, or static.">
                <div class="grid gap-3 sm:grid-cols-3">
                  <DataCard clickable active={activeDataCard() === 0} onClick={() => setActiveDataCard(0)}>
                    <div class="space-y-1">
                      <Text size="3" weight="semibold">
                        North warehouse
                      </Text>
                      <Text size="4" color="muted">
                        Active · ₹12,450
                      </Text>
                    </div>
                  </DataCard>
                  <DataCard clickable active={activeDataCard() === 1} onClick={() => setActiveDataCard(1)}>
                    <div class="space-y-1">
                      <Text size="3" weight="semibold">
                        South warehouse
                      </Text>
                      <Text size="4" color="muted">
                        Paused · ₹8,120
                      </Text>
                    </div>
                  </DataCard>
                  <DataCard>
                    <div class="space-y-1">
                      <Text size="3" weight="semibold">
                        Static card
                      </Text>
                      <Text size="4" color="muted">
                        Non-interactive surface
                      </Text>
                    </div>
                  </DataCard>
                </div>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-empty-state" sectionTitle="Empty state" sectionDescription="Centered placeholder for empty lists or zero-data views.">
                <EmptyState icon="inbox" title="No results" message="Try a different search or adjust your filters." />
                <EmptyState icon="inventory_2" title="No records yet" message="Create your first inventory movement to populate this list." />
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-table" sectionTitle="Table and pagination" sectionDescription="Compound component with scrollable container and paginator. Clickable rows support keyboard activation.">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Text size="4" weight="semibold">
                          Location
                        </Text>
                      </TableHead>
                      <TableHead>
                        <Text size="4" weight="semibold">
                          Status
                        </Text>
                      </TableHead>
                      <TableHead align="right" monospace>
                        <Text size="4" weight="semibold">
                          Amount
                        </Text>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <For each={tableRows}>
                      {(row, index) => (
                        <TableRow clickable active={index() === 0} onClick={() => {}}>
                          <TableCell>
                            <Text size="3" weight="normal">
                              {row.name}
                            </Text>
                          </TableCell>
                          <TableCell>
                            <Badge variant="solid" color={row.status === "Active" ? "success" : "warning"}>
                              {row.status}
                            </Badge>
                          </TableCell>
                          <TableCell align="right" monospace>
                            <Text size="3" weight="normal">
                              {row.amount}
                            </Text>
                          </TableCell>
                        </TableRow>
                      )}
                    </For>
                    <TableRow verticalAlign="top">
                      <TableCell>
                        <Text size="3" weight="normal">
                          Notes row (top aligned)
                        </Text>
                      </TableCell>
                      <TableCell colSpan={2}>
                        <Text size="3" weight="normal" color="muted">
                          Use verticalAlign="top" when a row mixes chips with multi-line copy.
                        </Text>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TablePagination limit={tablePagination().limit} offset={tablePagination().offset} currentPageCount={tableRows.length} totalCount={120} onChange={setTablePagination} />
                </Table>
              </ShowcaseSection>
            </ShowcaseCategory>

            {/* ── Forms and selection ─────────────────────────────────────── */}
            <ShowcaseCategory categoryTitle="Forms and selection">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-forms" sectionTitle="Fields, input, textarea, upload" sectionDescription="Single controls wrapped in Field for accessible label and hint text.">
                <div class="grid gap-8 lg:grid-cols-2">
                  <Field label="Plain text" for="showcase-input-plain" hint="Standard single-line control.">
                    <Input id="showcase-input-plain" placeholder="Type a workspace name" value={plainInputValue()} onInput={(e) => setPlainInputValue(e.currentTarget.value)} />
                  </Field>
                  <Field label="With leading icon" for="showcase-input-icon" hint="Search fields reuse the same padding balance as production screens.">
                    <Input id="showcase-input-icon" icon="search" placeholder="Search SKUs" value={plainInputValue()} onInput={(e) => setPlainInputValue(e.currentTarget.value)} />
                  </Field>
                  <Field label="Trailing suffix" for="showcase-input-suffix" hint="Use trailing labels for units.">
                    <Input id="showcase-input-suffix" type="number" trailingText="KG" placeholder="0.00" onInput={() => {}} />
                  </Field>
                  <Field label="Currency mask" for="showcase-input-currency" hint="Indian grouping with decimal guardrails.">
                    <Input id="showcase-input-currency" currency value={currencyInputValue()} onInput={(e) => setCurrencyInputValue(e.currentTarget.value)} />
                  </Field>
                  <Field label="Disabled" for="showcase-input-disabled">
                    <Input id="showcase-input-disabled" disabled placeholder="Unavailable" value="Locked" onInput={() => {}} />
                  </Field>
                </div>
                <div class="grid gap-8 lg:grid-cols-2">
                  <Field label="Textarea resize" for="showcase-textarea-resize" hint="Resize policy is explicit per instance.">
                    <Textarea id="showcase-textarea-resize" rows={4} resize="vertical" placeholder="Resize vertically…" />
                  </Field>
                  <Field label="Textarea auto-grow" for="showcase-textarea-autogrow" hint="Height clamps between minRows and maxRows.">
                    <Textarea id="showcase-textarea-autogrow" autoGrow minRows={2} maxRows={8} value={textareaAutoGrowValue()} onInput={(e) => setTextareaAutoGrowValue(e.currentTarget.value)} />
                  </Field>
                </div>
                <Field label="Upload" for="showcase-upload" hint="Shows count of selected files; supports multiple.">
                  <Upload id="showcase-upload" multiple selectedFiles={uploadSelectedFiles()} onSelectedFilesChange={setUploadSelectedFiles} />
                </Field>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-date-picker" sectionTitle="Date picker" sectionDescription="Single date or date range selection. Range mode sets start to 12:00 AM and end to 11:59:59 PM automatically.">
                <div class="grid gap-8 lg:grid-cols-2">
                  <Field label="Single date" for="showcase-date-picker-single" hint="Pick one calendar day.">
                    <DatePicker id="showcase-date-picker-single" mode="single" value={singleDateValue()} onChange={setSingleDateValue} placeholder="Select a date" />
                  </Field>
                  <Field label="Date range" for="showcase-date-picker-range" hint="First click sets start (12:00 AM), second click sets end (11:59:59 PM).">
                    <DatePicker id="showcase-date-picker-range" mode="range" value={rangeDateValue()} onChange={setRangeDateValue} placeholder="Select date range" />
                  </Field>
                  <Field label="Disabled" for="showcase-date-picker-disabled">
                    <DatePicker id="showcase-date-picker-disabled" mode="single" disabled placeholder="Unavailable" />
                  </Field>
                </div>
                <BackgroundCard>
                  <div class="space-y-2">
                    <Text size="4" weight="semibold">
                      Selected values
                    </Text>
                    <div class="space-y-1">
                      <Text size="4">
                        Single:{" "}
                        {createMemo(() => {
                          const v = singleDateValue();
                          return v.mode === "single" && v.date ? v.date.toISOString() : "—";
                        })()}
                      </Text>
                      <Text size="4">
                        Range from:{" "}
                        {createMemo(() => {
                          const v = rangeDateValue();
                          return v.mode === "range" && v.from ? v.from.toISOString() : "—";
                        })()}
                      </Text>
                      <Text size="4">
                        Range to:{" "}
                        {createMemo(() => {
                          const v = rangeDateValue();
                          return v.mode === "range" && v.to ? v.to.toISOString() : "—";
                        })()}
                      </Text>
                    </div>
                  </div>
                </BackgroundCard>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-toggle-group" sectionTitle="Toggle group" sectionDescription="Radio (single) or checkbox (multiple) card group. Selected options show a blue border and check icon.">
                <div class="space-y-4">
                  <ToggleGroup
                    name="showcase-toggle-digest"
                    selectionMode="multiple"
                    value={digestSelection()}
                    onChange={setDigestSelection}
                    options={[{ label: "Receive weekly digest", value: "weekly", description: "One email every Monday with product updates and tips." }]}
                  />
                  <ToggleGroup
                    name="showcase-toggle-digest-disabled"
                    selectionMode="multiple"
                    disabled
                    value={["weekly"]}
                    onChange={() => {}}
                    options={[{ label: "Disabled option", value: "weekly", description: "You cannot change this option while the account is locked." }]}
                  />
                </div>
                <div class="grid gap-6 lg:grid-cols-2">
                  <Field label="Shipping method (single, allowNoSelection)" hint="Click the active option again to clear it.">
                    <ToggleGroup
                      name="showcase-toggle-shipping"
                      selectionMode="single"
                      allowNoSelection
                      value={shippingMethod()}
                      onChange={setShippingMethod}
                      options={[
                        { label: "Standard (3–5 days)", value: "standard", description: "Best value for non-urgent orders." },
                        { label: "Express (1–2 days)", value: "express", description: "Faster delivery with tracking updates." },
                        { label: "Overnight", value: "overnight", description: "Arrives next business day when ordered before 2 pm." }
                      ]}
                    />
                  </Field>
                  <Field label="Disabled group">
                    <ToggleGroup
                      name="showcase-toggle-shipping-disabled"
                      selectionMode="single"
                      allowNoSelection={false}
                      value="express"
                      disabled
                      onChange={() => {}}
                      options={[
                        { label: "Standard (3–5 days)", value: "standard", description: "Best value for non-urgent orders." },
                        { label: "Express (1–2 days)", value: "express", description: "Faster delivery with tracking updates." },
                        { label: "Overnight", value: "overnight", description: "Arrives next business day when ordered before 2 pm." }
                      ]}
                    />
                  </Field>
                </div>
                <Field label="Contact channels (labels only, no descriptions)">
                  <ToggleGroup
                    name="showcase-toggle-no-description"
                    selectionMode="multiple"
                    value={contactChannels()}
                    onChange={setContactChannels}
                    options={[
                      { label: "Email", value: "email" },
                      { label: "SMS", value: "sms" },
                      { label: "Push", value: "push" }
                    ]}
                  />
                </Field>
              </ShowcaseSection>
            </ShowcaseCategory>

            {/* ── Navigation ──────────────────────────────────────────────── */}
            <ShowcaseCategory categoryTitle="Navigation">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-tabs" sectionTitle="Tabs" sectionDescription="Accessible tab bar with ARIA roles and underline indicator.">
                <Tabs tabDefinitions={tabDefinitions} activeTabValue={activeShowcaseTab} onTabSelect={setActiveShowcaseTab} />
                <BackgroundCard>
                  <Text color="muted">{tabPanelCopy()}</Text>
                </BackgroundCard>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-dropdowns" sectionTitle="Dropdowns" sectionDescription="Single-select options close on pick; multi-select keeps the menu open and marks each chosen item with a checkmark.">
                <div class="space-y-4">
                  <SectionHeading>Single select</SectionHeading>
                  <div class="grid gap-6 md:grid-cols-2">
                    <Field label="Basic menu" for="showcase-dropdown-basic">
                      <Dropdown options={dropdownOptions()} value={dropdownValue()} onChange={setDropdownValue}>
                        <DropdownTrigger id="showcase-dropdown-basic">{dropdownValue() ?? "Select a fruit"}</DropdownTrigger>
                      </Dropdown>
                    </Field>
                    <Field label="Searchable" for="showcase-dropdown-search">
                      <Dropdown options={cityOptions()} value={searchableDropdownValue()} onChange={setSearchableDropdownValue} searchable>
                        <DropdownTrigger id="showcase-dropdown-search">
                          <DropdownValue>{searchableDropdownValue() ?? "Pick a city"}</DropdownValue>
                        </DropdownTrigger>
                      </Dropdown>
                    </Field>
                    <Field label="Custom row renderer" for="showcase-dropdown-custom">
                      <Dropdown
                        options={dropdownOptions()}
                        value={itemizedDropdownValue()}
                        onChange={setItemizedDropdownValue}
                        itemComponent={({ item }) => (
                          <Text color="primary" weight="semibold">
                            {item.rawValue}
                          </Text>
                        )}
                      >
                        <DropdownTrigger id="showcase-dropdown-custom">
                          <DropdownValue>{itemizedDropdownValue() ?? "Styled options"}</DropdownValue>
                        </DropdownTrigger>
                      </Dropdown>
                    </Field>
                    <Field label="Icon-only trigger" for="showcase-dropdown-icon">
                      <Dropdown options={numericOptions()} value={iconTriggerDropdownValue()} onChange={setIconTriggerDropdownValue}>
                        <DropdownIconTrigger id="showcase-dropdown-icon" icon="more_vert" aria-label="Open numeric menu" />
                      </Dropdown>
                    </Field>
                    <Field label="Disabled menu" for="showcase-dropdown-disabled">
                      <Dropdown options={dropdownOptions()} value="Apple" onChange={() => {}} disabled>
                        <DropdownTrigger id="showcase-dropdown-disabled">Disabled</DropdownTrigger>
                      </Dropdown>
                    </Field>
                    <Field label="Non-clickable user row" for="showcase-dropdown-user-row">
                      <Dropdown options={[]} onChange={() => {}}>
                        <DropdownIconTrigger id="showcase-dropdown-user-row" icon="more_vert" aria-label="User menu" />
                        <DropdownContent>
                          <DropdownItem clickable={false}>
                            <div class="space-y-0.5">
                              <Text size="3" weight="medium">
                                Jane Smith
                              </Text>
                              <Text size="4" color="muted">
                                jane@example.com
                              </Text>
                            </div>
                          </DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    </Field>
                  </div>
                </div>
                <div class="space-y-4">
                  <SectionHeading>DropdownItem icons</SectionHeading>
                  <div class="grid gap-6 md:grid-cols-2">
                    <Field label="Leading icon (string)" for="showcase-dropdown-item-icon-start">
                      <Dropdown options={[]} onChange={() => {}}>
                        <DropdownIconTrigger id="showcase-dropdown-item-icon-start" icon="more_vert" aria-label="Actions menu" />
                        <DropdownContent>
                          <DropdownItem icon="edit">Edit</DropdownItem>
                          <DropdownItem icon="content_copy">Duplicate</DropdownItem>
                          <DropdownSeparator />
                          <DropdownItem icon="delete">Delete</DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    </Field>
                    <Field label="Disabled items" for="showcase-dropdown-item-icon-disabled">
                      <Dropdown options={[]} onChange={() => {}}>
                        <DropdownIconTrigger id="showcase-dropdown-item-icon-disabled" icon="more_vert" aria-label="Actions menu disabled" />
                        <DropdownContent>
                          <DropdownItem icon="edit">Edit</DropdownItem>
                          <DropdownItem icon="content_copy" disabled>
                            Duplicate (disabled)
                          </DropdownItem>
                          <DropdownSeparator />
                          <DropdownItem icon="delete" disabled>
                            Delete (disabled)
                          </DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    </Field>
                    <Field label="Selected items inherit icon color" for="showcase-dropdown-item-icon-selected">
                      <Dropdown options={[]} onChange={() => {}}>
                        <DropdownIconTrigger id="showcase-dropdown-item-icon-selected" icon="more_vert" aria-label="View menu" />
                        <DropdownContent>
                          <DropdownItem icon="check_circle" selected>
                            Active (selected)
                          </DropdownItem>
                          <DropdownItem icon="pause_circle">Paused</DropdownItem>
                          <DropdownItem icon="cancel">Archived</DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    </Field>
                    <Field label="img element as icon" for="showcase-dropdown-item-icon-img">
                      <Dropdown options={[]} onChange={() => {}}>
                        <DropdownIconTrigger id="showcase-dropdown-item-icon-img" icon="more_vert" aria-label="Profile menu" />
                        <DropdownContent>
                          <DropdownItem icon={<img src="https://api.dicebear.com/7.x/thumbs/svg?seed=alice" alt="" />}>Alice</DropdownItem>
                          <DropdownItem icon={<img src="https://api.dicebear.com/7.x/thumbs/svg?seed=bob" alt="" />}>Bob</DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    </Field>
                  </div>
                </div>
                <div class="space-y-4">
                  <SectionHeading>Multi select</SectionHeading>
                  <div class="grid gap-6 md:grid-cols-2">
                    <Field label="Multi-select fruits" for="showcase-dropdown-multi" hint="Menu stays open; selected items are checked.">
                      <Dropdown options={dropdownOptions()} multiSelect multiSelectValue={multiSelectDropdownValues()} onMultiSelectChange={setMultiSelectDropdownValues}>
                        <DropdownTrigger id="showcase-dropdown-multi">
                          <DropdownValue>{multiSelectDropdownValues().length > 0 ? multiSelectDropdownValues().join(", ") : "Select fruits"}</DropdownValue>
                        </DropdownTrigger>
                      </Dropdown>
                    </Field>
                    <Field label="Multi-select cities (searchable)" for="showcase-dropdown-multi-search">
                      <Dropdown options={cityOptions()} multiSelect searchable multiSelectValue={multiSelectCityValues()} onMultiSelectChange={setMultiSelectCityValues}>
                        <DropdownTrigger id="showcase-dropdown-multi-search">
                          <DropdownValue>{multiSelectCityValues().length > 0 ? multiSelectCityValues().join(", ") : "Select cities"}</DropdownValue>
                        </DropdownTrigger>
                      </Dropdown>
                    </Field>
                  </div>
                </div>
              </ShowcaseSection>

              <ShowcaseSection
                sectionHeadingIdentifier="showcase-heading-right-panel"
                sectionTitle="Right panel"
                sectionDescription="On medium screens and up the main column reflows beside this panel. On narrow viewports it is a fixed full-width overlay. Use Show to mount/unmount after the close animation completes."
              >
                <div class="flex flex-wrap items-center gap-3">
                  <Button
                    variant={isRightPanelOpen() ? "solid" : "outline"}
                    onClick={() => {
                      if (!isRightPanelOpen()) openRightPanel();
                    }}
                    disabled={isRightPanelOpen()}
                  >
                    {isRightPanelOpen() ? "Panel open" : "Open right panel"}
                  </Button>
                  <Text size="3" color="muted">
                    Opening while the left sidebar is visible on mobile closes the sidebar automatically.
                  </Text>
                </div>
              </ShowcaseSection>
            </ShowcaseCategory>

            {/* ── Overlays and feedback ───────────────────────────────────── */}
            <ShowcaseCategory categoryTitle="Overlays and feedback">
              <ShowcaseSection
                sectionHeadingIdentifier="showcase-heading-dialog"
                sectionTitle="Dialog"
                sectionDescription="Uses the native dialog element: focus management, backdrop blur, and scroll locking built in. On mobile the dialog fills the full viewport with only the body area scrolling."
              >
                <div class="flex flex-wrap gap-3">
                  <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
                  <Button variant="outline" onClick={() => setDropdownDialogOpen(true)}>
                    Dialog with dropdowns
                  </Button>
                  <Button variant="outline" onClick={() => setHeaderDropdownDialogOpen(true)}>
                    Dialog with header dropdown
                  </Button>
                </div>

                <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm destructive action</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      <DialogDescription>Footer actions keep equal minimum widths on wide breakpoints. On mobile the header and footer stay fixed while this body scrolls independently.</DialogDescription>
                      <DialogDescription>This dialog intentionally has extra content to verify scroll behavior on mobile.</DialogDescription>
                      <Field label="Workspace name" for="dialog-workspace-name">
                        <Input id="dialog-workspace-name" placeholder="e.g. my-workspace" />
                      </Field>
                      <Field label="Reason for deletion" for="dialog-reason">
                        <Textarea id="dialog-reason" placeholder="Briefly describe why this workspace is being deleted…" />
                      </Field>
                      <DialogDescription>Once deleted, all data associated with this workspace will be permanently removed and cannot be recovered. Billing will stop immediately upon deletion.</DialogDescription>
                    </DialogBody>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="solid" onClick={() => setDialogOpen(false)}>
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={headerDropdownDialogOpen()} onOpenChange={setHeaderDropdownDialogOpen}>
                  <DialogContent>
                    <DialogHeader
                      actions={
                        <Dropdown options={[]} value={headerDropdownDialogView()} onChange={() => {}}>
                          <DropdownTrigger variant="ghost">{headerDropdownDialogView()}</DropdownTrigger>
                          <DropdownContent>
                            <DropdownItem item={{ rawValue: "Details" }} selected={headerDropdownDialogView() === "Details"} onClick={() => setHeaderDropdownDialogView("Details")}>
                              Details
                            </DropdownItem>
                            <DropdownItem item={{ rawValue: "Activity" }} selected={headerDropdownDialogView() === "Activity"} onClick={() => setHeaderDropdownDialogView("Activity")}>
                              Activity
                            </DropdownItem>
                            <DropdownItem item={{ rawValue: "Settings" }} selected={headerDropdownDialogView() === "Settings"} onClick={() => setHeaderDropdownDialogView("Settings")}>
                              Settings
                            </DropdownItem>
                          </DropdownContent>
                        </Dropdown>
                      }
                    >
                      <DialogTitle>{headerDropdownDialogView()}</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      <DialogDescription>The header dropdown should open left-aligned below the trigger, not centered in the viewport.</DialogDescription>
                    </DialogBody>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setHeaderDropdownDialogOpen(false)}>
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={dropdownDialogOpen()} onOpenChange={setDropdownDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dialog with dropdowns</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      <DialogDescription>Dropdown and DatePicker popups should appear above this dialog, not behind it.</DialogDescription>
                      <div class="mt-4 grid gap-4 sm:grid-cols-2">
                        <Field label="Fruit" for="dialog-dropdown">
                          <Dropdown options={["Apple", "Banana", "Cherry", "Date", "Elderberry"]} value={dropdownDialogValue()} onChange={setDropdownDialogValue}>
                            <DropdownTrigger id="dialog-dropdown">
                              <DropdownValue>{dropdownDialogValue() ?? "Pick a fruit"}</DropdownValue>
                            </DropdownTrigger>
                          </Dropdown>
                        </Field>
                        <Field label="Date" for="dialog-datepicker">
                          <DatePicker id="dialog-datepicker" mode="single" value={datePickerDialogValue()} onChange={setDatePickerDialogValue} placeholder="Select a date" />
                        </Field>
                      </div>
                    </DialogBody>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setDropdownDialogOpen(false)}>
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-toast" sectionTitle="Toasts" sectionDescription="Auto-dismiss after 5 seconds. Place Toaster once in your app root; call addToast from anywhere.">
                <div class="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => addToast({ title: "Saved", description: "Workspace preferences were updated.", variant: "success" })}>
                    Toast success
                  </Button>
                  <Button variant="outline" onClick={() => addToast({ title: "Payment failed", description: "The bank declined this charge.", variant: "danger" })}>
                    Toast danger
                  </Button>
                  <Button variant="outline" onClick={() => addToast({ title: "Deprecation", description: "This endpoint will be removed next month.", variant: "warning" })}>
                    Toast warning
                  </Button>
                  <Button variant="outline" onClick={() => addToast({ title: "Heads up", description: "Default styling for informational notices." })}>
                    Toast default
                  </Button>
                </div>
              </ShowcaseSection>
            </ShowcaseCategory>

            <footer class="mt-16 pb-8">
              <Show when={import.meta.env.DEV}>
                <Text size="4" color="muted">
                  Launch with <code>npm run development</code> from the repository root.
                </Text>
              </Show>
            </footer>
          </div>
        </PageLayout>

        <Show when={isRightPanelOpen()}>
          <RightPanelLayout
            title="Right panel"
            subtitle="In flow with the main column on medium screens and up; fixed overlay on small viewports"
            onOpenChange={(isPanelOpen) => {
              if (!isPanelOpen) setIsRightPanelOpen(false);
            }}
            closeAriaLabel="Close right panel showcase"
          >
            <div class="space-y-3">
              <Text color="muted">Place order details, filters, or a creation form here. On medium screens and up the main column reflows beside this surface.</Text>
              <Text color="muted">This panel scrolls independently from the main column so it can hold long forms without shifting the page.</Text>
            </div>
          </RightPanelLayout>
        </Show>
      </MainLayout>
    </div>
  );
};

const ShowcaseCategory = (properties: ShowcaseCategoryProperties): JSX.Element => {
  return (
    <section class="space-y-12" aria-label={properties.categoryTitle}>
      <div class="space-y-2">
        <Text size="4" weight="semibold">
          {properties.categoryTitle}
        </Text>
        <Divider />
      </div>
      <div class="space-y-10">{properties.children}</div>
    </section>
  );
};

const ShowcaseSection = (properties: ShowcaseSectionProperties): JSX.Element => {
  return (
    <div class="scroll-mt-28" aria-labelledby={properties.sectionHeadingIdentifier}>
      <BackgroundCard>
        <header class="space-y-2 pb-5">
          <SectionHeading id={properties.sectionHeadingIdentifier}>{properties.sectionTitle}</SectionHeading>
          <Show when={properties.sectionDescription}>
            <Text size="3" color="muted">
              {properties.sectionDescription}
            </Text>
          </Show>
          <Divider />
        </header>
        <div class="space-y-6">{properties.children}</div>
      </BackgroundCard>
    </div>
  );
};
