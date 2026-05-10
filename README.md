# @clickyduck/solid-kit

A SolidJS component library built with Tailwind CSS, published privately via GitHub Packages. Import UI pieces from the main entry or per-component sub-paths for better tree-shaking.

## Requirements

Before installing, ensure your project has the following:

- **Node.js**
- **SolidJS**
- **Tailwind CSS**
- **clsx**
- **tailwind-merge**
- **material-symbols**

Install them alongside the library:

```bash
npm install @clickyduck/solid-kit solid-js tailwindcss clsx tailwind-merge material-symbols
```

---

## Components

- [Badge](#badge)
- [Button](#button)
- [BackgroundCard](#backgroundcard)
- [DataCard](#datacard)
- [DatePicker](#datepicker)
- [Dialog](#dialog)
- [Divider](#divider)
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
- [Text](#text)
- [Textarea](#textarea)
- [Toast](#toast)
- [ToggleGroup](#togglegroup)
- [Upload](#upload)

---

### Badge

Chip/tag with optional icon and remove button.

**Exports:** `Badge`, `BadgeVariant` (type), `BadgeProperties` (type)

| Prop       | Type                                                                          | Default     | Description                             |
| ---------- | ----------------------------------------------------------------------------- | ----------- | --------------------------------------- |
| `children` | `JSX.Element`                                                                 | —           | Badge label (required)                  |
| `variant`  | `"solid" \| "outline"`                                                        | `"solid"`   | Visual style                            |
| `color`    | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color scheme                            |
| `icon`     | `string \| JSX.Element`                                                       | —           | Material Symbols name or an img/element |
| `onRemove` | `() => void`                                                                  | —           | Shows × button; called on click         |
| `class`    | `string`                                                                      | —           | Extra CSS classes                       |

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

| Prop           | Type                                        | Default   | Description                             |
| -------------- | ------------------------------------------- | --------- | --------------------------------------- |
| `children`     | `JSX.Element`                               | —         | Button label                            |
| `variant`      | `"solid" \| "outline" \| "ghost" \| "link"` | `"solid"` | Visual style                            |
| `icon`         | `string \| JSX.Element`                     | —         | Material Symbols name or an img/element |
| `iconPosition` | `"start" \| "end"`                          | `"start"` | Icon placement relative to label        |
| `class`        | `string`                                    | —         | Extra CSS classes                       |
| `disabled`     | `boolean`                                   | —         | Native disabled attribute               |
| `type`         | `"button" \| "submit" \| "reset"`           | —         | Native type attribute                   |

Size is responsive: `large` on mobile (≤767 px), `default` on desktop.

```tsx
import { Button } from "@clickyduck/solid-kit";

<Button variant="outline" icon="search">
  Search
</Button>;
```

---

### BackgroundCard

Simple fixed-style card shell for content panels.

**Exports:** `BackgroundCard`

| Prop    | Type     | Description       |
| ------- | -------- | ----------------- |
| `class` | `string` | Extra CSS classes |

```tsx
import { BackgroundCard } from "@clickyduck/solid-kit";

<BackgroundCard>
  <div>
    <div>Title</div>
    <div>Body content</div>
  </div>
</BackgroundCard>;
```

---

### DataCard

Ticket-style data surface card. Can be clickable or static.

**Exports:** `DataCard`

| Prop        | Type      | Description                                  |
| ----------- | --------- | -------------------------------------------- |
| `clickable` | `boolean` | Enables hover/cursor affordance + `<button>` |
| `active`    | `boolean` | Optional selected style (clickable only)     |
| `class`     | `string`  | Extra CSS classes                            |

Extends all native `<div>` (static) or `<button>` (clickable) HTML attributes.

```tsx
import { DataCard } from "@clickyduck/solid-kit";

<DataCard clickable onClick={() => {}}>
  <div>Any content</div>
</DataCard>;
```

---

### DatePicker

Calendar popover for picking a single date or a date range.

**Exports:** `DatePicker`, `DatePickerMode`, `DatePickerValue`

| Prop          | Type                               | Default                                 | Description                                                    |
| ------------- | ---------------------------------- | --------------------------------------- | -------------------------------------------------------------- |
| `mode`        | `"single" \| "range"`              | `"single"`                              | Selection mode                                                 |
| `value`       | `DatePickerValue`                  | —                                       | Controlled value (see below)                                   |
| `onChange`    | `(value: DatePickerValue) => void` | —                                       | Called when the selection changes                              |
| `placeholder` | `string`                           | `"Select date"` / `"Select date range"` | Trigger placeholder text                                       |
| `disabled`    | `boolean`                          | —                                       | Disables the trigger                                           |
| `id`          | `string`                           | —                                       | Native `id` on the trigger button; pair with `<Field for="…">` |
| `class`       | `string`                           | —                                       | Extra CSS classes on the root wrapper                          |

**`DatePickerValue`** is a discriminated union:

```ts
// Single mode
{
  mode: "single";
  date: Date | undefined;
}

// Range mode — from is 12:00 AM, to is 11:59:59 PM
{
  mode: "range";
  from: Date | undefined;
  to: Date | undefined;
}
```

In range mode the first click sets the start date (midnight, 12:00 AM) and the second click sets the end date (end of day, 11:59:59.999 PM). Hovering after the first click previews the range. Clicking on a new date when a range is already set restarts selection from scratch.

The calendar popover always renders via a portal above any modal dialog backdrop.

```tsx
import { DatePicker, type DatePickerValue } from "@clickyduck/solid-kit";
import { createSignal } from "solid-js";

// Single date
const [date, setDate] = createSignal<DatePickerValue>({ mode: "single", date: undefined });

<DatePicker mode="single" value={date()} onChange={setDate} />;

// Date range
const [range, setRange] = createSignal<DatePickerValue>({ mode: "range", from: undefined, to: undefined });

<DatePicker mode="range" value={range()} onChange={setRange} />;
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

### Divider

Horizontal rule for separating content regions.

**Exports:** `Divider`

Extends all native `<div>` HTML attributes plus `class`.

```tsx
import { Divider } from "@clickyduck/solid-kit";

<Divider />;
```

---

### Dropdown

Accessible select-style dropdown with optional search.

**Exports:** `Dropdown`, `DropdownValue`, `DropdownTrigger`, `DropdownIconTrigger`, `DropdownContent`, `DropdownLabel`, `DropdownItem`, `DropdownSeparator`

**`Dropdown` (root) props:**

| Prop                  | Type                                                     | Default | Description                                                                 |
| --------------------- | -------------------------------------------------------- | ------- | --------------------------------------------------------------------------- |
| `options`             | `string[]`                                               | —       | List of option values (required)                                            |
| `value`               | `string`                                                 | —       | Controlled selected value (single-select)                                   |
| `onChange`            | `(value: string \| undefined) => void`                   | —       | Called on selection change (single-select); menu closes after each pick     |
| `multiSelect`         | `boolean`                                                | —       | Enables multi-select mode; menu stays open, selected items show a checkmark |
| `multiSelectValue`    | `string[]`                                               | —       | Initial selected values (multi-select); treated as uncontrolled after mount |
| `onMultiSelectChange` | `(values: string[]) => void`                             | —       | Called when the selection array changes (multi-select)                      |
| `disabled`            | `boolean`                                                | —       | Disables the trigger                                                        |
| `searchable`          | `boolean`                                                | —       | Adds a filter input inside the menu                                         |
| `itemComponent`       | `(props: { item: { rawValue: string } }) => JSX.Element` | —       | Custom item renderer                                                        |
| `menuClass`           | `string`                                                 | —       | Extra classes on the menu surface                                           |
| `menuFullWidth`       | `boolean`                                                | `true`  | Menu width matches trigger width                                            |
| `initialOpen`         | `boolean`                                                | —       | Open on first render                                                        |

All menus render via a portal above any modal dialog backdrop.

**`DropdownContent` extra props:**

| Prop                 | Type                | Default   | Description             |
| -------------------- | ------------------- | --------- | ----------------------- |
| `xDirection`         | `"left" \| "right"` | `"right"` | Horizontal opening side |
| `yDirection`         | `"up" \| "down"`    | `"down"`  | Vertical opening side   |
| `wrapChildrenInList` | `boolean`           | `true`    | Wrap items in `<ul>`    |

**`DropdownItem` extra props:**

| Prop            | Type                    | Default | Description                                                            |
| --------------- | ----------------------- | ------- | ---------------------------------------------------------------------- |
| `item`          | `{ rawValue: string }`  | —       | Item data                                                              |
| `disabled`      | `boolean`               | —       | Disables this item                                                     |
| `selected`      | `boolean`               | —       | Marks item as selected                                                 |
| `closeOnSelect` | `boolean`               | `true`  | Close menu when item is clicked                                        |
| `icon`          | `string \| JSX.Element` | —       | Material Symbols name, img, or element; always placed before the label |

```tsx
import { Dropdown, DropdownTrigger, DropdownValue } from "@clickyduck/solid-kit";
import { createSignal } from "solid-js";

// Single-select — menu closes after each pick
const [selected, setSelected] = createSignal<string>();
<Dropdown options={["Option A", "Option B", "Option C"]} value={selected()} onChange={setSelected} searchable>
  <DropdownTrigger>{selected() ?? "Choose…"}</DropdownTrigger>
</Dropdown>;

// Multi-select — menu stays open; selected items are checked
const [tags, setTags] = createSignal<string[]>([]);
<Dropdown options={["A", "B", "C"]} multiSelect multiSelectValue={tags()} onMultiSelectChange={setTags}>
  <DropdownTrigger>
    <DropdownValue>{tags().length > 0 ? tags().join(", ") : "Select tags"}</DropdownValue>
  </DropdownTrigger>
</Dropdown>;
```

---

### EmptyState

Centered placeholder for empty lists or zero-data views.

**Exports:** `EmptyState`

| Prop      | Type                    | Description                                        |
| --------- | ----------------------- | -------------------------------------------------- |
| `icon`    | `string \| JSX.Element` | Material Symbols name or an img/element (required) |
| `title`   | `string`                | Heading text (required)                            |
| `message` | `string`                | Body text (required)                               |
| `class`   | `string`                | Extra CSS classes                                  |

```tsx
import { EmptyState } from "@clickyduck/solid-kit";

<EmptyState icon="inbox" title="No results" message="Try a different search." />;
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

**Exports:** `HeaderLayout`, `HeaderLayoutProperties` (type)

| Prop           | Type          | Description                                                                          |
| -------------- | ------------- | ------------------------------------------------------------------------------------ |
| `title`        | `string`      | Page title; component renders when `title`, `titleElement`, or `children` is present |
| `titleElement` | `JSX.Element` | Replaces the default `<h2>` title element                                            |
| `back`         | `JSX.Element` | Back link or button rendered to the left                                             |
| `children`     | `JSX.Element` | Actions rendered on the right side                                                   |
| `class`        | `string`      | Extra CSS classes                                                                    |

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

| Prop      | Type                                        | Default   | Description                             |
| --------- | ------------------------------------------- | --------- | --------------------------------------- |
| `icon`    | `string \| JSX.Element`                     | —         | Material Symbols name or an img/element |
| `variant` | `"solid" \| "outline" \| "ghost" \| "link"` | `"solid"` | Visual style                            |
| `class`   | `string`                                    | —         | Extra CSS classes                       |

Size is responsive: `large` on mobile (≤767 px), `default` on desktop.

```tsx
import { IconButton } from "@clickyduck/solid-kit";

<IconButton icon="close" variant="ghost" aria-label="Close" />;
```

---

### Icons

Material Symbols renderer powered by the [Material Symbols](https://fonts.google.com/icons) rounded set (filled is enabled via `FILL` variation).

**Exports:** `Icon`, `IconGlyphProperties` (type), `IconComponent` (type)

The `material-symbols/rounded.css` stylesheet is requested lazily on first use. Icons render by ligature name (the text content), so you pass the icon name string directly.

**`Icon` props:**

| Prop     | Type      | Default | Description                                                       |
| -------- | --------- | ------- | ----------------------------------------------------------------- |
| `name`   | `string`  | —       | Material Symbols slug, e.g. `"account_balance_wallet"` (required) |
| `size`   | `number`  | —       | Sets both `width` and `height`                                    |
| `filled` | `boolean` | `true`  | When `false`, uses the rounded outline variant (`FILL` = 0)       |
| `class`  | `string`  | —       | Extra CSS classes                                                 |

All standard `<span>` props are also forwarded.

```tsx
import { Icon } from "@clickyduck/solid-kit";

<Icon name="account_balance_wallet" size={20} />;
```

---

### Input

Styled text input with optional leading icon and trailing text.

**Exports:** `Input`, `InputProperties` (type)

Extends all native `<input>` HTML attributes.

| Prop           | Type                    | Description                                                |
| -------------- | ----------------------- | ---------------------------------------------------------- |
| `icon`         | `string \| JSX.Element` | Material Symbols name or an img/element for a leading icon |
| `trailingText` | `string`                | Right-side label (e.g. a unit or currency symbol)          |
| `currency`     | `boolean`               | Indian currency formatting: comma grouping, max 2 decimals |
| `class`        | `string`                | Extra CSS classes                                          |

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
import { HeaderLayout, LeftPanelLayout, MainLayout, PageHeader, PageLayout, PageSection, RightPanelLayout } from "@clickyduck/solid-kit";

<MainLayout>
  <HeaderLayout title="Workspace" description="Overview">
    {/* actions */}
  </HeaderLayout>

  <LeftPanelLayout collapsed={false} navigationDocument={navigationDocument} />

  <PageLayout>
    <PageHeader title="Dashboard" />
    <PageSection>{/* page content */}</PageSection>
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

**Exports:** `LeftPanelLayout`, `LeftPanelLayoutNavigationDocumentJson`, `LeftPanelLayoutNavigationGroupJson`, `LeftPanelLayoutNavigationItemJson`, `LeftPanelLayoutProperties` (type)

**`LeftPanelLayout` props:**

| Prop                  | Type                                    | Default                                 | Description                                                                                           |
| --------------------- | --------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `collapsed`           | `boolean`                               | `navigationDocument.collapsed ?? false` | When `true`, shows icon-only mode; omit to defer to the JSON document's `collapsed` field             |
| `navigationDocument`  | `LeftPanelLayoutNavigationDocumentJson` | —                                       | Navigation tree configuration (required)                                                              |
| `onOpenChange`        | `(isPanelOpen: boolean) => void`        | —                                       | Fires when open state changes; use `false` to react to close (nav link, swipe, or parent `collapsed`) |
| `scrim`               | `boolean`                               | `true`                                  | Show backdrop scrim on mobile when panel is open                                                      |
| `scrimZIndexClass`    | `string`                                | —                                       | Tailwind `z-*` class for the scrim                                                                    |
| `panelZIndexClass`    | `string`                                | —                                       | Tailwind `z-*` class for the panel                                                                    |
| `expandedWidthClass`  | `string`                                | `"md:w-64"`                             | Tailwind width class for the expanded panel                                                           |
| `collapsedWidthClass` | `string`                                | `"md:w-16"`                             | Tailwind width class for the icon-only panel                                                          |
| `anchorComponent`     | `Component<Record<string, unknown>>`    | —                                       | Custom link/anchor component replacing the default `<a>`                                              |

**`LeftPanelLayoutNavigationDocumentJson`** — root navigation config:

```ts
{
  groups: LeftPanelLayoutNavigationGroupJson[];
  collapsed?: boolean; // default: false
}
```

**`LeftPanelLayoutNavigationGroupJson`** — a collapsible nav group:

| Field                               | Type                                  | Description                                                                 |
| ----------------------------------- | ------------------------------------- | --------------------------------------------------------------------------- |
| `groupLabel`                        | `string`                              | Group heading                                                               |
| `navigationGroupIdentifier`         | `string`                              | Unique key (optional)                                                       |
| `collapsibleNavigationGroup`        | `boolean`                             | Whether the group can be toggled; defaults to `true` (opt out with `false`) |
| `navigationGroupInitiallyCollapsed` | `boolean`                             | Start collapsed                                                             |
| `items`                             | `LeftPanelLayoutNavigationItemJson[]` | Nav items in this group                                                     |

**`LeftPanelLayoutNavigationItemJson`** — a single nav link:

| Field               | Type      | Description                               |
| ------------------- | --------- | ----------------------------------------- |
| `href`              | `string`  | Link URL                                  |
| `label`             | `string`  | Nav item text                             |
| `icon`              | `string`  | Material Symbols name, e.g. `"dashboard"` |
| `matchRouteExactly` | `boolean` | Use exact path match for active highlight |

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

**Exports:** `MetricCard`, `MetricCardProperties` (type)

| Prop        | Type                                                   | Description                                                               |
| ----------- | ------------------------------------------------------ | ------------------------------------------------------------------------- |
| `title`     | `string`                                               | Metric label (rendered uppercase, required)                               |
| `accent`    | `"emerald" \| "blue" \| "amber" \| "violet" \| "rose"` | Left-border and icon box color (required)                                 |
| `icon`      | `string \| JSX.Element`                                | Material Symbols name or an img/element for the top-right icon (required) |
| `value`     | `string`                                               | Large primary value (required)                                            |
| `loading`   | `boolean`                                              | Shows an em dash instead of `value`                                       |
| `linkHref`  | `string`                                               | Makes the footer a link                                                   |
| `linkLabel` | `string`                                               | Link text                                                                 |
| `class`     | `string`                                               | Extra CSS classes                                                         |

```tsx
import { MetricCard } from "@clickyduck/solid-kit";

<MetricCard title="Revenue" accent="emerald" icon="currency_rupee" value="₹1,24,000" linkHref="/revenue" linkLabel="View report" />;
```

---

### PageLayout

Main application page column content wrapper.

**Exports:** `PageLayout`, `PageHeader`, `PageSection`

**`PageLayout` props:**

| Prop       | Type          | Description       |
| ---------- | ------------- | ----------------- |
| `children` | `JSX.Element` | Page content      |
| `class`    | `string`      | Extra CSS classes |

**`PageHeader` props:**

| Prop          | Type          | Description                                      |
| ------------- | ------------- | ------------------------------------------------ |
| `title`       | `string`      | Page heading; component returns `null` if absent |
| `caption`     | `string`      | Optional subtitle below the title                |
| `back`        | `JSX.Element` | Back link or button rendered above the title     |
| `sidebuttons` | `JSX.Element` | Actions rendered on the right side               |
| `class`       | `string`      | Extra CSS classes                                |

**`PageSection` props:**

| Prop          | Type          | Description                        |
| ------------- | ------------- | ---------------------------------- |
| `title`       | `string`      | Section heading                    |
| `caption`     | `string`      | Optional subtitle below the title  |
| `sidebuttons` | `JSX.Element` | Actions rendered on the right side |
| `children`    | `JSX.Element` | Section content                    |
| `class`       | `string`      | Extra CSS classes                  |

---

### RightPanelLayout

Responsive detail/drawer panel that slides in from the right.

**Exports:** `RightPanelLayout`

**`RightPanelLayout` props:**

| Prop             | Type                              | Default                                  | Description                                                                                                                    |
| ---------------- | --------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `open`           | `boolean`                         | opens on mount                           | Controlled open state; when omitted the panel opens on mount (backwards compatible)                                            |
| `title`          | `JSX.Element`                     | —                                        | Panel heading content (required)                                                                                               |
| `subtitle`       | `JSX.Element`                     | —                                        | Optional secondary header line                                                                                                 |
| `headerActions`  | `JSX.Element`                     | —                                        | Extra elements in the header row                                                                                               |
| `children`       | `JSX.Element`                     | —                                        | Scrollable body content (required)                                                                                             |
| `footer`         | `JSX.Element`                     | —                                        | Sticky footer slot                                                                                                             |
| `onBeginClose`   | `() => void`                      | —                                        | Called immediately when close transition begins, before `onOpenChange(false)`                                                  |
| `onOpenChange`   | `(isPanelOpen: boolean) => void`  | —                                        | Required. `true` when the open transition runs; `false` after the close animation finishes (200ms), for unmounting with `Show` |
| `closeAriaLabel` | `string`                          | —                                        | Accessible label for the close button (required)                                                                               |
| `topOffset`      | `string`                          | `"var(--solid-kit-header-height, 4rem)"` | Top offset for the mobile overlay variant                                                                                      |
| `panelProps`     | `JSX.HTMLAttributes<HTMLElement>` | —                                        | Extra props applied to the `<aside>` element (e.g. drag/drop handlers); `class` is merged                                      |
| `variant`        | `"grid" \| "overlay"`             | `"grid"`                                 | `grid`: sibling inside `MainLayout`; `overlay`: fixed right-panel overlay                                                      |

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

| Field                    | Type                    | Description                                      |
| ------------------------ | ----------------------- | ------------------------------------------------ |
| `tabValue`               | `TabValue`              | Unique tab identifier                            |
| `label`                  | `string`                | Display label                                    |
| `tabElementIdentifier`   | `string`                | DOM id for the tab button                        |
| `panelElementIdentifier` | `string`                | DOM id for the tab panel                         |
| `icon`                   | `string \| JSX.Element` | Optional Material Symbols name or an img/element |

**`Tabs` props:**

| Prop             | Type                                 | Description                             |
| ---------------- | ------------------------------------ | --------------------------------------- |
| `tabDefinitions` | `readonly TabDefinition<TabValue>[]` | Tab configuration (required)            |
| `activeTabValue` | `Accessor<TabValue>`                 | Currently active tab (required)         |
| `onTabSelect`    | `(value: TabValue) => void`          | Called when a tab is clicked (required) |
| `isDisabled`     | `Accessor<boolean>`                  | Disables all tabs                       |
| `class`          | `string`                             | Extra classes on the root element       |

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

### Text

Typographic component with five size steps and semantic color, weight, style, and icon options.

**Exports:** `Text`, `TextSize`, `TextProperties`, `TextColor`, `TextWeight`

`Text` wraps `createTypography`. All sizes default to `"default"` color.

**`TextSize` values:** `"0"` (4xl, bold), `"1"` (2xl, semibold), `"2"` (base, medium — default), `"3"` (sm, medium), `"4"` (xs, medium).

| Prop           | Type                                                                                                            | Default      | Description                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------- |
| `size`         | `"0" \| "1" \| "2" \| "3" \| "4"`                                                                               | `"2"`        | Size step                                         |
| `color`        | `"default" \| "inherit" \| "muted" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger" \| "info"` | `"default"`  | Semantic color                                    |
| `weight`       | `"thin" \| "normal" \| "medium" \| "semibold" \| "bold"`                                                        | size default | Font weight                                       |
| `italic`       | `boolean`                                                                                                       | `false`      | Italic style                                      |
| `underline`    | `boolean`                                                                                                       | `false`      | Underline decoration                              |
| `opacity`      | `number`                                                                                                        | —            | 0–100 percent opacity                             |
| `icon`         | `string \| JSX.Element`                                                                                         | —            | Material Symbols name or an img/element           |
| `iconPosition` | `"start" \| "end"`                                                                                              | `"start"`    | Icon placement                                    |
| `maxLength`    | `number`                                                                                                        | —            | Truncates string children with `…` at this length |
| `class`        | `string`                                                                                                        | —            | Extra CSS classes                                 |

```tsx
import { Text } from "@clickyduck/solid-kit";

<Text size="1" color="primary">Dashboard</Text>
<Text size="3" color="muted" weight="normal">Last updated 2 hours ago</Text>
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

**Exports:** `Toast`, `Toaster`, `addToast`, `removeToast`, `toastStore`, `ToastData` (type)

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

**`Toaster` props:**

| Prop    | Type     | Description       |
| ------- | -------- | ----------------- |
| `class` | `string` | Extra CSS classes |

Renders a fixed bottom-center region (bottom-right on `sm` and wider).

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

Radio or checkbox toggle card group. Selected options show a blue border, background fill, primary-colored label, and a check icon. Unselected options respond to hover with a subtle background change.

**Exports:** `ToggleGroup`, `ToggleGroupOption`, `ToggleGroupProperties` (type)

**`ToggleGroupOption` shape:**

| Field         | Type      | Description              |
| ------------- | --------- | ------------------------ |
| `value`       | `string`  | Option value (required)  |
| `label`       | `string`  | Display label (required) |
| `description` | `string`  | Optional secondary text  |
| `disabled`    | `boolean` | Disables this option     |

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

**Exports:** `Upload`, `UploadProperties` (type)

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

### `themedScrollControlClassName`

Pre-built Tailwind class string for themed scrollbars (thin, light/dark aware) in WebKit, Chromium, and Firefox. Use alongside `overflow-auto` and `min-h-0` inside flex layouts.

```ts
import { themedScrollControlClassName } from "@clickyduck/solid-kit";

<div class={`overflow-auto min-h-0 ${themedScrollControlClassName}`}>…</div>
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

# Lint (TypeScript + ESLint, zero warnings)
npm run lint

# Bump version (shorthand scripts — equivalent to npm version patch/minor/major)
npm run patch
npm run minor
npm run major
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
| **`npm run release`** | Runs **`npm run format`**, **`npm run lint`**, then **`prepublishOnly`** (**`npm run typecheck`** then **`npm run build`**), then **`npm publish`** with **`GITHUB_TOKEN`** loaded from **`.env`** via **`dotenv-cli`**.                       |

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
npm run patch   # 0.1.0 → 0.1.1  (bug fixes, compatible changes)
npm run minor   # 0.1.0 → 0.2.0  (new features, backward compatible)
npm run major   # 0.1.0 → 1.0.0  (breaking changes)
```

These are shorthand scripts defined in **`package.json`** and are equivalent to `npm version patch`, `npm version minor`, and `npm version major` respectively.

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

1. Runs **`npm run format`** (Prettier) then **`npm run lint`** (TypeScript + ESLint with zero warnings).
2. **`prepublishOnly`**: runs **`npm run typecheck`** then **`npm run build`** so the tarball matches current sources.
3. **`npm publish`** to the registry configured in **`publishConfig`** (GitHub Packages for this package), using **`GITHUB_TOKEN`** from **`.env`** when you use **`dotenv-cli`** as in the script.

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

Install the library and all peer dependencies:

```bash
npm install @clickyduck/solid-kit solid-js tailwindcss clsx tailwind-merge material-symbols
```

**Peer dependencies and why you need them:**

| Package            | Why                                                                               |
| ------------------ | --------------------------------------------------------------------------------- |
| `solid-js`         | SolidJS runtime                                                                   |
| `tailwindcss`      | CSS utility framework                                                             |
| `clsx`             | Class name helper (used by `mergeClasses`)                                        |
| `tailwind-merge`   | Tailwind class conflict resolution (used by `mergeClasses`)                       |
| `material-symbols` | Material Symbols variable font — loaded on demand by `<Icon>` and any `icon` prop |

### 4. Usage

Import from the main entry or directly from a component path (better tree-shaking):

```tsx
// Main entry — includes everything
import { Button, Icon } from "@clickyduck/solid-kit";

// Per-component entry — only bundles what you import
import { Button } from "@clickyduck/solid-kit/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@clickyduck/solid-kit/dialog";
import { Icon } from "@clickyduck/solid-kit/icons";
```

Available sub-paths: `badge`, `button`, `card`, `date-picker`, `dialog`, `divider`, `dropdown`, `empty-state`, `field`, `header-layout`, `icon-button`, `icons`, `input`, `left-panel-layout`, `loading`, `main-layout`, `page-layout`, `right-panel-layout`, `section-heading`, `spinner`, `table`, `tabs`, `textarea`, `toast`, `toggle-group`, `typography`, `upload`, `utilities`.

```tsx
import { Button } from "@clickyduck/solid-kit/button";

function App() {
  return <Button>Click me</Button>;
}
```

## License

MIT
