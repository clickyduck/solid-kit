# @clickyduck/solid-kit

A SolidJS component library built with Tailwind CSS and Flowbite-style patterns, published privately via GitHub Packages. Import UI pieces from a single package entry point.

## Components

- [Badge](#badge)
- [Button](#button)
- [BackgroundCard](#backgroundcard)
- [DataCard](#datacard)
- [Dialog](#dialog)
- [Dropdown](#dropdown)
- [EmptyState](#emptystate)
- [Field](#field)
- [HeaderLayout](#headerlayout)
- [SectionHeading](#sectionheading)
- [IconButton](#iconbutton)
- [Icons](#icons)
- [Input](#input)
- [MainLayout](#mainlayout)
- [LeftPanelLayout](#leftpanellayout)
- [PageLayout](#pagelayout)
- [Loading](#loading)
- [MetricCard](#metriccard)
- [RightPanelLayout](#rightpanellayout)
- [Spinner](#spinner)
- [Table](#table)
- [Tabs](#tabs)
- [Textarea](#textarea)
- [Toast](#toast)
- [ToggleGroup](#togglegroup)
- [Upload](#upload)

---

### Badge

Chip/tag with optional icon and remove button.

**Exports:** `Badge`

| Prop       | Type                                                                          | Default     | Description                     |
| ---------- | ----------------------------------------------------------------------------- | ----------- | ------------------------------- |
| `children` | `JSX.Element`                                                                 | —           | Badge label (required)          |
| `variant`  | `"solid" \| "outline"`                                                        | `"solid"`   | Visual style                    |
| `color`    | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color scheme                    |
| `icon`     | `IconComponent`                                                               | —           | Leading icon                    |
| `onRemove` | `() => void`                                                                  | —           | Shows × button; called on click |
| `class`    | `string`                                                                      | —           | Extra CSS classes               |

```tsx
import { Badge } from "@clickyduck/solid-kit";

<Badge color="success" onRemove={() => {}}>
  Active
</Badge>;
```

---

### Button

Standard action button with optional icon.

**Exports:** `Button`

Extends all native `<button>` HTML attributes.

| Prop           | Type                                        | Default   | Description                      |
| -------------- | ------------------------------------------- | --------- | -------------------------------- |
| `children`     | `JSX.Element`                               | —         | Button label                     |
| `variant`      | `"solid" \| "outline" \| "ghost" \| "link"` | `"solid"` | Visual style                     |
| `icon`         | `IconComponent`                             | —         | Icon displayed alongside label   |
| `iconPosition` | `"start" \| "end"`                          | `"start"` | Icon placement relative to label |
| `class`        | `string`                                    | —         | Extra CSS classes                |
| `disabled`     | `boolean`                                   | —         | Native disabled attribute        |
| `type`         | `"button" \| "submit" \| "reset"`           | —         | Native type attribute            |

Size is responsive: `large` on mobile (≤767 px), `default` on desktop.

```tsx
import { Button } from "@clickyduck/solid-kit";

<Button variant="outline" icon={SearchIcon}>
  Search
</Button>;
```

---

### BackgroundCard

Compound component for content panels.

**Exports:** `BackgroundCard`, `BackgroundCardHeader`, `BackgroundCardTitle`, `BackgroundCardDescription`, `BackgroundCardContent`, `BackgroundCardFooter`

All parts accept standard `<div>` HTML attributes (title/description use `<h3>`/`<p>`) plus an optional `class` prop for extra CSS classes. No custom props beyond what HTML provides.

```tsx
import { BackgroundCard, BackgroundCardContent, BackgroundCardDescription, BackgroundCardFooter, BackgroundCardHeader, BackgroundCardTitle } from "@clickyduck/solid-kit";

<BackgroundCard>
  <BackgroundCardHeader>
    <BackgroundCardTitle>Title</BackgroundCardTitle>
    <BackgroundCardDescription>Subtitle</BackgroundCardDescription>
  </BackgroundCardHeader>
  <BackgroundCardContent>Body content</BackgroundCardContent>
  <BackgroundCardFooter>Footer</BackgroundCardFooter>
</BackgroundCard>;
```

---

### DataCard

Clickable “ticket style” data surface card with title, optional description, optional top-right slot, and an optional footer row of icon/label/value items.

**Exports:** `DataCard`

| Prop          | Type                   | Description                                   |
| ------------- | ---------------------- | --------------------------------------------- |
| `title`       | `string`               | Card heading (required)                       |
| `description` | `string`               | Optional secondary text                       |
| `topRight`    | `JSX.Element`          | Optional element in the top-right corner      |
| `footerItems` | `DataCardFooterItem[]` | Optional footer row of icon/label/value items |
| `active`      | `boolean`              | Highlights the card as selected               |
| `class`       | `string`               | Extra CSS classes                             |

`DataCardFooterItem`: `{ icon: IconComponent; label: string; value: string; valueClass?: string }`

```tsx
import { DataCard, calendarDays, groups } from "@clickyduck/solid-kit";

<DataCard
  title="Fix upload progress indicator"
  description="Progress indicator gets stuck at 100% when retrying."
  footerItems={[
    { icon: groups, label: "Assignee", value: "Unassigned" },
    { icon: calendarDays, label: "Due", value: "29 Apr 2026", valueClass: "text-gray-300" }
  ]}
  onClick={() => {}}
/>;
```

---

### Dialog

Modal dialog with managed open/close state.

**Exports:** `Dialog`, `DialogTrigger`, `DialogContent`, `DialogTitle`, `DialogDescription`, `DialogHeader`, `DialogBody`, `DialogFooter`

**`Dialog` (root) props:**

| Prop           | Type                      | Default | Description                          |
| -------------- | ------------------------- | ------- | ------------------------------------ |
| `open`         | `boolean`                 | —       | Controlled open state                |
| `onOpenChange` | `(open: boolean) => void` | —       | Called when open state should change |
| `closeable`    | `boolean`                 | `true`  | Show × button in header              |
| `children`     | `JSX.Element`             | —       |                                      |

**`DialogHeader` extra prop:**

| Prop      | Type          | Description                       |
| --------- | ------------- | --------------------------------- |
| `actions` | `JSX.Element` | Additional elements in the header |

All other parts (`DialogTrigger`, `DialogContent`, `DialogTitle`, `DialogDescription`, `DialogBody`, `DialogFooter`) accept standard `<div>` / `<button>` HTML attributes plus `class`.

```tsx
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@clickyduck/solid-kit";

<Dialog open={open()} onOpenChange={setOpen}>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm</DialogTitle>
    </DialogHeader>
    <DialogBody>Are you sure?</DialogBody>
    <DialogFooter>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

---

### Dropdown

Accessible select-style dropdown with optional search.

**Exports:** `Dropdown`, `DropdownValue`, `DropdownTrigger`, `DropdownIconTrigger`, `DropdownContent`, `DropdownLabel`, `DropdownItem`, `DropdownSeparator`

**`Dropdown` (root) props:**

| Prop            | Type                                                     | Default | Description                                       |
| --------------- | -------------------------------------------------------- | ------- | ------------------------------------------------- |
| `options`       | `string[]`                                               | —       | List of option values (required)                  |
| `value`         | `string`                                                 | —       | Controlled selected value                         |
| `onChange`      | `(value: string \| undefined) => void`                   | —       | Called on selection change                        |
| `disabled`      | `boolean`                                                | —       | Disables the trigger                              |
| `searchable`    | `boolean`                                                | —       | Adds a filter input inside the menu               |
| `itemComponent` | `(props: { item: { rawValue: string } }) => JSX.Element` | —       | Custom item renderer                              |
| `menuClass`     | `string`                                                 | —       | Extra classes on the menu surface                 |
| `menuFullWidth` | `boolean`                                                | `true`  | Menu width matches trigger width                  |
| `usePortal`     | `boolean`                                                | —       | Render menu on `document.body` to escape overflow |
| `initialOpen`   | `boolean`                                                | —       | Open on first render                              |

**`DropdownContent` extra props:**

| Prop                      | Type                | Default    | Description             |
| ------------------------- | ------------------- | ---------- | ----------------------- |
| `useDocumentPortal`       | `boolean`           | —          | Portal to document body |
| `documentPortalPlacement` | `"top" \| "bottom"` | `"bottom"` | Menu opening direction  |
| `wrapChildrenInList`      | `boolean`           | `true`     | Wrap items in `<ul>`    |

**`DropdownItem` extra props:**

| Prop            | Type                   | Default | Description                     |
| --------------- | ---------------------- | ------- | ------------------------------- |
| `item`          | `{ rawValue: string }` | —       | Item data                       |
| `disabled`      | `boolean`              | —       | Disables this item              |
| `selected`      | `boolean`              | —       | Marks item as selected          |
| `closeOnSelect` | `boolean`              | `true`  | Close menu when item is clicked |

```tsx
import { Dropdown } from "@clickyduck/solid-kit";

<Dropdown options={["Option A", "Option B", "Option C"]} value={selected()} onChange={setSelected} searchable />;
```

---

### EmptyState

Centered placeholder for empty lists or zero-data views.

**Exports:** `EmptyState`

| Prop      | Type            | Description                |
| --------- | --------------- | -------------------------- |
| `icon`    | `IconComponent` | Icon to display (required) |
| `title`   | `string`        | Heading text (required)    |
| `message` | `string`        | Body text (required)       |
| `class`   | `string`        | Extra CSS classes          |

```tsx
import { EmptyState } from "@clickyduck/solid-kit";

<EmptyState icon={InboxIcon} title="No results" message="Try a different search." />;
```

---

### Field

Form field wrapper with label, control slot, and hint text.

**Exports:** `Field`

| Prop       | Type                    | Description                                            |
| ---------- | ----------------------- | ------------------------------------------------------ |
| `label`    | `string`                | Field label (required)                                 |
| `children` | `JSX.Element`           | The form control (required)                            |
| `for`      | `string`                | `htmlFor` on the label; omit for radio/checkbox groups |
| `hint`     | `string \| JSX.Element` | Helper text shown below the control                    |
| `class`    | `string`                | Extra CSS classes                                      |

```tsx
import { Field, Input } from "@clickyduck/solid-kit";

<Field label="Email" for="email" hint="We'll never share it.">
  <Input id="email" type="email" />
</Field>;
```

---

### HeaderLayout

Page-level header row with title, description, back link, and actions slot.

**Exports:** `HeaderLayout`

| Prop           | Type          | Description                                    |
| -------------- | ------------- | ---------------------------------------------- |
| `title`        | `string`      | Page title; component returns `null` if absent |
| `titleElement` | `JSX.Element` | Custom title element (replaces `title` string) |
| `description`  | `string`      | Optional subtitle below the title              |
| `back`         | `JSX.Element` | Back link or button rendered to the left       |
| `children`     | `JSX.Element` | Actions rendered on the right side             |
| `class`        | `string`      | Extra CSS classes                              |

```tsx
import { Button, HeaderLayout } from "@clickyduck/solid-kit";

<HeaderLayout title="Users" description="Manage your team">
  <Button>Invite</Button>
</HeaderLayout>;
```

---

### SectionHeading

Standardized section heading (`<h3>`, small, semibold, uppercase, tracked).

**Exports:** `SectionHeading`

Extends all native `<h3>` HTML attributes plus `class`.

```tsx
import { SectionHeading } from "@clickyduck/solid-kit";

<SectionHeading>Section Title</SectionHeading>;
```

---

### IconButton

Square icon-only button sized to match form controls.

**Exports:** `IconButton`

Extends all native `<button>` HTML attributes.

| Prop      | Type                                        | Default   | Description               |
| --------- | ------------------------------------------- | --------- | ------------------------- |
| `icon`    | `IconComponent`                             | —         | Icon to render (required) |
| `variant` | `"solid" \| "outline" \| "ghost" \| "link"` | `"solid"` | Visual style              |
| `class`   | `string`                                    | —         | Extra CSS classes         |

Size is responsive: `large` on mobile (≤767 px), `default` on desktop.

```tsx
import { IconButton } from "@clickyduck/solid-kit";

<IconButton icon={CloseIcon} variant="ghost" aria-label="Close" />;
```

---

### Icons

SVG icon renderer and bundled icon symbols.

**Exports:** `Icon`, `IconComponent` (type), named icon SVG components

**`Icon` props:**

| Prop     | Type            | Default          | Description                        |
| -------- | --------------- | ---------------- | ---------------------------------- |
| `icon`   | `IconComponent` | —                | SVG component to render (required) |
| `width`  | `number`        | —                | Override width                     |
| `height` | `number`        | —                | Override height                    |
| `fill`   | `string`        | `"currentColor"` | SVG fill color                     |
| `class`  | `string`        | —                | Extra CSS classes                  |

**Bundled named icons** (used by built-in components such as `LeftPanelLayout` navigation and `Toast`; for your own buttons, metrics, tabs etc. pass icons from your own module):

`arrowLeft`, `arrowRight`, `arrowTrendingUp`, `calendarDays`, `chat`, `checkCircle`, `chevronDown`, `closeCircle`, `confirmationNumber`, `currencyRupee`, `dashboard`, `forum`, `groups`, `inventory`, `list`, `pieChart`, `search`, `settings`, `tag`, `upload`, `wallet`, `work`, `exclamationTriangle`

```tsx
import { Icon, search } from "@clickyduck/solid-kit";

<Icon icon={search} width={20} />;
```

---

### Input

Styled text input with optional leading icon and trailing text.

**Exports:** `Input`

Extends all native `<input>` HTML attributes.

| Prop           | Type            | Description                                                |
| -------------- | --------------- | ---------------------------------------------------------- |
| `icon`         | `IconComponent` | Leading icon inside the input                              |
| `trailingText` | `string`        | Right-side label (e.g. a unit or currency symbol)          |
| `currency`     | `boolean`       | Indian currency formatting: comma grouping, max 2 decimals |
| `class`        | `string`        | Extra CSS classes                                          |

```tsx
import { Input } from "@clickyduck/solid-kit";

<Input type="number" currency trailingText="INR" />;
```

---

### MainLayout

Application shell layout that positions a header at the top, a left navigation panel, the main page column, and an optional right panel.

**Exports:** `MainLayout`

#### Guide (recommended composition)

```tsx
import { HeaderLayout, LeftPanelLayout, MainLayout, PageContent, PageHeader, PageLayout, RightPanelLayout } from "@clickyduck/solid-kit";

<MainLayout>
  <HeaderLayout title="Workspace" description="Overview">
    {/* actions */}
  </HeaderLayout>

  <LeftPanelLayout collapsed={false} navigationDocument={navigationDocument} />

  <PageLayout>
    <PageHeader title="Dashboard" />
    <PageContent>{/* page content */}</PageContent>
  </PageLayout>

  {/* Optional: show/hide with <Show when={...}> */}
  <RightPanelLayout title="Details" closeAriaLabel="Close details" onOpenChange={() => {}}>
    {/* right panel content */}
  </RightPanelLayout>
</MainLayout>;
```

---

### LeftPanelLayout

Collapsible sidebar navigation panel.

**Exports:** `LeftPanelLayout`, `leftPanelLayoutNavigationIconByExportName`, `LeftPanelLayoutNavigationDocumentJson`, `LeftPanelLayoutNavigationGroupJson`, `LeftPanelLayoutNavigationItemJson`, `LeftPanelLayoutNavigationIconExportName`

**`LeftPanelLayout` props:**

| Prop                 | Type                                    | Description                                                                                           |
| -------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `collapsed`          | `boolean`                               | When `true`, shows icon-only mode (required)                                                          |
| `navigationDocument` | `LeftPanelLayoutNavigationDocumentJson` | Navigation tree configuration (required)                                                              |
| `onOpenChange`       | `(isPanelOpen: boolean) => void`        | Fires when open state changes; use `false` to react to close (nav link, swipe, or parent `collapsed`) |

**`LeftPanelLayoutNavigationDocumentJson`** — root navigation config:

```ts
{
  groups: LeftPanelLayoutNavigationGroupJson[]
}
```

**`LeftPanelLayoutNavigationGroupJson`** — a collapsible nav group:

| Field                               | Type                                  | Description                      |
| ----------------------------------- | ------------------------------------- | -------------------------------- |
| `groupLabel`                        | `string`                              | Group heading                    |
| `navigationGroupIdentifier`         | `string`                              | Unique key (optional)            |
| `collapsibleNavigationGroup`        | `boolean`                             | Whether the group can be toggled |
| `navigationGroupInitiallyCollapsed` | `boolean`                             | Start collapsed                  |
| `items`                             | `LeftPanelLayoutNavigationItemJson[]` | Nav items in this group          |

**`LeftPanelLayoutNavigationItemJson`** — a single nav link:

| Field               | Type                                      | Description                                               |
| ------------------- | ----------------------------------------- | --------------------------------------------------------- |
| `href`              | `string`                                  | Link URL                                                  |
| `label`             | `string`                                  | Nav item text                                             |
| `iconExportName`    | `LeftPanelLayoutNavigationIconExportName` | Icon key from `leftPanelLayoutNavigationIconByExportName` |
| `matchRouteExactly` | `boolean`                                 | Use exact path match for active highlight                 |

On mobile the panel is full-width with a swipe-to-close gesture. On desktop it switches between full labels and icon-only mode via `collapsed`.

---

### Loading

Centered spinner with a status message.

**Exports:** `Loading`

| Prop      | Type     | Description            |
| --------- | -------- | ---------------------- |
| `message` | `string` | Status text (required) |
| `class`   | `string` | Extra CSS classes      |

```tsx
import { Loading } from "@clickyduck/solid-kit";

<Loading message="Fetching data…" />;
```

---

### MetricCard

Stat card with accent color, icon, value, and optional link.

**Exports:** `MetricCard`

| Prop        | Type                                                   | Description                                 |
| ----------- | ------------------------------------------------------ | ------------------------------------------- |
| `title`     | `string`                                               | Metric label (rendered uppercase, required) |
| `accent`    | `"emerald" \| "blue" \| "amber" \| "violet" \| "rose"` | Left-border and icon box color (required)   |
| `icon`      | `IconComponent`                                        | Icon in the top-right (required)            |
| `value`     | `string`                                               | Large primary value (required)              |
| `loading`   | `boolean`                                              | Shows an em dash instead of `value`         |
| `linkHref`  | `string`                                               | Makes the footer a link                     |
| `linkLabel` | `string`                                               | Link text                                   |
| `class`     | `string`                                               | Extra CSS classes                           |

```tsx
import { MetricCard } from "@clickyduck/solid-kit";

<MetricCard title="Revenue" accent="emerald" icon={CurrencyIcon} value="₹1,24,000" linkHref="/revenue" linkLabel="View report" />;
```

---

### PageLayout

Main application page column content wrapper.

**Exports:** `PageLayout`, `PageHeader`, `PageContent`

---

### RightPanelLayout

Responsive detail/drawer panel that slides in from the right.

**Exports:** `RightPanelLayout`

**`RightPanelLayout` props:**

| Prop             | Type                             | Description                                                                                                          |
| ---------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `title`          | `string`                         | Panel heading (required)                                                                                             |
| `subtitle`       | `string`                         | Optional subtitle                                                                                                    |
| `headerActions`  | `JSX.Element`                    | Extra elements in the header row                                                                                     |
| `children`       | `JSX.Element`                    | Scrollable body content (required)                                                                                   |
| `footer`         | `JSX.Element`                    | Sticky footer slot                                                                                                   |
| `onOpenChange`   | `(isPanelOpen: boolean) => void` | `true` when the open transition runs; `false` after the close animation finishes (200ms), for unmounting with `Show` |
| `closeAriaLabel` | `string`                         | Accessible label for the close button (required)                                                                     |

On desktop the panel pushes the main area. On mobile it overlays full-screen with smooth entrance/exit transitions.

---

### Spinner

Animated loading indicator.

**Exports:** `Spinner`

| Prop         | Type     | Description                                                           |
| ------------ | -------- | --------------------------------------------------------------------- |
| `class`      | `string` | Extra CSS classes (default size is `size-8`)                          |
| `aria-label` | `string` | Accessible label; omit to make the spinner decorative (`aria-hidden`) |

```tsx
import { Spinner } from "@clickyduck/solid-kit";

<Spinner aria-label="Loading" />;
```

---

### Table

Full compound component for data tables with pagination.

**Exports:** `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TablePagination`

`Table` wraps content in a horizontally scrollable container (min-width 640 px). `TableHeader`, `TableBody`, `TableFooter` accept standard HTML attributes plus `class`.

**`TableRow` extra props:**

| Prop            | Type                | Default    | Description                         |
| --------------- | ------------------- | ---------- | ----------------------------------- |
| `clickable`     | `boolean`           | —          | Pointer cursor + hover highlight    |
| `active`        | `boolean`           | —          | Blue highlight for the selected row |
| `verticalAlign` | `"top" \| "middle"` | `"middle"` | Cell vertical alignment             |

**`TableHead` / `TableCell` extra props:**

| Prop        | Type                            | Default  | Description         |
| ----------- | ------------------------------- | -------- | ------------------- |
| `align`     | `"left" \| "right" \| "center"` | `"left"` | Text alignment      |
| `monospace` | `boolean`                       | —        | Applies `font-mono` |

**`TablePagination` props:**

| Prop               | Type                                                | Default              | Description                                   |
| ------------------ | --------------------------------------------------- | -------------------- | --------------------------------------------- |
| `limit`            | `number`                                            | —                    | Rows per page (required)                      |
| `offset`           | `number`                                            | —                    | Current row offset (required)                 |
| `currentPageCount` | `number`                                            | —                    | Number of rows on the current page (required) |
| `totalCount`       | `number`                                            | —                    | Total rows; used to disable Next when at end  |
| `onChange`         | `(next: { limit: number; offset: number }) => void` | —                    | Called on page or limit change (required)     |
| `limitOptions`     | `number[]`                                          | `[25, 50, 100, 200]` | Rows-per-page choices                         |
| `class`            | `string`                                            | —                    | Extra CSS classes                             |

Clickable rows support keyboard activation via Enter / Space.

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TablePagination, TableRow } from "@clickyduck/solid-kit";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead align="right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow clickable onClick={() => {}}>
      <TableCell>Alice</TableCell>
      <TableCell align="right" monospace>
        ₹500
      </TableCell>
    </TableRow>
  </TableBody>
</Table>;
```

---

### Tabs

Accessible tab bar with ARIA roles and underline indicator.

**Exports:** `Tabs`, `TabDefinition`, `TabsProperties`

`Tabs` is generic over `TabValue extends string`.

**`TabDefinition<TabValue>` shape:**

| Field                    | Type            | Description               |
| ------------------------ | --------------- | ------------------------- |
| `tabValue`               | `TabValue`      | Unique tab identifier     |
| `label`                  | `string`        | Display label             |
| `tabElementIdentifier`   | `string`        | DOM id for the tab button |
| `panelElementIdentifier` | `string`        | DOM id for the tab panel  |
| `icon`                   | `IconComponent` | Optional leading icon     |

**`Tabs` props:**

| Prop             | Type                                 | Description                                              |
| ---------------- | ------------------------------------ | -------------------------------------------------------- |
| `tabDefinitions` | `readonly TabDefinition<TabValue>[]` | Tab configuration (required)                             |
| `activeTabValue` | `Accessor<TabValue>`                 | Currently active tab (required)                          |
| `onTabSelect`    | `(value: TabValue) => void`          | Called when a tab is clicked (required)                  |
| `isDisabled`     | `Accessor<boolean>`                  | Disables all tabs                                        |
| `class`          | `string`                             | Extra classes on the root element                        |
| `tabListClass`   | `string`                             | Extra classes on the `<ul>` tab list                     |
| `listItemClass`  | `string`                             | Extra classes on each `<li>` (default: `flex-1 basis-0`) |
| `tabButtonClass` | `string`                             | Extra classes on each tab `<button>`                     |

```tsx
import { Tabs } from "@clickyduck/solid-kit";
import { createSignal } from "solid-js";

const [tab, setTab] = createSignal("overview");

<Tabs
  tabDefinitions={[
    { tabValue: "overview", label: "Overview", tabElementIdentifier: "tab-overview", panelElementIdentifier: "panel-overview" },
    { tabValue: "details", label: "Details", tabElementIdentifier: "tab-details", panelElementIdentifier: "panel-details" }
  ]}
  activeTabValue={tab}
  onTabSelect={setTab}
/>;
```

---

### Textarea

Auto-growing styled textarea.

**Exports:** `Textarea`

Extends all native `<textarea>` HTML attributes.

| Prop       | Type                                             | Default | Description                                    |
| ---------- | ------------------------------------------------ | ------- | ---------------------------------------------- |
| `resize`   | `"none" \| "vertical" \| "horizontal" \| "both"` | —       | CSS resize handle                              |
| `autoGrow` | `boolean`                                        | —       | Height expands automatically to fit content    |
| `minRows`  | `number`                                         | `1`     | Minimum visible rows when `autoGrow` is active |
| `maxRows`  | `number`                                         | `8`     | Maximum rows before scroll when `autoGrow`     |
| `class`    | `string`                                         | —       | Extra CSS classes                              |

```tsx
import { Textarea } from "@clickyduck/solid-kit";

<Textarea autoGrow minRows={3} maxRows={10} placeholder="Enter notes…" />;
```

---

### Toast

Auto-dismissing notification toasts.

**Exports:** `Toast`, `Toaster`, `addToast`, `removeToast`, `toastStore`

Place `<Toaster />` once in your app root. Call `addToast` from anywhere to show a notification.

**`addToast` signature:**

```ts
addToast(toast: {
  title?: string;
  description?: string;
  variant?: "success" | "danger" | "warning" | "default";
}): string  // returns the toast id
```

**`removeToast(toastId: string): void`**

Toasts auto-dismiss after 5 seconds. `variant` controls the icon:

| Variant     | Icon                 |
| ----------- | -------------------- |
| `"success"` | Check circle         |
| `"danger"`  | Close circle         |
| `"warning"` | Exclamation triangle |
| `"default"` | Check circle         |

**`Toaster`** — no props; renders a fixed bottom-right region.

```tsx
// App root
import { Toaster } from "@clickyduck/solid-kit";
// Anywhere in your app
import { addToast } from "@clickyduck/solid-kit";

<Toaster />;

addToast({ title: "Saved", description: "Your changes were saved.", variant: "success" });
```

---

### ToggleGroup

Radio or checkbox toggle card group.

**Exports:** `ToggleGroup`, `ToggleGroupOption`

**`ToggleGroupOption` shape:**

| Field         | Type      | Description                      |
| ------------- | --------- | -------------------------------- |
| `value`       | `string`  | Option value (required)          |
| `label`       | `string`  | Display label (required)         |
| `description` | `string`  | Optional secondary text          |
| `disabled`    | `boolean` | Disables this option             |
| `class`       | `string`  | Extra CSS classes on this option |

**`ToggleGroup` props** (union discriminated by `selectionMode`):

Single selection:

| Prop               | Type                                   | Description                            |
| ------------------ | -------------------------------------- | -------------------------------------- |
| `selectionMode`    | `"single"`                             | (required)                             |
| `name`             | `string`                               | Radio group name (required)            |
| `options`          | `ToggleGroupOption[]`                  | (required)                             |
| `value`            | `string`                               | Selected value                         |
| `onChange`         | `(value: string \| undefined) => void` | Called on selection                    |
| `disabled`         | `boolean`                              | Disables all options                   |
| `allowNoSelection` | `boolean`                              | Clicking the selected option clears it |

Multiple selection:

| Prop            | Type                        | Description                    |
| --------------- | --------------------------- | ------------------------------ |
| `selectionMode` | `"multiple"`                | (required)                     |
| `name`          | `string`                    | Checkbox group name (required) |
| `options`       | `ToggleGroupOption[]`       | (required)                     |
| `value`         | `string[]`                  | Selected values                |
| `onChange`      | `(value: string[]) => void` | Called on selection change     |
| `disabled`      | `boolean`                   | Disables all options           |

```tsx
import { ToggleGroup } from "@clickyduck/solid-kit";
import { createSignal } from "solid-js";

const [plan, setPlan] = createSignal<string>();

<ToggleGroup
  selectionMode="single"
  name="plan"
  options={[
    { value: "starter", label: "Starter", description: "Up to 5 users" },
    { value: "pro", label: "Pro", description: "Unlimited users" }
  ]}
  value={plan()}
  onChange={setPlan}
/>;
```

---

### Upload

Styled file input with file-count display.

**Exports:** `Upload`

Extends all native `<input type="file">` HTML attributes.

| Prop                    | Type                      | Description                                  |
| ----------------------- | ------------------------- | -------------------------------------------- |
| `selectedFiles`         | `File[]`                  | Controlled file list (required)              |
| `onSelectedFilesChange` | `(files: File[]) => void` | Called when the selection changes (required) |
| `class`                 | `string`                  | Extra CSS classes                            |
| `accept`                | `string`                  | Native file type filter                      |
| `multiple`              | `boolean`                 | Allow multiple file selection                |
| `disabled`              | `boolean`                 | Disables the control                         |

```tsx
import { Upload } from "@clickyduck/solid-kit";
import { createSignal } from "solid-js";

const [files, setFiles] = createSignal<File[]>([]);

<Upload selectedFiles={files()} onSelectedFilesChange={setFiles} accept=".csv" multiple />;
```

---

## Utilities

The following are exported from `@clickyduck/solid-kit` and useful when building on top of the library.

### `mergeClasses`

Merges Tailwind CSS class strings; later arguments override conflicting utilities.

```ts
import { mergeClasses } from "@clickyduck/solid-kit";

mergeClasses("px-4 py-2", conditionalClass, "py-4"); // → "px-4 py-4 …"
```

### `useIsMobile`

Solid.js signal tracking whether the viewport is ≤767 px.

```ts
import { useIsMobile } from "@clickyduck/solid-kit";

const isMobile = useIsMobile(); // Accessor<boolean>
```

### `useEffectiveFormControlSize`

Returns `"large"` on mobile (≤767 px) and `"default"` on desktop. Used internally by `Button`, `IconButton`, `Input`, `Textarea`.

```ts
import { useEffectiveFormControlSize } from "@clickyduck/solid-kit";

const size = useEffectiveFormControlSize(); // Accessor<"default" | "large">
```

### Color scheme helpers

Manage the app's light/dark theme with `localStorage` persistence and cross-tab sync.

```ts
import { createDocumentColorSchemePreferenceSignal, persistDocumentColorSchemeName } from "@clickyduck/solid-kit";

// In your root component:
const [scheme, setScheme] = createDocumentColorSchemePreferenceSignal();
// scheme() → "light" | "dark"
// setScheme("dark") → persists and applies to <html>
```

Additional low-level exports: `readDocumentColorSchemeNameFromLocalStorage`, `writeDocumentColorSchemeNameToLocalStorage`, `applyDocumentColorSchemeNameToRootElement`, `readCurrentDocumentColorSchemeNameFromRootElement`, `documentColorSchemeLocalStorageKey`.

---

## Development

```bash
# Install dependencies
npm install

# Showcase / local Vite
npm run development

# Build the library (removes public/ output first, then vite build)
npm run build

# Build with file watcher
npm run build -- --watch

# Type check
npm run typecheck

# Type check with file watcher
npm run typecheck -- --watch

# Type check then build (no publish; same as prepublishOnly)
npm run typecheck && npm run build

# Format sources
npm run format
```

## Structure

```
source/
  components/   # Reusable UI components
  utilities/    # Utility functions and helpers
```

## Publishing

This section is the full checklist for publishing **`@clickyduck/solid-kit`** to GitHub Packages.

### Build, typecheck, and release (how they relate)

| Command               | What it does                                                                                                                                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`npm run build`**   | Deletes the **`public/`** output folder, then runs the Vite library build. Produces the files that ship inside the package (see **`files`** in **`package.json`**). Use this when you only want a local build (for example to inspect output). |
| **`npm run release`** | Runs **`prepublishOnly`** (**`npm run typecheck`** then **`npm run build`**), then **`npm publish`** with **`GITHUB_TOKEN`** loaded from **`.env`** via **`dotenv-cli`**.                                                                      |

You **do not** need to run **`npm run build`** manually immediately before **`npm run release`**: **`prepublishOnly`** already runs typecheck and build. Before **`npm version`**, run **`npm run typecheck && npm run build`** so you do not tag a commit that fails typecheck or build (**`npm version`** does not run those steps). Run **`npm run typecheck`**, **`npm run build`**, or both in sequence any time you want to confirm output locally.

### 1. One-time setup: GitHub token

Go to: `GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)`.

Create a token with scopes: **`write:packages`**, **`read:packages`**, **`repo`**.

### 2. One-time setup: credentials for publish

Copy **`.env.example`** to **`.env`** and set **`GITHUB_TOKEN`** to that token. The **`release`** script loads **`.env`** with **`dotenv-cli`**, so you do not need to export the variable in your shell for publishing from this repository.

Alternatively, export it in the shell: `export GITHUB_TOKEN=your_token_here` (Unix) or set **`GITHUB_TOKEN`** in Windows environment variables (then you still use **`npm run release`**; the file is optional if the variable is already set for the process).

### 3. Before you version or publish

1. Commit or stash every change you want in the release. **`npm version`** creates a git commit; it refuses a dirty working tree unless you pass flags you should use only when you know why.
2. Run **`npm run typecheck && npm run build`** before **`npm version`** so the tagged commit is known good.
3. Push your branch as usual so collaborators see your commits before you tag.
4. Confirm **`.env`** exists with **`GITHUB_TOKEN`** if you rely on the file (see step 2).

### 4. Bump the package version (git commit, tag, push)

Pick one of **`patch`**, **`minor`**, or **`major`** depending on semver:

```bash
npm version patch   # 0.1.0 → 0.1.1  (bug fixes, compatible changes)
npm version minor   # 0.1.0 → 0.2.0  (new features, backward compatible)
npm version major   # 0.1.0 → 1.0.0  (breaking changes)
```

What **`npm version`** does in this repository:

1. Updates the **`version`** field in **`package.json`** (and **`package-lock.json`** if npm updates it).
2. Creates a git commit for that version bump and a git tag (for example **`v0.1.1`**).
3. **`postversion`**: runs **`git push --follow-tags`** so the commit and tag are on the remote.

If **`postversion`** fails to push, fix your remote or credentials, then run **`git push --follow-tags`** manually so the version commit and tag reach the remote.

### 5. Publish the new version to GitHub Packages

After step 4 succeeds:

```bash
npm run release
```

What **`npm run release`** does:

1. **`prepublishOnly`**: runs **`npm run typecheck`** then **`npm run build`** so the tarball matches current sources.
2. **`npm publish`** to the registry configured in **`publishConfig`** (GitHub Packages for this package), using **`GITHUB_TOKEN`** from **`.env`** when you use **`dotenv-cli`** as in the script.

First-time publish from a machine: same commands; ensure the package name and registry scope match your GitHub organization and **`.npmrc`**.

### 6. Optional commands (no version bump)

Inspect the packed tarball without uploading:

```bash
npm run release -- --dry-run
```

Typecheck and build only (no **`npm version`**, no publish):

```bash
npm run typecheck && npm run build
```

Library build only (no typecheck):

```bash
npm run build
```

## Installing in another project

### 1. Add an `.npmrc` to the consumer project

```
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@clickyduck:registry=https://npm.pkg.github.com
```

### 2. Set the token in your shell

The consumer needs a GitHub token with `read:packages` scope.

```bash
export GITHUB_TOKEN=your_token_here
```

### 3. Install packages

```bash
npm install @clickyduck/solid-kit solid-js tailwindcss
```

Built-in components that need a fixed glyph bundle only the Material Symbols they use; you do **not** install **`@material-symbols/svg-500`** for those. When you want custom icons (same pattern as **`showcase/showcaseIcons.tsx`** in this repository), add **`@material-symbols/svg-500`** (or another SVG source), **`vite-plugin-solid-svg`** if you use Vite, and export **`IconComponent`** values from your application. Pass those into **`Button`**, **`IconButton`**, **`MetricCard`**, **`EmptyState`**, **`Tabs`**, **`Input`**, **`Dropdown`**, **`Badge`**, and any other prop typed as **`IconComponent`**.

### 4. Usage

```tsx
import { Button } from "@clickyduck/solid-kit";

function App() {
  return <Button>Click me</Button>;
}
```

## License

MIT
