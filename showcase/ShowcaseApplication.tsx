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
import { Link } from "@/components/link/Link";
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
import { CardToggleGroup } from "@/components/toggle-group/CardToggleGroup";
import { ToggleGroup } from "@/components/toggle-group/ToggleGroup";
import { Text, type TextColor, type TextSize, type TextWeight } from "@/components/typography/Text";
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

const textSizeScale: { size: TextSize; detail: string }[] = [
  { size: "display", detail: "36px · bold" },
  { size: "title", detail: "24px · semibold" },
  { size: "body", detail: "16px · normal · default" },
  { size: "small", detail: "14px · normal" },
  { size: "caption", detail: "12px · normal" }
];
const textColors: TextColor[] = ["default", "muted", "primary", "secondary", "success", "warning", "danger", "info"];
const textWeights: TextWeight[] = ["thin", "normal", "medium", "semibold", "bold"];
const linkColors: TextColor[] = ["primary", "secondary", "success", "warning", "danger", "info"];

const tableRows: { name: string; status: string; amount: string }[] = [
  { name: "North warehouse", status: "Active", amount: "₹12,450" },
  { name: "South warehouse", status: "Paused", amount: "₹8,120" },
  { name: "East hub", status: "Active", amount: "₹21,980" }
];

const tabDefinitions: readonly TabDefinition<ShowcaseTabValue>[] = [
  { tabValue: "overview", label: "Overview", tabElementIdentifier: "showcase-tab-overview", panelElementIdentifier: "showcase-panel-overview", icon: "dashboard" },
  { tabValue: "reports", label: "Reports", tabElementIdentifier: "showcase-tab-reports", panelElementIdentifier: "showcase-panel-reports", icon: "bar_chart" },
  { tabValue: "settings", label: "Settings", tabElementIdentifier: "showcase-tab-settings", panelElementIdentifier: "showcase-panel-settings", icon: "settings" }
];

