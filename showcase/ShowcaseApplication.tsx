import type { BadgeVariant } from "@/components/badge/Badge";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/card/Card";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/dialog/Dialog";
import { Dropdown, DropdownIconTrigger, DropdownTrigger, DropdownValue } from "@/components/dropdown/Dropdown";
import { EmptyState } from "@/components/empty-state/EmptyState";
import { Field } from "@/components/field/Field";
import { Heading } from "@/components/heading/Heading";
import { IconButton } from "@/components/icon-button/IconButton";
import { calendarDays, checkCircle, darkMode, dashboard, ellipsisVertical, inventory, lightMode, pencil, search, settings, tag, wallet } from "@/components/icons/Icons";
import { Input } from "@/components/input/Input";
import { Loading } from "@/components/loading/Loading";
import { Metric } from "@/components/metric/Metric";
import { Spinner } from "@/components/spinner/Spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TablePagination, TableRow } from "@/components/table/Table";
import type { TabDefinition } from "@/components/tabs/Tabs";
import { Tabs } from "@/components/tabs/Tabs";
import { Textarea } from "@/components/textarea/Textarea";
import { addToast } from "@/components/toast/Toast";
import { Toaster } from "@/components/toast/Toaster";
import { ToggleGroup } from "@/components/toggle-group/ToggleGroup";
import { Upload } from "@/components/upload/Upload";
import { type Color, createDocumentColorSchemePreferenceSignal } from "@/utilities";
import type { JSX } from "solid-js";
import { For, Show, createMemo, createSignal } from "solid-js";

type ShowcaseTabValue = "overview" | "reports" | "settings";

type ShowcaseNavigationEntry = {
  anchorIdentifier: string;
  navigationLabel: string;
};

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

const badgeVariants: BadgeVariant[] = ["prominent", "subtle", "ghost"];

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
    icon: dashboard
  },
  {
    tabValue: "reports",
    label: "Reports",
    tabElementIdentifier: "showcase-tab-reports",
    panelElementIdentifier: "showcase-panel-reports",
    icon: calendarDays
  },
  {
    tabValue: "settings",
    label: "Settings",
    tabElementIdentifier: "showcase-tab-settings",
    panelElementIdentifier: "showcase-panel-settings",
    icon: settings
  }
];

const showcaseNavigationEntries: readonly ShowcaseNavigationEntry[] = [
  { anchorIdentifier: "showcase-heading-badges", navigationLabel: "Badges" },
  { anchorIdentifier: "showcase-heading-buttons", navigationLabel: "Buttons" },
  { anchorIdentifier: "showcase-heading-spinner-loading", navigationLabel: "Spinner and loading" },
  { anchorIdentifier: "showcase-heading-metrics", navigationLabel: "Metric cards" },
  { anchorIdentifier: "showcase-heading-card-empty", navigationLabel: "Card and empty state" },
  { anchorIdentifier: "showcase-heading-forms", navigationLabel: "Fields and inputs" },
  { anchorIdentifier: "showcase-heading-tabs", navigationLabel: "Tabs" },
  { anchorIdentifier: "showcase-heading-dropdowns", navigationLabel: "Dropdowns" },
  { anchorIdentifier: "showcase-heading-table", navigationLabel: "Table" },
  { anchorIdentifier: "showcase-heading-dialog-toast", navigationLabel: "Dialog and toasts" }
];

/**
 * Runnable Showcase page that exercises solid-kit components, variants, and common control states.
 */
