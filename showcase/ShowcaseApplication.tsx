import type { BadgeVariant } from "@/components/badge/Badge";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { BackgroundCard } from "@/components/card/BackgroundCard";
import { DataCard } from "@/components/card/DataCard";
import { MetricCard } from "@/components/card/MetricCard";
import { DatePicker, type DatePickerValue } from "@/components/date-picker/DatePicker";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/dialog/Dialog";
import { Divider } from "@/components/divider/Divider";
import { Dropdown, DropdownContent, DropdownIconTrigger, DropdownItem, DropdownTrigger, DropdownValue } from "@/components/dropdown/Dropdown";
import { EmptyState } from "@/components/empty-state/EmptyState";
import { Field } from "@/components/field/Field";
import { HeaderLayout } from "@/components/header-layout";
import { IconButton } from "@/components/icon-button/IconButton";
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

const tableRows: { name: string; role: string; amount: string }[] = [
  { name: "North warehouse", role: "Active", amount: "₹12,450" },
  { name: "South warehouse", role: "Paused", amount: "₹8,120" },
  { name: "East hub", role: "Active", amount: "₹21,980" }
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
    icon: "calendar_today"
  },
  {
    tabValue: "settings",
    label: "Settings",
    tabElementIdentifier: "showcase-tab-settings",
    panelElementIdentifier: "showcase-panel-settings",
    icon: "settings"
  }
];

/**
 * Runnable Showcase page that exercises solid-kit components, variants, and common control states.
 */