export const ShowcaseApplication = (): JSX.Element => {
  const isMobileViewport = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = createSignal(isMobileViewport());

  const toggleSidebar = (): void => {
    setSidebarCollapsed((prev) => !prev);
  };
  const closeSidebar = (): void => {
    if (isMobileViewport()) setSidebarCollapsed(true);
  };

  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [scrollableDialogOpen, setScrollableDialogOpen] = createSignal(false);
  const [dropdownDialogOpen, setDropdownDialogOpen] = createSignal(false);
  const [dropdownDialogValue, setDropdownDialogValue] = createSignal<string | undefined>("Cherry");
  const [headerDropdownDialogOpen, setHeaderDropdownDialogOpen] = createSignal(false);
  const [headerDropdownDialogView, setHeaderDropdownDialogView] = createSignal("Details");
  const [datePickerDialogValue, setDatePickerDialogValue] = createSignal<DatePickerValue>({ mode: "single", date: undefined });

  const [singleDateValue, setSingleDateValue] = createSignal<DatePickerValue>({ mode: "single", date: undefined });
  const [rangeDateValue, setRangeDateValue] = createSignal<DatePickerValue>({ mode: "range", from: undefined, to: undefined });

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
  const [uploadProgress, setUploadProgress] = createSignal<Record<string, number>>({});

  const [digestSelection, setDigestSelection] = createSignal<string[]>(["weekly"]);
  const [shippingMethod, setShippingMethod] = createSignal<string | undefined>("standard");
  const [contactChannels, setContactChannels] = createSignal<string[]>(["email"]);
  const [cardPlanSelection, setCardPlanSelection] = createSignal<string | undefined>("pro");
  const [cardFeatureSelection, setCardFeatureSelection] = createSignal<string[]>(["analytics"]);

  const [activeShowcaseTab, setActiveShowcaseTab] = createSignal<ShowcaseTabValue>("overview");
  const [tablePagination, setTablePagination] = createSignal<{ limit: number; offset: number }>({ limit: 25, offset: 0 });
  const [isRightPanelOpen, setIsRightPanelOpen] = createSignal(false);

  const [documentColorSchemeName, setDocumentColorSchemeName] = createDocumentColorSchemePreferenceSignal();

  const openRightPanel = (): void => {
    if (isMobileViewport()) setSidebarCollapsed(true);
    setIsRightPanelOpen(true);
  };

  const dropdownOptions = (): string[] => ["Apple", "Banana", "Cherry", "Date", "Elderberry"];
  const cityOptions = (): string[] => ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Kolkata"];
  const numericOptions = (): string[] => ["One", "Two", "Three"];

  const tabPanelCopy = createMemo(() => {
    switch (activeShowcaseTab()) {
      case "overview":
        return "Overview panel — summary metrics and alerts.";
      case "reports":
        return "Reports panel — exports and scheduled deliveries.";
      case "settings":
        return "Settings panel — workspace preferences.";
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
              <Text as="h1" size="title">
                Solid Kit
              </Text>
            </div>
          }
        >
          <div class="flex items-center gap-1">
            <IconButton variant={documentColorSchemeName() === "light" ? "solid" : "ghost"} icon="light_mode" aria-label="Light mode" onClick={() => setDocumentColorSchemeName("light")} />
            <IconButton variant={documentColorSchemeName() === "dark" ? "solid" : "ghost"} icon="dark_mode" aria-label="Dark mode" onClick={() => setDocumentColorSchemeName("dark")} />
          </div>
        </HeaderLayout>

        <LeftPanelLayout
          collapsed={sidebarCollapsed()}
          onOpenChange={(isPanelOpen) => {
            if (!isPanelOpen) closeSidebar();
          }}
          navigationDocument={showcaseLeftPanelNavigationDocument}
          anchorTag="a"
        />

        <PageLayout>
          <div class="mx-auto max-w-5xl space-y-16">
            {/* Primitives */}
            <ShowcaseCategory categoryTitle="Primitives">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-badges" sectionTitle="Badges" sectionDescription="Solid and outline variants across all semantic colors. Supports a leading icon and a removable chip.">
                <div class="space-y-4">
                  <For each={badgeVariants}>
                    {(variant) => (
                      <div class="space-y-2">
                        <Text size="caption" weight="semibold" color="muted">
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

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-buttons" sectionTitle="Buttons and icon buttons" sectionDescription="Solid, outline, and ghost variants with optional icons.">
                <div class="space-y-4">
                  <div class="flex flex-wrap gap-3">
                    <Button variant="solid">Solid</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
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
                    <IconButton variant="solid" icon="check_circle" aria-label="Solid" />
                    <IconButton variant="outline" icon="settings" aria-label="Outline" />
                    <IconButton variant="ghost" icon="more_vert" aria-label="Ghost" />
                    <IconButton variant="solid" icon="settings" aria-label="Disabled" disabled />
                  </div>
                </div>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-icons" sectionTitle="Icons" sectionDescription="Material Symbols (rounded, filled). Pass the slug as name, plus an optional size or color.">
                <div class="flex flex-wrap items-end gap-6">
                  <div class="flex flex-col items-center gap-2">
                    <Icon name="account_balance_wallet" size={32} />
                    <Text size="caption" color="muted">
                      size 32
                    </Text>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <Icon name="notifications" size={28} />
                    <Text size="caption" color="muted">
                      size 28
                    </Text>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <Icon name="settings" size={24} />
                    <Text size="caption" color="muted">
                      size 24
                    </Text>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <Icon name="settings" size={16} />
                    <Text size="caption" color="muted">
                      size 16
                    </Text>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <Icon name="check_circle" size={28} color="success" />
                    <Text size="caption" color="muted">
                      success
                    </Text>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <Icon name="warning" size={28} color="warning" />
                    <Text size="caption" color="muted">
                      warning
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

            {/* Typography and layout */}
            <ShowcaseCategory categoryTitle="Typography and layout">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-text" sectionTitle="Text" sectionDescription="The primitive for all text. Pick a size by name; weight, color, and icons are props.">
                <div class="space-y-6">
                  <ShowcaseEyebrow label="Sizes" />
                  <div class="space-y-2">
                    <For each={textSizeScale}>
                      {(step) => (
                        <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <Text size={step.size}>{step.size}</Text>
                          <Text size="caption" color="muted">
                            {step.detail}
                          </Text>
                        </div>
                      )}
                    </For>
                  </div>

                  <Divider />

                  <ShowcaseEyebrow label="Colors" />
                  <div class="flex flex-wrap gap-x-4 gap-y-1">
                    <For each={textColors}>{(c) => <Text color={c}>{c}</Text>}</For>
                  </div>

                  <ShowcaseEyebrow label="Weights" />
                  <div class="flex flex-wrap gap-x-4 gap-y-1">
                    <For each={textWeights}>{(w) => <Text weight={w}>{w}</Text>}</For>
                  </div>

                  <ShowcaseEyebrow label="Icons" />
                  <div class="flex flex-wrap gap-4">
                    <Text icon="check_circle" color="success" weight="semibold">
                      Leading
                    </Text>
                    <Text icon="arrow_forward" iconPosition="end" color="primary">
                      Trailing
                    </Text>
                    <Text icon={<span class="inline-block h-[1em] w-[1em] rounded-full bg-emerald-500" />} color="success">
                      JSX element
                    </Text>
                  </div>
                </div>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-divider" sectionTitle="Divider and SectionHeading" sectionDescription="Separate regions and label subsections.">
                <div class="space-y-4">
                  <SectionHeading>Section heading</SectionHeading>
                  <Text color="muted">Body text below the heading.</Text>
                  <Divider />
                  <SectionHeading>Another section</SectionHeading>
                  <Text color="muted">A divider separates the two regions.</Text>
                </div>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-link" sectionTitle="Link" sectionDescription="Text that links. Same size/color/weight/icon props; no underline. Shown with anchorTag='a' (no router here).">
                <div class="space-y-6">
                  <Text color="muted">
                    Inline links flow within copy — see the{" "}
                    <Link anchorTag="a" href="#showcase-heading-text">
                      Text section
                    </Link>{" "}
                    for the shared props, or the{" "}
                    <Link anchorTag="a" href="#showcase-heading-metrics">
                      metric cards
                    </Link>{" "}
                    for a footer link.
                  </Text>

                  <ShowcaseEyebrow label="Colors" />
                  <div class="flex flex-wrap gap-x-4 gap-y-1">
                    <For each={linkColors}>
                      {(c) => (
                        <Link anchorTag="a" href="#showcase-heading-link" color={c}>
                          {c}
                        </Link>
                      )}
                    </For>
                  </div>

                  <ShowcaseEyebrow label="With icons" />
                  <div class="flex flex-wrap gap-4">
                    <Link anchorTag="a" href="#showcase-heading-link" weight="medium" icon="arrow_forward" iconPosition="end">
                      View report
                    </Link>
                    <Link anchorTag="a" href="https://example.com" target="_blank" rel="noreferrer" color="info" icon="north_east" iconPosition="end">
                      External link
                    </Link>
                  </div>
                </div>
              </ShowcaseSection>
            </ShowcaseCategory>

            {/* Data surfaces */}
            <ShowcaseCategory categoryTitle="Data surfaces">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-metrics" sectionTitle="Metric cards" sectionDescription="Accent color, icon, value, and an optional footer link. The last card is in its loading state.">
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <MetricCard title="Gross volume" accent="emerald" icon="account_balance_wallet" value="₹4.2M" linkHref="#" linkLabel="View settlements" anchorTag="a" />
                  <MetricCard title="Active users" accent="blue" icon="dashboard" value="1,284" />
                  <MetricCard title="Risk score" accent="amber" icon="tag" value="Medium" />
                  <MetricCard title="Automation" accent="violet" icon="settings" value="Running" />
                  <MetricCard title="Incidents" accent="rose" icon="check_circle" value="0 open" />
                  <MetricCard title="Revenue" accent="emerald" icon="currency_rupee" value="—" loading />
                </div>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-background-card" sectionTitle="BackgroundCard" sectionDescription="Fixed-style card shell. Compose your own header, body, and footer content inside.">
                <BackgroundCard>
                  <div class="space-y-4">
                    <div class="space-y-1">
                      <Text size="title">Workspace usage</Text>
                      <Text color="muted">Pair with Metric cards for dashboard layouts.</Text>
                    </div>
                    <Text color="muted">Use multiple BackgroundCards per page to group related information.</Text>
                    <div class="flex justify-end gap-2">
                      <Button variant="ghost">Dismiss</Button>
                      <Button>Save layout</Button>
                    </div>
                  </div>
                </BackgroundCard>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-data-card" sectionTitle="DataCard" sectionDescription="Data surface — clickable or static. For selectable cards, use CardToggleGroup.">
                <div class="grid gap-3 sm:grid-cols-3">
                  <DataCard clickable onClick={() => addToast({ title: "North warehouse", description: "Card click handled.", variant: "default" })}>
                    <div class="space-y-1">
                      <Text size="small" weight="semibold">
                        North warehouse
                      </Text>
                      <Text size="caption" color="muted">
                        Active · ₹12,450
                      </Text>
                    </div>
                  </DataCard>
                  <DataCard clickable onClick={() => addToast({ title: "South warehouse", description: "Card click handled.", variant: "default" })}>
                    <div class="space-y-1">
                      <Text size="small" weight="semibold">
                        South warehouse
                      </Text>
                      <Text size="caption" color="muted">
                        Paused · ₹8,120
                      </Text>
                    </div>
                  </DataCard>
                  <DataCard>
                    <div class="space-y-1">
                      <Text size="small" weight="semibold">
                        Static card
                      </Text>
                      <Text size="caption" color="muted">
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

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-table" sectionTitle="Table and pagination" sectionDescription="Compound component with a scrollable container and paginator. Clickable rows support keyboard activation.">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Text size="caption" weight="semibold">
                          Location
                        </Text>
                      </TableHead>
                      <TableHead>
                        <Text size="caption" weight="semibold">
                          Status
                        </Text>
                      </TableHead>
                      <TableHead align="right" monospace>
                        <Text size="caption" weight="semibold">
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
                            <Text size="small">{row.name}</Text>
                          </TableCell>
                          <TableCell>
                            <Badge variant="solid" color={row.status === "Active" ? "success" : "warning"}>
                              {row.status}
                            </Badge>
                          </TableCell>
                          <TableCell align="right" monospace>
                            <Text size="small">{row.amount}</Text>
                          </TableCell>
                        </TableRow>
                      )}
                    </For>
                    <TableRow verticalAlign="top">
                      <TableCell>
                        <Text size="small">Notes row (top aligned)</Text>
                      </TableCell>
                      <TableCell colSpan={2}>
                        <Text size="small" color="muted">
                          Use verticalAlign="top" when a row mixes chips with multi-line copy.
                        </Text>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TablePagination limit={tablePagination().limit} offset={tablePagination().offset} currentPageCount={tableRows.length} totalCount={120} onChange={setTablePagination} />
                </Table>
              </ShowcaseSection>
            </ShowcaseCategory>

            {/* Forms and selection */}
            <ShowcaseCategory categoryTitle="Forms and selection">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-forms" sectionTitle="Fields, input, textarea, upload" sectionDescription="Single controls wrapped in Field for accessible labels and hint text.">
                <div class="grid gap-6 lg:grid-cols-2">
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
                <div class="grid gap-6 lg:grid-cols-2">
                  <Field label="Textarea resize" for="showcase-textarea-resize" hint="Resize policy is explicit per instance.">
                    <Textarea id="showcase-textarea-resize" rows={4} resize="vertical" placeholder="Resize vertically…" />
                  </Field>
                  <Field label="Textarea auto-grow" for="showcase-textarea-autogrow" hint="Height clamps between minRows and maxRows.">
                    <Textarea id="showcase-textarea-autogrow" autoGrow minRows={2} maxRows={8} value={textareaAutoGrowValue()} onInput={(e) => setTextareaAutoGrowValue(e.currentTarget.value)} />
                  </Field>
                </div>
                <Field label="Upload" for="showcase-upload" hint="Drop files or click. Image files show a thumbnail. PDFs and CSVs up to 5 MB.">
                  <Upload
                    id="showcase-upload"
                    multiple
                    accept=".pdf,.csv,image/*"
                    maxSizeBytes={5 * 1024 * 1024}
                    selectedFiles={uploadSelectedFiles()}
                    onSelectedFilesChange={(files) => {
                      setUploadSelectedFiles(files);
                      setUploadProgress((previous) => {
                        const activeKeys = new Set(files.map((file) => `${file.name}:${file.size.toString()}`));
                        const next: Record<string, number> = {};
                        for (const [key, value] of Object.entries(previous)) {
                          if (activeKeys.has(key)) next[key] = value;
                        }
                        for (const file of files) {
                          const key = `${file.name}:${file.size.toString()}`;
                          if (!(key in next)) {
                            next[key] = 0;
                            const tick = (): void => {
                              setUploadProgress((current) => {
                                const value = current[key];
                                if (value === undefined || value >= 100) return current;
                                const incremented = Math.min(100, value + 20);
                                if (incremented < 100) window.setTimeout(tick, 400);
                                return { ...current, [key]: incremented };
                              });
                            };
                            window.setTimeout(tick, 200);
                          }
                        }
                        return next;
                      });
                    }}
                    onReject={(rejectedFiles, reason) => {
                      const titleByReason: Record<typeof reason, string> = {
                        accept: "Wrong file type",
                        maxSize: "File too large",
                        multiple: "Only one file allowed"
                      };
                      addToast({
                        title: titleByReason[reason],
                        description: rejectedFiles.map((file) => file.name).join(", "),
                        variant: "warning"
                      });
                    }}
                    progressByFile={uploadProgress()}
                  />
                </Field>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-date-picker" sectionTitle="Date picker" sectionDescription="Single date or range selection.">
                <div class="grid gap-6 lg:grid-cols-2">
                  <Field label="Single date" for="showcase-date-picker-single" hint="Pick one calendar day.">
                    <DatePicker id="showcase-date-picker-single" mode="single" value={singleDateValue()} onChange={setSingleDateValue} placeholder="Select a date" />
                  </Field>
                  <Field label="Date range" for="showcase-date-picker-range" hint="First click sets start (12:00 AM), second sets end (11:59:59 PM).">
                    <DatePicker id="showcase-date-picker-range" mode="range" value={rangeDateValue()} onChange={setRangeDateValue} placeholder="Select date range" />
                  </Field>
                  <Field label="Disabled" for="showcase-date-picker-disabled">
                    <DatePicker id="showcase-date-picker-disabled" mode="single" disabled placeholder="Unavailable" />
                  </Field>
                </div>
                <BackgroundCard>
                  <div class="space-y-2">
                    <Text size="caption" weight="semibold">
                      Selected values
                    </Text>
                    <div class="space-y-1">
                      <Text size="caption">
                        Single:{" "}
                        {createMemo(() => {
                          const v = singleDateValue();
                          return v.mode === "single" && v.date ? v.date.toISOString() : "—";
                        })()}
                      </Text>
                      <Text size="caption">
                        Range from:{" "}
                        {createMemo(() => {
                          const v = rangeDateValue();
                          return v.mode === "range" && v.from ? v.from.toISOString() : "—";
                        })()}
                      </Text>
                      <Text size="caption">
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

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-toggle-group" sectionTitle="Toggle group" sectionDescription="Native radio (single) or checkbox (multiple) inputs with labels and optional descriptions.">
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
                  <Field label="Shipping method — single">
                    <ToggleGroup
                      name="showcase-toggle-shipping"
                      selectionMode="single"
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
                <Field label="Contact channels — labels only, no descriptions">
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

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-card-toggle-group" sectionTitle="Card toggle group" sectionDescription="ToggleGroup's option model, rendered as selectable cards.">
                <div class="grid gap-6 lg:grid-cols-2">
                  <Field label="Plan — single">
                    <CardToggleGroup
                      name="showcase-card-toggle-plan"
                      selectionMode="single"
                      value={cardPlanSelection()}
                      onChange={setCardPlanSelection}
                      options={[
                        { label: "Starter", value: "starter", description: "Up to 5 users and basic reports." },
                        { label: "Pro", value: "pro", description: "Unlimited users, advanced analytics, priority support." },
                        { label: "Enterprise", value: "enterprise", description: "Custom contracts, SSO, dedicated success manager." }
                      ]}
                    />
                  </Field>
                  <Field label="Features — multiple">
                    <CardToggleGroup
                      name="showcase-card-toggle-features"
                      selectionMode="multiple"
                      value={cardFeatureSelection()}
                      onChange={setCardFeatureSelection}
                      options={[
                        { label: "Analytics", value: "analytics", description: "Daily traffic and conversion dashboards." },
                        { label: "Automations", value: "automations", description: "Trigger workflows from any event." },
                        { label: "Integrations", value: "integrations", description: "Connect Slack, Stripe, and more.", disabled: true }
                      ]}
                    />
                  </Field>
                </div>
                <Field label="Disabled group">
                  <CardToggleGroup
                    name="showcase-card-toggle-disabled"
                    selectionMode="single"
                    value="pro"
                    disabled
                    onChange={() => {}}
                    options={[
                      { label: "Starter", value: "starter", description: "Up to 5 users and basic reports." },
                      { label: "Pro", value: "pro", description: "Unlimited users, advanced analytics, priority support." }
                    ]}
                  />
                </Field>
              </ShowcaseSection>
            </ShowcaseCategory>

            {/* Navigation */}
            <ShowcaseCategory categoryTitle="Navigation">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-tabs" sectionTitle="Tabs" sectionDescription="Accessible tab bar with ARIA roles and underline indicator.">
                <Tabs tabDefinitions={tabDefinitions} activeTabValue={activeShowcaseTab} onTabSelect={setActiveShowcaseTab} />
                <BackgroundCard>
                  <Text color="muted">{tabPanelCopy()}</Text>
                </BackgroundCard>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-dropdowns" sectionTitle="Dropdowns" sectionDescription="Single-select closes on pick. Multi-select keeps the menu open and marks each chosen item with a checkmark.">
                <div class="space-y-4">
                  <SectionHeading>Single select</SectionHeading>
                  <div class="grid gap-6 md:grid-cols-2">
                    <Field label="Basic" for="showcase-dropdown-basic">
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
                    <Field label="Disabled" for="showcase-dropdown-disabled">
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
                              <Text size="small" weight="medium">
                                Jane Smith
                              </Text>
                              <Text size="caption" color="muted">
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
                    <Field label="Leading icon" for="showcase-dropdown-item-icon-start">
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
                        <DropdownIconTrigger id="showcase-dropdown-item-icon-disabled" icon="more_vert" aria-label="Actions menu" />
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
                  </div>
                </div>

                <div class="space-y-4">
                  <SectionHeading>Multi select</SectionHeading>
                  <div class="grid gap-6 md:grid-cols-2">
                    <Field label="Fruits" for="showcase-dropdown-multi" hint="Menu stays open; selected items are checked.">
                      <Dropdown options={dropdownOptions()} multiSelect multiSelectValue={multiSelectDropdownValues()} onMultiSelectChange={setMultiSelectDropdownValues}>
                        <DropdownTrigger id="showcase-dropdown-multi">
                          <DropdownValue>{multiSelectDropdownValues().length > 0 ? multiSelectDropdownValues().join(", ") : "Select fruits"}</DropdownValue>
                        </DropdownTrigger>
                      </Dropdown>
                    </Field>
                    <Field label="Cities (searchable)" for="showcase-dropdown-multi-search">
                      <Dropdown options={cityOptions()} multiSelect searchable multiSelectValue={multiSelectCityValues()} onMultiSelectChange={setMultiSelectCityValues}>
                        <DropdownTrigger id="showcase-dropdown-multi-search">
                          <DropdownValue>{multiSelectCityValues().length > 0 ? multiSelectCityValues().join(", ") : "Select cities"}</DropdownValue>
                        </DropdownTrigger>
                      </Dropdown>
                    </Field>
                  </div>
                </div>
              </ShowcaseSection>

              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-right-panel" sectionTitle="Right panel" sectionDescription="Reflows beside the main column on desktop; a full-width overlay on mobile.">
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
                  <Text size="small" color="muted">
                    Opening on mobile while the sidebar is visible will close the sidebar automatically.
                  </Text>
                </div>
              </ShowcaseSection>
            </ShowcaseCategory>

            {/* Overlays and feedback */}
            <ShowcaseCategory categoryTitle="Overlays and feedback">
              <ShowcaseSection sectionHeadingIdentifier="showcase-heading-dialog" sectionTitle="Dialog" sectionDescription="Native dialog element — focus management, backdrop, and scroll locking built in.">
                <div class="flex flex-wrap gap-3">
                  <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
                  <Button variant="outline" onClick={() => setScrollableDialogOpen(true)}>
                    With scrolling body
                  </Button>
                  <Button variant="outline" onClick={() => setDropdownDialogOpen(true)}>
                    With dropdowns
                  </Button>
                  <Button variant="outline" onClick={() => setHeaderDropdownDialogOpen(true)}>
                    With header dropdown
                  </Button>
                </div>

                <Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm destructive action</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      <DialogDescription>Footer actions keep equal minimum widths on wide breakpoints. On mobile the header and footer stay fixed while this body scrolls.</DialogDescription>
                      <Field label="Workspace name" for="dialog-workspace-name">
                        <Input id="dialog-workspace-name" placeholder="e.g. my-workspace" />
                      </Field>
                      <Field label="Reason for deletion" for="dialog-reason">
                        <Textarea id="dialog-reason" placeholder="Briefly describe why this workspace is being deleted…" />
                      </Field>
                      <DialogDescription>Once deleted, all data will be permanently removed and billing will stop immediately.</DialogDescription>
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

                <Dialog open={scrollableDialogOpen()} onOpenChange={setScrollableDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Terms of service</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      <DialogDescription>The header and footer stay fixed while this body scrolls. On mobile, swipe the header down to dismiss or up for full height.</DialogDescription>
                      <For
                        each={[
                          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
                          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
                          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae.",
                          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est.",
                          "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.",
                          "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.",
                          "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur.",
                          "On a mobile viewport this body scrolls independently while the header above and the footer below remain pinned, so the action buttons are always reachable no matter how long the content grows."
                        ]}
                      >
                        {(paragraph) => <DialogDescription>{paragraph}</DialogDescription>}
                      </For>
                    </DialogBody>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setScrollableDialogOpen(false)}>
                        Decline
                      </Button>
                      <Button variant="solid" onClick={() => setScrollableDialogOpen(false)}>
                        Accept
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
                    Success
                  </Button>
                  <Button variant="outline" onClick={() => addToast({ title: "Payment failed", description: "The bank declined this charge.", variant: "danger" })}>
                    Danger
                  </Button>
                  <Button variant="outline" onClick={() => addToast({ title: "Deprecation", description: "This endpoint will be removed next month.", variant: "warning" })}>
                    Warning
                  </Button>
                  <Button variant="outline" onClick={() => addToast({ title: "Heads up", description: "Default styling for informational notices." })}>
                    Default
                  </Button>
                </div>
              </ShowcaseSection>
            </ShowcaseCategory>
          </div>
        </PageLayout>

        <Show when={isRightPanelOpen()}>
          <RightPanelLayout
            title="Right panel"
            subtitle="In flow with the main column on medium screens and up; fixed overlay on small viewports"
            onOpenChange={(isPanelOpen) => {
              if (!isPanelOpen) setIsRightPanelOpen(false);
            }}
            closeAriaLabel="Close right panel"
          >
            <div class="space-y-3">
              <Text color="muted">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rhoncus, elit non tincidunt tincidunt, quam eros sodales mauris, ut auctor nulla neque sed turpis. Aliquam erat volutpat. Praesent consectetur dignissim lorem eget tempus.
                Phasellus sit amet sagittis erat. Nunc sagittis dignissim volutpat. Sed vulputate mollis suscipit. Ut id vestibulum nulla, a mattis justo. Donec nec accumsan mi, quis vehicula nisl. Phasellus maximus tortor sagittis, rutrum purus vel,
                dapibus odio. Proin sed bibendum ante, sed fermentum nunc. Cras placerat pellentesque tortor id tincidunt. Fusce mi turpis, pulvinar sagittis tortor nec, fermentum venenatis ex. Mauris metus dui, vehicula eu dictum et, condimentum nec nunc.
                Maecenas quis dolor sit amet ex scelerisque ultricies. Sed convallis vehicula dolor in dapibus. Sed consequat egestas tortor nec posuere. Vestibulum lobortis mattis enim non luctus. Suspendisse potenti. Aliquam non sagittis quam. Donec arcu
                dui, tristique ut vestibulum quis, eleifend mollis magna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean luctus varius nibh, sit amet feugiat tortor. Phasellus feugiat bibendum commodo. Nulla
                a posuere mauris. Maecenas hendrerit dignissim ex. Integer euismod ipsum dapibus neque tincidunt bibendum. Sed eu est euismod, posuere eros non, dictum nulla. Aliquam auctor sodales diam. Proin egestas, arcu sed pellentesque blandit, ipsum
                enim venenatis eros, tempor consequat velit urna eget leo. Vestibulum in orci ac eros elementum porta quis ac purus. Donec ac tincidunt est. Sed quis mi feugiat tellus finibus sodales. Etiam pretium mattis arcu, cursus auctor eros viverra
                dapibus. Mauris a cursus massa. Vivamus sodales in lectus id ullamcorper. Morbi urna est, auctor tempus iaculis nec, fermentum convallis ante. Nullam elementum nisl non quam venenatis pharetra. Sed ornare quam et mi commodo tincidunt.
                Aliquam vitae consectetur massa, sed aliquet libero. Curabitur blandit eros in euismod eleifend. Etiam cursus, leo vel commodo bibendum, diam purus venenatis nulla, et tempor ipsum leo in felis. Pellentesque cursus volutpat pellentesque. Ut
                lacinia sem ex, nec finibus quam tincidunt eget. Vivamus ac vulputate sapien, vitae molestie ex. Phasellus tempus purus nec ipsum iaculis consequat. Mauris et ante commodo, volutpat lacus et, dapibus mi. Sed sit amet enim vitae odio laoreet
                congue non sed felis. In at nisl convallis, sagittis purus nec, viverra risus. Nullam in enim eu nulla dapibus interdum sit amet nec dolor. In ut ornare dui. Donec gravida ultrices sem, quis vehicula tellus pulvinar at. Nullam vitae
                pulvinar ex, vitae blandit massa. Nulla fringilla dolor eu sapien tempus commodo. Sed sed lorem vel tellus fringilla pretium et vitae lectus. Integer ut tincidunt ipsum, id sodales ligula. Nam tempus diam sed lorem ullamcorper dictum. Nunc
                molestie at massa ac interdum. Sed fringilla, erat ac tincidunt sagittis, odio nisl elementum nisl, sed tincidunt lorem tortor eu lectus. Praesent justo nisi, condimentum eu metus vel, ultricies consequat sapien. Sed lacinia condimentum
                odio, et ultricies mauris. Proin mattis lorem eros, vel lobortis purus volutpat vel. Maecenas interdum nisl non augue ultricies convallis. Proin dictum sit amet mauris vitae egestas.
              </Text>
              <Text color="muted">This panel scrolls independently from the main column.</Text>
            </div>
          </RightPanelLayout>
        </Show>
      </MainLayout>
    </div>
  );
};

const ShowcaseEyebrow = (properties: { label: string }): JSX.Element => {
  return (
    <Text size="caption" weight="semibold" color="muted" transform="uppercase">
      {properties.label}
    </Text>
  );
};

const ShowcaseCategory = (properties: ShowcaseCategoryProperties): JSX.Element => {
  return (
    <section class="space-y-10" aria-label={properties.categoryTitle}>
      <div class="space-y-3">
        <Text as="h2" size="title">
          {properties.categoryTitle}
        </Text>
        <Divider />
      </div>
      <div class="space-y-8">{properties.children}</div>
    </section>
  );
};

const ShowcaseSection = (properties: ShowcaseSectionProperties): JSX.Element => {
  return (
    <div class="scroll-mt-20" aria-labelledby={properties.sectionHeadingIdentifier}>
      <BackgroundCard>
        <header class="space-y-1.5 pb-5">
          <SectionHeading id={properties.sectionHeadingIdentifier}>{properties.sectionTitle}</SectionHeading>
          <Show when={properties.sectionDescription}>
            <Text size="small" color="muted">
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