export const ShowcaseApplication = (): JSX.Element => {
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [digestSelection, setDigestSelection] = createSignal<string[]>(["weekly"]);
  const [dropdownValue, setDropdownValue] = createSignal<string | undefined>("Cherry");
  const [itemizedDropdownValue, setItemizedDropdownValue] = createSignal<string | undefined>("Banana");
  const [searchableDropdownValue, setSearchableDropdownValue] = createSignal<string | undefined>("Mumbai");
  const [portalDropdownValue, setPortalDropdownValue] = createSignal<string | undefined>("Alpha");
  const [iconTriggerDropdownValue, setIconTriggerDropdownValue] = createSignal<string | undefined>("Two");
  const [currencyInputValue, setCurrencyInputValue] = createSignal("1234567.50");
  const [plainInputValue, setPlainInputValue] = createSignal("Solid Kit");
  const [textareaAutoGrowValue, setTextareaAutoGrowValue] = createSignal("Type multiple lines to watch auto-grow clamp between min and max rows.");
  const [uploadSelectedFiles, setUploadSelectedFiles] = createSignal<File[]>([]);
  const [activeShowcaseTab, setActiveShowcaseTab] = createSignal<ShowcaseTabValue>("overview");
  const [tablePagination, setTablePagination] = createSignal<{ limit: number; offset: number }>({ limit: 25, offset: 0 });
  const [shippingMethod, setShippingMethod] = createSignal<string | undefined>("standard");
  const [contactChannelsWithoutDescription, setContactChannelsWithoutDescription] = createSignal<string[]>(["email"]);
  const [documentColorSchemeName, setDocumentColorSchemeName] = createDocumentColorSchemePreferenceSignal();

  const dropdownOptions = (): string[] => {
    return ["Apple", "Banana", "Cherry", "Date", "Elderberry"];
  };

  const cityOptions = (): string[] => {
    return ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Kolkata"];
  };

  const portalOptions = (): string[] => {
    return ["Alpha", "Beta", "Gamma", "Delta"];
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

  return (
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Toaster />

      <header class="flex flex-col gap-6 border-b border-gray-200 pb-8 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Solid Kit showcase</h1>
          <p class="max-w-2xl text-sm text-gray-600 dark:text-gray-400">Interactive samples for buttons, forms, data surfaces, and overlays. Toggle the document color scheme to preview light and dark styling.</p>
        </div>
        <div class="flex shrink-0 items-center gap-1 rounded-full border border-gray-200 bg-gray-100/80 p-1 dark:border-gray-700 dark:bg-gray-900/60">
          <IconButton
            variant={documentColorSchemeName() === "light" ? "default" : "ghost"}
            icon={lightMode}
            aria-label="Use light color scheme"
            onClick={() => {
              setDocumentColorSchemeName("light");
            }}
          />
          <IconButton
            variant={documentColorSchemeName() === "dark" ? "default" : "ghost"}
            icon={darkMode}
            aria-label="Use dark color scheme"
            onClick={() => {
              setDocumentColorSchemeName("dark");
            }}
          />
        </div>
      </header>

      <nav class="mt-10 rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-sm ring-1 ring-black/5 sm:p-6 dark:border-gray-800/90 dark:bg-gray-950/40 dark:shadow-none dark:ring-white/4" aria-label="Showcase sections">
        <p class="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-500">On this page</p>
        <ul class="mt-4 flex flex-wrap gap-2">
          <For each={showcaseNavigationEntries}>
            {(entry) => {
              return (
                <li>
                  <a
                    class="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700/90 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-white"
                    href={`#${entry.anchorIdentifier}`}
                  >
                    {entry.navigationLabel}
                  </a>
                </li>
              );
            }}
          </For>
        </ul>
      </nav>

      <main class="mt-14 space-y-16" id="showcase-main-content">
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
              <Badge variant="subtle" color="primary" icon={tag}>
                With icon
              </Badge>
              <Badge variant="subtle" color="warning" onRemove={() => {}}>
                Removable
              </Badge>
            </div>
          </ShowcaseSection>

          <ShowcaseSection sectionHeadingIdentifier="showcase-heading-buttons" sectionTitle="Buttons and icon buttons">
            <div class="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link style</Button>
              <Button variant="default" disabled>
                Disabled
              </Button>
            </div>
            <div class="flex flex-wrap gap-3">
              <Button variant="default" icon={pencil}>
                Leading icon
              </Button>
              <Button variant="outline" icon={checkCircle} iconPosition="end">
                Trailing icon
              </Button>
            </div>
            <div class="flex flex-wrap gap-3">
              <IconButton variant="default" icon={checkCircle} aria-label="Default icon button" />
              <IconButton variant="outline" icon={settings} aria-label="Outline icon button" />
              <IconButton variant="ghost" icon={ellipsisVertical} aria-label="Ghost icon button" />
              <IconButton variant="link" icon={search} aria-label="Link icon button" />
              <IconButton variant="default" icon={settings} aria-label="Disabled icon button" disabled />
            </div>
          </ShowcaseSection>
        </ShowcaseCategory>

        <ShowcaseCategory categoryTitle="Progress and loading">
          <ShowcaseSection sectionHeadingIdentifier="showcase-heading-spinner-loading" sectionTitle="Spinner and loading">
            <div class="flex flex-wrap items-center gap-6">
              <Spinner class="text-blue-400" />
              <Spinner class="text-emerald-400" aria-label="Loading content" />
            </div>
            <Card>
              <CardContent>
                <Loading message="Loading workspace preferences…" />
              </CardContent>
            </Card>
          </ShowcaseSection>
        </ShowcaseCategory>

        <ShowcaseCategory categoryTitle="Data surfaces">
          <ShowcaseSection sectionHeadingIdentifier="showcase-heading-metrics" sectionTitle="Metric cards">
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Metric title="Gross volume" accent="emerald" icon={wallet} value="₹4.2M" linkHref="#" linkLabel="View settlements" />
              <Metric title="Active users" accent="blue" icon={dashboard} value="1,284" />
              <Metric title="Risk score" accent="amber" icon={tag} value="Medium" />
              <Metric title="Automation" accent="violet" icon={settings} value="Running" />
              <Metric title="Incidents" accent="rose" icon={checkCircle} value="0 open" />
            </div>
          </ShowcaseSection>

          <ShowcaseSection sectionHeadingIdentifier="showcase-heading-card-empty" sectionTitle="Card and empty state">
            <Card>
              <CardHeader>
                <CardTitle>Workspace usage</CardTitle>
                <CardDescription>Compound card primitives with header, description, content, and footer actions for the Showcase.</CardDescription>
              </CardHeader>
              <CardContent>
                <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">Card content uses muted body copy. Pair with Header or Metric for dashboard layouts.</p>
              </CardContent>
              <CardFooter class="justify-end gap-2">
                <Button variant="ghost">Dismiss</Button>
                <Button>Save layout</Button>
              </CardFooter>
            </Card>
            <EmptyState icon={inventory} title="No records yet" message="Create your first inventory movement to populate this list." class="rounded-lg border border-dashed border-gray-300 p-12 dark:border-gray-700" />
          </ShowcaseSection>

          <ShowcaseSection sectionHeadingIdentifier="showcase-heading-table" sectionTitle="Table and pagination">
            <Card class="overflow-hidden p-0">
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
                            <Badge variant="subtle" color={row.role === "Active" ? "success" : "warning"}>
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
                    <TableCell colSpan={2} class="text-gray-600 dark:text-gray-500">
                      Use verticalAlign=&quot;top&quot; when a row mixes chips with multi-line copy.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <TablePagination limit={tablePagination().limit} offset={tablePagination().offset} currentPageCount={tableRows.length} totalCount={120} onChange={setTablePagination} />
            </Card>
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
                  icon={search}
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

        <ShowcaseCategory categoryTitle="Navigation">
          <ShowcaseSection sectionHeadingIdentifier="showcase-heading-tabs" sectionTitle="Tabs">
            <Tabs tabDefinitions={tabDefinitions} activeTabValue={activeShowcaseTab} onTabSelect={setActiveShowcaseTab} />
            <Card>
              <CardContent class="pt-6">
                <p class="text-sm text-gray-700 dark:text-gray-300">{tabPanelCopy()}</p>
              </CardContent>
            </Card>
          </ShowcaseSection>

          <ShowcaseSection sectionHeadingIdentifier="showcase-heading-dropdowns" sectionTitle="Dropdowns">
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
              <Field label="Document portal" for="showcase-dropdown-portal" hint="Menu anchors to the viewport to avoid clipping.">
                <Dropdown options={portalOptions()} value={portalDropdownValue()} onChange={setPortalDropdownValue} usePortal>
                  <DropdownTrigger id="showcase-dropdown-portal">
                    <DropdownValue>{portalDropdownValue() ?? "Choose letter"}</DropdownValue>
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
                  <DropdownIconTrigger id="showcase-dropdown-icon" icon={ellipsisVertical} aria-label="Open numeric menu" />
                </Dropdown>
              </Field>
              <Field label="Custom trigger classes" for="showcase-dropdown-custom-classes" hint="Text triggers use outline styling; adjust appearance with class.">
                <Dropdown options={dropdownOptions()} value={dropdownValue()} onChange={setDropdownValue}>
                  <DropdownTrigger id="showcase-dropdown-custom-classes" class="border-transparent bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/80" icon={tag}>
                    <DropdownValue>{dropdownValue() ?? "Tagged fruit"}</DropdownValue>
                  </DropdownTrigger>
                </Dropdown>
              </Field>
              <Field label="Disabled menu" for="showcase-dropdown-disabled">
                <Dropdown options={dropdownOptions()} value="Apple" onChange={() => {}} disabled>
                  <DropdownTrigger id="showcase-dropdown-disabled">Disabled</DropdownTrigger>
                </Dropdown>
              </Field>
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
                  <DialogDescription>Dialogs use Flowbite modal behaviour: focus management, backdrop blur, and scroll locking. Footer actions keep equal minimum widths on wide breakpoints.</DialogDescription>
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
                    variant="default"
                    onClick={() => {
                      setDialogOpen(false);
                    }}
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </ShowcaseSection>
        </ShowcaseCategory>
      </main>

      <footer class="mt-16 border-t border-gray-200 pt-8 text-center text-xs text-gray-600 dark:border-gray-800 dark:text-gray-500">
        <Show when={import.meta.env.DEV}>
          <p>
            Launch the Showcase with <code class="rounded bg-gray-100 px-1 py-0.5 text-gray-800 dark:bg-gray-900 dark:text-gray-300">npm run dev</code> from the repository root.
          </p>
        </Show>
      </footer>
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
    <section class="scroll-mt-28 space-y-6 rounded-2xl border border-gray-200/90 bg-white/90 p-6 shadow-sm ring-1 ring-black/5 sm:p-8 dark:border-gray-800/90 dark:bg-gray-950/35 dark:ring-white/4" aria-labelledby={properties.sectionHeadingIdentifier}>
      <header class="space-y-2 border-b border-gray-200/80 pb-5 dark:border-gray-800/70">
        <Heading id={properties.sectionHeadingIdentifier}>{properties.sectionTitle}</Heading>
        <Show when={properties.sectionDescription}>
          <p class="max-w-3xl text-sm text-gray-600 dark:text-gray-500">{properties.sectionDescription}</p>
        </Show>
      </header>
      <div class="space-y-6">{properties.children}</div>
    </section>
  );
};