export const ShowcaseApplication = (): JSX.Element => {
  const isMobileViewport = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = createSignal(isMobileViewport());
  const [navigationFilterValue] = createSignal<string>("");
  const toggleSidebar = (): void => {
    setSidebarCollapsed((previous) => {
      return !previous;
    });
  };
  const closeSidebar = (): void => {
    if (isMobileViewport()) {
      setSidebarCollapsed(true);
    }
  };
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [dropdownDialogOpen, setDropdownDialogOpen] = createSignal(false);
  const [dropdownDialogValue, setDropdownDialogValue] = createSignal<string | undefined>("Cherry");
  const [headerDropdownDialogOpen, setHeaderDropdownDialogOpen] = createSignal(false);
  const [headerDropdownDialogView, setHeaderDropdownDialogView] = createSignal("Details");
  const [datePickerDialogValue, setDatePickerDialogValue] = createSignal<DatePickerValue>({ mode: "single", date: undefined });
  const [digestSelection, setDigestSelection] = createSignal<string[]>(["weekly"]);
  const [dropdownValue, setDropdownValue] = createSignal<string | undefined>("Cherry");
  const [itemizedDropdownValue, setItemizedDropdownValue] = createSignal<string | undefined>("Banana");
  const [searchableDropdownValue, setSearchableDropdownValue] = createSignal<string | undefined>("Mumbai");
  const [iconTriggerDropdownValue, setIconTriggerDropdownValue] = createSignal<string | undefined>("Two");
  const [multiSelectDropdownValues, setMultiSelectDropdownValues] = createSignal<string[]>(["Banana", "Date"]);
  const [multiSelectCityValues, setMultiSelectCityValues] = createSignal<string[]>([]);
  const [currencyInputValue, setCurrencyInputValue] = createSignal("1234567.50");
  const [plainInputValue, setPlainInputValue] = createSignal("Solid Kit");
  const [textareaAutoGrowValue, setTextareaAutoGrowValue] = createSignal("Type multiple lines to watch auto-grow clamp between min and max rows.");
  const [uploadSelectedFiles, setUploadSelectedFiles] = createSignal<File[]>([]);
  const [activeShowcaseTab, setActiveShowcaseTab] = createSignal<ShowcaseTabValue>("overview");
  const [tablePagination, setTablePagination] = createSignal<{ limit: number; offset: number }>({ limit: 25, offset: 0 });
  const [shippingMethod, setShippingMethod] = createSignal<string | undefined>("standard");
  const [contactChannelsWithoutDescription, setContactChannelsWithoutDescription] = createSignal<string[]>(["email"]);
  const [documentColorSchemeName, setDocumentColorSchemeName] = createDocumentColorSchemePreferenceSignal();
  const [singleDateValue, setSingleDateValue] = createSignal<DatePickerValue>({ mode: "single", date: undefined });
  const [rangeDateValue, setRangeDateValue] = createSignal<DatePickerValue>({ mode: "range", from: undefined, to: undefined });
  const [isRightPanelOpen, setIsRightPanelOpen] = createSignal(false);
  const [activeDataCard, setActiveDataCard] = createSignal<number | undefined>(0);
  const openRightPanel = (): void => {
    if (isMobileViewport()) {
      setSidebarCollapsed(true);
    }
    setIsRightPanelOpen(true);
  };

  const dropdownOptions = (): string[] => {
    return ["Apple", "Banana", "Cherry", "Date", "Elderberry"];
  };

  const cityOptions = (): string[] => {
    return ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Kolkata"];
  };

  const numericOptions = (): string[] => {
    return ["One", "Two", "Three"];
  };

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

  const filteredShowcaseLeftPanelNavigationDocument = createMemo<LeftPanelLayoutNavigationDocumentJson>(() => {
    const normalizedFilterValue = navigationFilterValue().trim().toLowerCase();
    if (normalizedFilterValue.length === 0) {
      return showcaseLeftPanelNavigationDocument;
    }
    return {
      groups: showcaseLeftPanelNavigationDocument.groups
        .map((group) => {
          return {
            ...group,
            items: group.items.filter((item) => {
              return item.label.toLowerCase().includes(normalizedFilterValue);
            })
          };
        })
        .filter((group) => {
          return group.items.length > 0;
        })
    };
  });

  return (
    <div class="flex h-full min-h-0 flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Toaster />

      <MainLayout>
        <HeaderLayout
          titleElement={
            <div class="flex min-w-0 items-center gap-3">
              <IconButton variant="ghost" icon={sidebarCollapsed() ? "menu" : "menu_open"} onClick={toggleSidebar} aria-label={sidebarCollapsed() ? "Expand sidebar" : "Collapse sidebar"} />
              <h2 class="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl dark:text-white">Solid Kit showcase</h2>
            </div>
          }
        >
          <div class="flex shrink-0 items-center gap-1 rounded-full border border-gray-200 bg-gray-100/80 p-1 dark:border-gray-700 dark:bg-gray-900/60">
            <IconButton
              variant={documentColorSchemeName() === "light" ? "solid" : "ghost"}
              icon="light_mode"
              aria-label="Use light color scheme"
              onClick={() => {
                setDocumentColorSchemeName("light");
              }}
            />
            <IconButton
              variant={documentColorSchemeName() === "dark" ? "solid" : "ghost"}
              icon="dark_mode"
              aria-label="Use dark color scheme"
              onClick={() => {
                setDocumentColorSchemeName("dark");
              }}
            />
          </div>
        </HeaderLayout>

        <LeftPanelLayout
          collapsed={sidebarCollapsed()}
          onOpenChange={(isPanelOpen) => {
            if (!isPanelOpen) {
              closeSidebar();
            }
          }}
          navigationDocument={filteredShowcaseLeftPanelNavigationDocument()}
        />

        <PageLayout>
          <div class="mx-auto max-w-6xl space-y-16">
            <ShowcaseCategory categoryTitle="Primitives">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-badges" sectionTitle="Badges" sectionDescription="Variants crossed with semantic colors; optional leading icon and removable chip.">
                <div class="space-y-6">
                  <For each={badgeVariants}>
                    {(variant) => {
                      return (
                        <div class="space-y-2">
                          <p class="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-500">{variant}</p>
                          <div class="flex flex-wrap gap-2">
                            <For each={semanticColors}>
                              {(color) => {
                                return (
                                  <Badge variant={variant} color={color}>
                                    {color}
                                  </Badge>
                                );
                              }}
                            </For>
                          </div>
                        </div>
                      );
                    }}
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

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-buttons" sectionTitle="Buttons and icon buttons">
                <div class="flex flex-wrap gap-3">
                  <Button variant="solid">Default</Button>
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
                  <IconButton variant="solid" icon="check_circle" aria-label="Default icon button" />
                  <IconButton variant="outline" icon="settings" aria-label="Outline icon button" />
                  <IconButton variant="ghost" icon="more_vert" aria-label="Ghost icon button" />
                  <IconButton variant="link" icon="search" aria-label="Link icon button" />
                  <IconButton variant="solid" icon="settings" aria-label="Disabled icon button" disabled />
                </div>
              </ShowcaseSection>
            </ShowcaseCategory>

            <ShowcaseCategory categoryTitle="Progress and loading">
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

            <ShowcaseCategory categoryTitle="Data surfaces">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-metrics" sectionTitle="Metric cards">
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <MetricCard title="Gross volume" accent="emerald" icon="account_balance_wallet" value="₹4.2M" linkHref="#" linkLabel="View settlements" />
                  <MetricCard title="Active users" accent="blue" icon="dashboard" value="1,284" />
                  <MetricCard title="Risk score" accent="amber" icon="tag" value="Medium" />
                  <MetricCard title="Automation" accent="violet" icon="settings" value="Running" />
                  <MetricCard title="Incidents" accent="rose" icon="check_circle" value="0 open" />
                </div>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-card-empty" sectionTitle="Card and empty state">
                <BackgroundCard>
                  <div class="space-y-6">
                    <header class="space-y-1">
                      <div class="text-lg font-semibold text-gray-900">Workspace usage</div>
                      <p class="text-sm text-gray-600">Simple card shell. Compose your own header/content/footer.</p>
                    </header>
                    <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">Card content uses muted body copy. Pair with Metric cards for dashboard layouts.</p>
                    <div class="flex w-full justify-end gap-2">
                      <Button variant="ghost">Dismiss</Button>
                      <Button>Save layout</Button>
                    </div>
                  </div>
                </BackgroundCard>
                <EmptyState icon="inventory_2" title="No records yet" message="Create your first inventory movement to populate this list." />
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-table" sectionTitle="Table and pagination">
                <BackgroundCard>
                  <div class="-m-8 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead align="right" monospace>
                            Amount
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <For each={tableRows}>
                          {(row, index) => {
                            return (
                              <TableRow clickable active={index() === 0} onClick={() => {}}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>
                                  <Badge variant="solid" color={row.role === "Active" ? "success" : "warning"}>
                                    {row.role}
                                  </Badge>
                                </TableCell>
                                <TableCell align="right" monospace>
                                  {row.amount}
                                </TableCell>
                              </TableRow>
                            );
                          }}
                        </For>
                        <TableRow verticalAlign="top">
                          <TableCell>Notes row (top aligned)</TableCell>
                          <TableCell colSpan={2}>Use verticalAlign=&quot;top&quot; when a row mixes chips with multi-line copy.</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <TablePagination limit={tablePagination().limit} offset={tablePagination().offset} currentPageCount={tableRows.length} totalCount={120} onChange={setTablePagination} />
                  </div>
                </BackgroundCard>
              </ShowcaseSection>
            </ShowcaseCategory>

            <ShowcaseCategory categoryTitle="Cards">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-data-card" sectionTitle="DataCard" sectionDescription="Clickable or static card surface. Active state highlights the selected card.">
                <div class="grid gap-3 sm:grid-cols-3">
                  <DataCard
                    clickable
                    active={activeDataCard() === 0}
                    onClick={() => {
                      setActiveDataCard(0);
                    }}
                  >
                    <div class="space-y-1">
                      <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">North warehouse</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Active · ₹12,450</div>
                    </div>
                  </DataCard>
                  <DataCard
                    clickable
                    active={activeDataCard() === 1}
                    onClick={() => {
                      setActiveDataCard(1);
                    }}
                  >
                    <div class="space-y-1">
                      <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">South warehouse</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Paused · ₹8,120</div>
                    </div>
                  </DataCard>
                  <DataCard>
                    <div class="space-y-1">
                      <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">Static card</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Non-interactive surface</div>
                    </div>
                  </DataCard>
                </div>
              </ShowcaseSection>
            </ShowcaseCategory>

            <ShowcaseCategory categoryTitle="Typography and layout">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-text" sectionTitle="Text" sectionDescription="Five size steps with semantic color and weight options. Text accepts a leading or trailing icon.">
                <div class="space-y-4">
                  <Text size="0">Display — size 0 (bold)</Text>
                  <Text size="1">Heading — size 1 (semibold)</Text>
                  <Text size="2">Body — size 2, default weight medium</Text>
                  <Text size="3">Small — size 3</Text>
                  <Text size="4">Caption — size 4</Text>
                </div>
                <div class="flex flex-wrap gap-4">
                  <Text color="primary">Primary</Text>
                  <Text color="secondary">Secondary</Text>
                  <Text color="muted">Muted</Text>
                  <Text color="success">Success</Text>
                  <Text color="warning">Warning</Text>
                  <Text color="danger">Danger</Text>
                  <Text color="info">Info</Text>
                </div>
                <div class="flex flex-wrap gap-4">
                  <Text weight="thin">Thin</Text>
                  <Text weight="normal">Normal</Text>
                  <Text weight="medium">Medium</Text>
                  <Text weight="semibold">Semibold</Text>
                  <Text weight="bold">Bold</Text>
                </div>
                <div class="flex flex-wrap gap-4">
                  <Text italic>Italic text</Text>
                  <Text underline>Underlined text</Text>
                  <Text opacity={50}>50% opacity</Text>
                </div>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-divider" sectionTitle="Divider and SectionHeading" sectionDescription="Use Divider to separate content regions and SectionHeading for labelled subsections.">
                <div class="space-y-4">
                  <SectionHeading>Section heading example</SectionHeading>
                  <Divider />
                  <p class="text-sm text-gray-600 dark:text-gray-400">Content below the divider. Use multiple SectionHeading + Divider pairs inside a card to create structured forms or detail panels.</p>
                  <Divider />
                  <SectionHeading>Another section</SectionHeading>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Second section body text.</p>
                </div>
              </ShowcaseSection>
            </ShowcaseCategory>

            <ShowcaseCategory categoryTitle="Forms and selection">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-forms" sectionTitle="Fields, input, textarea, upload" sectionDescription="Single controls and compound fields.">
                <div class="grid gap-8 lg:grid-cols-2">
                  <Field label="Plain text" for="showcase-input-plain" hint="Standard single-line control.">
                    <Input
                      id="showcase-input-plain"
                      placeholder="Type a workspace name"
                      value={plainInputValue()}
                      onInput={(event) => {
                        setPlainInputValue(event.currentTarget.value);
                      }}
                    />
                  </Field>
                  <Field label="With leading icon" for="showcase-input-icon" hint="Search fields reuse the same padding balance as production screens.">
                    <Input
                      id="showcase-input-icon"
                      icon="search"
                      placeholder="Search SKUs"
                      value={plainInputValue()}
                      onInput={(event) => {
                        setPlainInputValue(event.currentTarget.value);
                      }}
                    />
                  </Field>
                  <Field label="Trailing suffix" for="showcase-input-suffix" hint="Use trailing labels for units.">
                    <Input id="showcase-input-suffix" type="number" trailingText="KG" placeholder="0.00" onInput={() => {}} />
                  </Field>
                  <Field label="Currency mask" for="showcase-input-currency" hint="Indian grouping with decimal guardrails.">
                    <Input
                      id="showcase-input-currency"
                      currency
                      value={currencyInputValue()}
                      onInput={(event) => {
                        setCurrencyInputValue(event.currentTarget.value);
                      }}
                    />
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
                    <Textarea
                      id="showcase-textarea-autogrow"
                      autoGrow
                      minRows={2}
                      maxRows={8}
                      value={textareaAutoGrowValue()}
                      onInput={(event) => {
                        setTextareaAutoGrowValue(event.currentTarget.value);
                      }}
                    />
                  </Field>
                </div>
                <Field label="Upload" for="showcase-upload" hint="Shows count of selected files; supports multiple.">
                  <Upload id="showcase-upload" multiple selectedFiles={uploadSelectedFiles()} onSelectedFilesChange={setUploadSelectedFiles} />
                </Field>
                <div class="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <ToggleGroup
                    name="showcase-toggle-digest"
                    selectionMode="multiple"
                    value={digestSelection()}
                    onChange={setDigestSelection}
                    options={[
                      {
                        label: "Receive weekly digest",
                        value: "weekly",
                        description: "One email every Monday with product updates and tips."
                      }
                    ]}
                  />
                  <ToggleGroup
                    name="showcase-toggle-digest-disabled"
                    selectionMode="multiple"
                    disabled
                    value={["weekly"]}
                    onChange={() => {}}
                    options={[
                      {
                        label: "Disabled option",
                        value: "weekly",
                        description: "You cannot change this option while the account is locked."
                      }
                    ]}
                  />
                </div>
                <div class="grid gap-6 lg:grid-cols-2">
                  <Field label="Shipping method" hint="Single selection; click the active option again to clear when allowNoSelection is on.">
                    <ToggleGroup
                      name="showcase-toggle-shipping"
                      selectionMode="single"
                      allowNoSelection
                      value={shippingMethod()}
                      onChange={setShippingMethod}
                      options={[
                        { label: "Standard (3–5 days)", value: "standard", description: "Best value for non-urgent orders." },
                        { label: "Express (1–2 days)", value: "express", description: "Faster delivery with tracking updates." },
                        { label: "Overnight", value: "overnight", description: "Arrives next business day when ordered before 2pm." }
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
                        { label: "Overnight", value: "overnight", description: "Arrives next business day when ordered before 2pm." }
                      ]}
                    />
                  </Field>
                </div>
                <Field label="Contact channels (labels only, no descriptions)">
                  <ToggleGroup
                    name="showcase-toggle-no-description"
                    selectionMode="multiple"
                    value={contactChannelsWithoutDescription()}
                    onChange={setContactChannelsWithoutDescription}
                    options={[
                      { label: "Email", value: "email" },
                      { label: "SMS", value: "sms" },
                      { label: "Push", value: "push" }
                    ]}
                  />
                </Field>
              </ShowcaseSection>
            </ShowcaseCategory>

            <ShowcaseCategory categoryTitle="Date picker">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-date-picker" sectionTitle="Date picker" sectionDescription="Single date or date range selection. Range mode sets the start to 12:00 AM and end to 11:59:59 PM automatically.">
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
                <div class="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                  <p class="text-xs font-semibold text-gray-600 dark:text-gray-400">Selected values</p>
                  <div class="mt-2 space-y-1 font-mono text-xs text-gray-700 dark:text-gray-300">
                    <p>
                      Single:{" "}
                      {createMemo(() => {
                        const v = singleDateValue();
                        return v.mode === "single" && v.date ? v.date.toISOString() : "—";
                      })()}
                    </p>
                    <p>
                      Range from:{" "}
                      {createMemo(() => {
                        const v = rangeDateValue();
                        return v.mode === "range" && v.from ? v.from.toISOString() : "—";
                      })()}
                    </p>
                    <p>
                      Range to:{" "}
                      {createMemo(() => {
                        const v = rangeDateValue();
                        return v.mode === "range" && v.to ? v.to.toISOString() : "—";
                      })()}
                    </p>
                  </div>
                </div>
              </ShowcaseSection>
            </ShowcaseCategory>

            <ShowcaseCategory categoryTitle="Navigation">
              <ShowcaseSection
                sectionHeadingIdentifier="showcase-heading-right-panel"
                sectionTitle="Right panel"
                sectionDescription="The main region and the right panel are siblings in a row: from the medium breakpoint up the main column reflows when the panel is open. Below the medium breakpoint the panel is a fixed full width overlay. Use the close control to play the exit transition."
              >
                <div class="flex flex-wrap items-center gap-3">
                  <Button
                    variant={isRightPanelOpen() ? "solid" : "outline"}
                    onClick={() => {
                      if (isRightPanelOpen()) {
                        return;
                      }
                      openRightPanel();
                    }}
                    disabled={isRightPanelOpen()}
                  >
                    {isRightPanelOpen() ? "Panel open" : "Open right panel"}
                  </Button>
                  <p class="min-w-0 text-sm text-gray-600 dark:text-gray-500">When the left sidebar is open on a phone, opening this panel closes the sidebar so the two full-width overlay layers do not stack.</p>
                </div>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-tabs" sectionTitle="Tabs">
                <Tabs tabDefinitions={tabDefinitions} activeTabValue={activeShowcaseTab} onTabSelect={setActiveShowcaseTab} />
                <BackgroundCard>
                  <div class="pt-6">
                    <p class="text-sm text-gray-700 dark:text-gray-300">{tabPanelCopy()}</p>
                  </div>
                </BackgroundCard>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-dropdowns" sectionTitle="Dropdowns" sectionDescription="Single-select options close on pick; multi-select keeps the menu open and marks each chosen item with a checkmark.">
                <div class="space-y-2">
                  <p class="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-500">Single select</p>
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
                        itemComponent={({ item }) => {
                          return <span class="font-semibold text-blue-700 dark:text-blue-200">{item.rawValue}</span>;
                        }}
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
                  </div>
                </div>
                <div class="space-y-2">
                  <p class="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-500">Multi select</p>
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
            </ShowcaseCategory>

            <ShowcaseCategory categoryTitle="Overlays and feedback">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-dialog-toast" sectionTitle="Dialog and toasts">
                <div class="flex flex-wrap gap-3">
                  <Button
                    onClick={() => {
                      setDialogOpen(true);
                    }}
                  >
                    Open dialog
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      addToast({ title: "Saved", description: "Workspace preferences were updated.", variant: "success" });
                    }}
                  >
                    Toast success
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      addToast({ title: "Payment failed", description: "The bank declined this charge.", variant: "danger" });
                    }}
                  >
                    Toast danger
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      addToast({ title: "Deprecation", description: "This endpoint will be removed next month.", variant: "warning" });
                    }}
                  >
                    Toast warning
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      addToast({ title: "Heads up", description: "Default styling for informational notices." });
                    }}
                  >
                    Toast default
                  </Button>
                </div>

                <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm destructive action</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      <DialogDescription>
                        Dialogs use the native &lt;dialog&gt; element: focus management, backdrop blur, and scroll locking built in. Footer actions keep equal minimum widths on wide breakpoints. On mobile, the dialog should fill the full viewport — no
                        strip at the bottom — with only this body area scrolling.
                      </DialogDescription>
                      <DialogDescription>This dialog intentionally has extra content to verify scroll behavior on mobile. The header and footer should remain fixed while this body scrolls independently.</DialogDescription>
                      <Field label="Workspace name" for="dialog-workspace-name">
                        <Input id="dialog-workspace-name" placeholder="e.g. my-workspace" />
                      </Field>
                      <Field label="Reason for deletion" for="dialog-reason">
                        <Textarea id="dialog-reason" placeholder="Briefly describe why this workspace is being deleted..." />
                      </Field>
                      <DialogDescription>
                        Once deleted, all data associated with this workspace will be permanently removed and cannot be recovered. This includes all projects, pipelines, datasets, and access configurations tied to this workspace.
                      </DialogDescription>
                      <DialogDescription>Make sure you have exported any data you need before proceeding. Billing will stop immediately upon deletion, and any active integrations will be disconnected.</DialogDescription>
                    </DialogBody>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setDialogOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="solid"
                        onClick={() => {
                          setDialogOpen(false);
                        }}
                      >
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  onClick={() => {
                    setDropdownDialogOpen(true);
                  }}
                >
                  Dialog with dropdowns
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setHeaderDropdownDialogOpen(true);
                  }}
                >
                  Dialog with header dropdown
                </Button>

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
                      <DialogDescription>The header dropdown should open left-aligned below the trigger, not in the middle of the screen.</DialogDescription>
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
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setDropdownDialogOpen(false);
                        }}
                      >
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </ShowcaseSection>
            </ShowcaseCategory>

            <footer class="mt-16 border-t border-gray-200 pt-8 text-center text-xs text-gray-600 dark:border-gray-800 dark:text-gray-500">
              <Show when={import.meta.env.DEV}>
                <p>
                  Launch the Showcase with <code class="rounded bg-gray-100 px-1 py-0.5 text-gray-800 dark:bg-gray-900 dark:text-gray-300">npm run development</code> from the repository root.
                </p>
              </Show>
            </footer>
          </div>
        </PageLayout>

        <Show when={isRightPanelOpen()}>
          <RightPanelLayout
            title="Right panel"
            subtitle="In flow with the main column on medium screens and up; fixed overlay on small viewports"
            onOpenChange={(isPanelOpen) => {
              if (!isPanelOpen) {
                setIsRightPanelOpen(false);
              }
            }}
            closeAriaLabel="Close right panel showcase"
          >
            <div class="space-y-3">
              <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Place order details, filters, or a creation form here. On medium screens and up the main column reflows beside this surface; on a narrow viewport it covers the full width.
              </p>
              <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">This panel scrolls independently from the main column so it can hold long forms without shifting the page.</p>
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
      <div class="flex items-center gap-4">
        <span class="h-px flex-1 bg-linear-to-r from-transparent via-gray-300 to-gray-300/30 dark:via-gray-700 dark:to-gray-700/30" aria-hidden />
        <h2 class="shrink-0 text-xs font-semibold tracking-[0.22em] text-gray-600 uppercase dark:text-gray-500">{properties.categoryTitle}</h2>
        <span class="h-px flex-1 bg-linear-to-l from-transparent via-gray-300 to-gray-300/30 dark:via-gray-700 dark:to-gray-700/30" aria-hidden />
      </div>
      <div class="space-y-10">{properties.children}</div>
    </section>
  );
};

const ShowcaseSection = (properties: ShowcaseSectionProperties): JSX.Element => {
  return (
    <div class="scroll-mt-28" aria-labelledby={properties.sectionHeadingIdentifier}>
      <BackgroundCard>
        <header class="space-y-2 border-b border-gray-200/80 pb-5 dark:border-gray-800/70">
          <SectionHeading id={properties.sectionHeadingIdentifier}>{properties.sectionTitle}</SectionHeading>
          <Show when={properties.sectionDescription}>
            <p class="max-w-3xl text-sm text-gray-600 dark:text-gray-500">{properties.sectionDescription}</p>
          </Show>
        </header>
        <div class="space-y-6 pt-6">{properties.children}</div>
      </BackgroundCard>
    </div>
  );
};
