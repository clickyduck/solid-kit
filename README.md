# @clickyduck/solid-kit

A SolidJS component library built with Tailwind CSS, published privately via GitHub Packages. Import UI pieces from the main entry or per-component sub-paths for better tree-shaking.

> **Text rendering:** Use the [`Text`](#text) component for **all** text you render — labels, headings, captions, body copy, helper text. Every typographic decision (size, color, weight, alignment, casing, truncation, semantic element) is a prop on `Text`, so you should never reach for raw `<p>`/`<span>`/`<h*>` tags or a `class` to style text. For text that navigates somewhere, use [`Link`](#link) instead of a raw `<a>` — it shares `Text`'s typographic props but renders an anchor. Components in this library already render their own internal text; the rule applies to the content **you** pass in (children, slots) and to any markup you build around these components.

> **Dashboard / app-shell layouts:** Dashboard-like screens must be composed with the app-shell layout primitives — [`MainLayout`](#mainlayout) (the full-viewport grid) wrapping [`HeaderLayout`](#headerlayout), [`LeftPanelLayout`](#leftpanellayout), [`PageLayout`](#pagelayout), and the optional [`RightPanelLayout`](#rightpanellayout). See [MainLayout → Composing the full app shell](#mainlayout) for the grid diagram and complete examples.

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

## Theme

The components are written against Tailwind's `gray-*` scale. In **Tailwind CSS v4** the
default `gray` palette is blue-tinted (it sits close to `slate`), so an unmodified dark
theme reads as blue-charcoal. The library ships a CSS partial that remaps the whole `gray`
scale to the hueless `neutral` values. Import it once in your Tailwind entry, right after
`@import "tailwindcss"`, and every `dark:bg-gray-*` in solid-kit renders as a true neutral
gray:

```css
@import "tailwindcss";
@import "@clickyduck/solid-kit/theme.css";
@source "./node_modules/@clickyduck/solid-kit/public/**/*.{js,cjs}";
```

Prefer a warmer or cooler charcoal? Skip the partial and define your own `@theme` block
overriding `--color-gray-*` — for example map them to `--color-zinc-*` (barely warm) or
keep Tailwind's default `gray` for the original blue cast.

---

## Components

- [ArrayInput](#arrayinput)
- [Badge](#badge)
- [Button](#button)
- [BackgroundCard](#backgroundcard)
- [CenteredCard](#centeredcard)
- [DataCard](#datacard)
- [DatePicker](#datepicker)
- [Dialog](#dialog)
- [Divider](#divider)
- [Dropdown](#dropdown)
- [EmptyState](#emptystate)
- [Field](#field)
- [HeaderLayout](#headerlayout)
- [FooterLayout](#footerlayout)
- [SectionHeading](#sectionheading)
- [IconButton](#iconbutton)
- [Icons](#icons)
- [Input](#input)
- [MainLayout](#mainlayout)
- [LeftPanelLayout](#leftpanellayout)
- [Link](#link)
- [PageLayout](#pagelayout)
- [Loading](#loading)
- [MetricCard](#metriccard)
- [RightPanelLayout](#rightpanellayout)
- [Spinner](#spinner)
- [SwipeButton](#swipebutton)
- [Table](#table)
- [Tabs](#tabs)
- [Text](#text)
- [Textarea](#textarea)
- [TimePicker](#timepicker)
- [Toast](#toast)
- [ToggleGroup](#togglegroup)
- [CardToggleGroup](#cardtogglegroup)
- [Upload](#upload)

---

### ArrayInput

Edits a list of short free-text string values as removable chips. Type a value and press **Enter** or **comma** to commit it as a chip; click a chip's ✕ or press **Backspace** on the empty field to remove the last one. Values are trimmed and deduplicated case-insensitively. Controlled — holds no value state of its own, only the in-progress text. Renders committed values with [`Badge`](#badge).

**Exports:** `ArrayInput`, `ArrayInputProperties` (type)

| Prop          | Type                       | Default     | Description                                                      |
| ------------- | -------------------------- | ----------- | ---------------------------------------------------------------- |
| `value`       | `string[]`                 | —           | Committed values (required)                                      |
| `onChange`    | `(next: string[]) => void` | —           | Called with the next array on every add/remove (required)        |
| `placeholder` | `string`                   | —           | Placeholder for the text field                                   |
| `disabled`    | `boolean`                  | `false`     | Disables input and removal                                       |
| `maximum`     | `number`                   | —           | Reject commits past this many values; omit for unbounded         |
| `color`       | `Color`                    | `"neutral"` | Chip colour, forwarded to `Badge`                                |
| `class`       | `string`                   | —           | Extra classes on the container                                   |
| `id`          | `string`                   | —           | `id` on the inner text field (e.g. to pair with a `Field` label) |

```tsx
<ArrayInput value={tags()} onChange={setTags} placeholder="Add a tag…" maximum={50} />
```

---

### Badge

Chip/tag with optional icon and remove button.

**Exports:** `Badge`, `BadgeVariant` (type), `BadgeProperties` (type), `Color` (type)

| Prop       | Type                                                           | Default     | Description                             |
| ---------- | -------------------------------------------------------------- | ----------- | --------------------------------------- |
| `children` | `JSX.Element`                                                  | —           | Badge label (required)                  |
| `variant`  | `"solid" \| "outline"`                                         | `"solid"`   | Visual style (`BadgeVariant`)           |
| `color`    | `"primary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color scheme (the shared `Color` token) |
| `icon`     | `string \| JSX.Element`                                        | —           | Material Symbols name or an img/element |
| `onRemove` | `() => void`                                                   | —           | Shows × button; called on click         |
| `class`    | `string`                                                       | —           | Extra CSS classes                       |

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

| Prop           | Type                              | Default     | Description                                                                                                      |
| -------------- | --------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `children`     | `JSX.Element`                     | —           | Button label                                                                                                     |
| `variant`      | `"solid" \| "outline" \| "ghost"` | `"solid"`   | Visual style                                                                                                     |
| `radius`       | `"default" \| "none"`             | `"default"` | Corner rounding. `"none"` squares the corners for a full-bleed action bar (e.g. a sticky bottom "View cart" bar) |
| `icon`         | `string \| JSX.Element`           | —           | Material Symbols name or an img/element                                                                          |
| `iconPosition` | `"start" \| "end"`                | `"start"`   | Icon placement relative to label (when `"end"`, the icon is pushed to the far right with `ml-auto`)              |
| `class`        | `string`                          | —           | Extra CSS classes                                                                                                |
| `disabled`     | `boolean`                         | —           | Native disabled attribute                                                                                        |
| `type`         | `"button" \| "submit" \| "reset"` | `"button"`  | Native type attribute (defaults to `"button"`)                                                                   |

Sized to match all other form controls (`h-10`, `text-sm`) via the shared `FORM_CONTROL_SIZE_CLASSES`. The `type` defaults to `"button"` so it will not submit a surrounding form unless you set `type="submit"`.

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

### CenteredCard

Full-viewport centred card, built for login and other focused single-action screens. Centres a [`BackgroundCard`](#backgroundcard) in the middle of the page with an optional icon tile, title, subtitle, and footer slots around the left-aligned body content (`children`).

**Exports:** `CenteredCard`, `CenteredCardProperties` (type)

| Prop           | Type                    | Description                                                                |
| -------------- | ----------------------- | -------------------------------------------------------------------------- |
| `children`     | `JSX.Element`           | Card body — typically the form fields and submit button (required)         |
| `title`        | `string`                | Heading rendered at the top of the card                                    |
| `subtitle`     | `string`                | Supporting line shown beneath the title                                    |
| `icon`         | `string \| JSX.Element` | Material Symbols name or an img/element shown in the badge above the title |
| `footer`       | `JSX.Element`           | Footer slot rendered below the body (e.g. a sign-up link)                  |
| `class`        | `string`                | Extra classes applied to the `BackgroundCard` surface                      |
| `wrapperClass` | `string`                | Extra classes applied to the full-height centring wrapper                  |

The component owns the full-viewport wrapper (`min-h-dvh`), so render it as the whole screen — do not nest it inside the app shell layout primitives.

```tsx
import { Button, CenteredCard, Field, Input, Link, Text } from "@clickyduck/solid-kit";

<CenteredCard
  icon="lock"
  title="Welcome back"
  subtitle="Sign in to continue"
  footer={
    <Text size="small" color="muted">
      New here?{" "}
      <Link href="/sign-up" weight="medium">
        Create an account
      </Link>
    </Text>
  }
>
  <Field label="Email" for="email">
    <Input id="email" type="email" icon="mail" placeholder="you@example.com" />
  </Field>
  <Field label="Password" for="password">
    <Input id="password" type="password" icon="lock" placeholder="••••••••" />
  </Field>
  <Button class="w-full" type="submit">
    Sign in
  </Button>
</CenteredCard>;
```

---

### DataCard

Ticket-style data surface card. Clickable (renders as a `<button>` with hover affordance) or static (renders as a `<div>`). For selectable-card UIs (radio/checkbox semantics), use [CardToggleGroup](#cardtogglegroup) instead.

**Exports:** `DataCard`

| Prop        | Type      | Description                                                                              |
| ----------- | --------- | ---------------------------------------------------------------------------------------- |
| `clickable` | `boolean` | Enables hover/cursor affordance + renders as a `<button>`. Implied when `onClick` is set |
| `class`     | `string`  | Extra CSS classes                                                                        |

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

### TimePicker

Inline row of three dropdowns — hour, minute, and AM/PM — for picking a time of day. Controlled and holds no state of its own. The dropdowns display 12-hour with an AM/PM period, but the value is a 24-hour `"HH:MM"` string, matching the native `<input type="time">`. Built from [`Dropdown`](#dropdown), so the hour/minute/period menus render via a portal above any modal dialog backdrop.

**Exports:** `TimePicker`, `TimePickerValue` (type)

| Prop       | Type                               | Default | Description                                                    |
| ---------- | ---------------------------------- | ------- | -------------------------------------------------------------- |
| `value`    | `TimePickerValue`                  | —       | Controlled value — a `"HH:MM"` string, or `undefined` if unset |
| `onChange` | `(value: TimePickerValue) => void` | —       | Called when the selection changes                              |
| `disabled` | `boolean`                          | —       | Disables all three dropdowns                                   |
| `id`       | `string`                           | —       | `id` on the root wrapper; pair with `<Field for="…">`          |
| `class`    | `string`                           | —       | Extra CSS classes on the root wrapper                          |

**`TimePickerValue`** is a 24-hour time string or `undefined`:

```ts
type TimePickerValue = string | undefined; // e.g. "09:30", "14:05"
```

Until all three fields are chosen the value is `undefined`. When the first field is picked from an empty state, the other two default (to `12:00 AM`) so `onChange` immediately fires a complete `"HH:MM"` rather than a partial one. The minute list is searchable — type digits to jump to a minute. Hour and period render placeholders (`HH` / `MM` / `AM`) while unset.

```tsx
import { TimePicker, type TimePickerValue } from "@clickyduck/solid-kit";
import { createSignal } from "solid-js";

const [time, setTime] = createSignal<TimePickerValue>(undefined);

<TimePicker value={time()} onChange={setTime} />;

// Pre-filled — 09:30
const [meeting, setMeeting] = createSignal<TimePickerValue>("09:30");

<TimePicker value={meeting()} onChange={setMeeting} />;
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

**Exports:** `Dropdown`, `DropdownValue`, `DropdownTrigger`, `DropdownIconTrigger`, `DropdownContent`, `DropdownItem`, `DropdownSeparator`

**`Dropdown` (root) props:**

| Prop                  | Type                                                     | Default   | Description                                                                                                                                                                              |
| --------------------- | -------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`             | `string[]`                                               | —         | List of option values (required)                                                                                                                                                         |
| `value`               | `string`                                                 | —         | Controlled selected value (single-select)                                                                                                                                                |
| `onChange`            | `(value: string \| undefined) => void`                   | —         | Called on selection change (single-select); menu closes after each pick                                                                                                                  |
| `multiSelect`         | `boolean`                                                | —         | Enables multi-select mode; menu stays open, selected items show a checkmark                                                                                                              |
| `multiSelectValue`    | `string[]`                                               | —         | Initial selected values (multi-select); treated as uncontrolled after mount                                                                                                              |
| `onMultiSelectChange` | `(values: string[]) => void`                             | —         | Called when the selection array changes (multi-select)                                                                                                                                   |
| `disabled`            | `boolean`                                                | —         | Disables the trigger                                                                                                                                                                     |
| `searchable`          | `boolean`                                                | —         | Adds a filter input inside the menu                                                                                                                                                      |
| `searchMode`          | `"local" \| "remote"`                                    | `"local"` | `local`: client-side substring filter over `options`. `remote`: parent owns filtering — `options` is passed through unchanged and the parent updates it in response to `onSearchChange`. |
| `onSearchChange`      | `(query: string) => void`                                | —         | Called when the search input changes, debounced by `searchDebounceMs`. Fires in both modes when set; primary signal for remote search.                                                   |
| `searchDebounceMs`    | `number`                                                 | `300`     | Debounce delay (ms) applied to `onSearchChange`. Set to `0` to fire synchronously.                                                                                                       |
| `itemComponent`       | `(props: { item: { rawValue: string } }) => JSX.Element` | —         | Custom item renderer                                                                                                                                                                     |
| `menuClass`           | `string`                                                 | —         | Extra classes on the menu surface                                                                                                                                                        |
| `menuFullWidth`       | `boolean`                                                | `true`    | Menu width matches trigger width                                                                                                                                                         |
| `initialOpen`         | `boolean`                                                | —         | Open on first render                                                                                                                                                                     |

All menus render via a portal above any modal dialog backdrop. Opening direction is chosen automatically by measuring the trigger against the viewport — the menu flips upward or leftward when it would otherwise overflow.

**`DropdownContent` extra props:**

| Prop                 | Type      | Default | Description          |
| -------------------- | --------- | ------- | -------------------- |
| `wrapChildrenInList` | `boolean` | `true`  | Wrap items in `<ul>` |

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

// Remote search — parent fetches matching options as the user types
const [remoteOptions, setRemoteOptions] = createSignal<string[]>([]);
const [picked, setPicked] = createSignal<string>();
<Dropdown
  options={remoteOptions()}
  value={picked()}
  onChange={setPicked}
  searchable
  searchMode="remote"
  searchDebounceMs={300}
  onSearchChange={async (query) => {
    const results = await fetch(`/api/search?q=${encodeURIComponent(query)}`).then((r) => r.json());
    setRemoteOptions(results);
  }}
>
  <DropdownTrigger>{picked() ?? "Search…"}</DropdownTrigger>
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

Page-level header row with title, back link, and actions slot.

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

<HeaderLayout title="Users">
  <Button>Invite</Button>
</HeaderLayout>;
```

---

### FooterLayout

Fixed bottom action bar — the counterpart to [`HeaderLayout`](#headerlayout). Pins a full-width surface to the bottom of the viewport with a hairline top border and the same translucent, blurred chrome as `HeaderLayout`, so page content scrolls underneath it. Built for persistent primary actions on mobile-first screens (cart total + checkout, a [`SwipeButton`](#swipebutton) "swipe to pay", form save bars).

**Exports:** `FooterLayout`, `FooterLayoutProperties` (type)

| Prop          | Type          | Default  | Description                                                        |
| ------------- | ------------- | -------- | ------------------------------------------------------------------ |
| `children`    | `JSX.Element` | —        | Bar content; the component only renders when `children` is present |
| `zIndexClass` | `string`      | `"z-20"` | Tailwind z-index for the bar (above page content, below modals)    |
| `class`       | `string`      | —        | Extra CSS classes for inner spacing or width constraints           |

It is not part of the [`MainLayout`](#mainlayout) grid; render it anywhere. Wrapping it in a `Portal` to `document.body` keeps it anchored to the viewport rather than a scroll container. Leave room at the bottom of the scrolling content (e.g. bottom padding) so the bar does not cover the last rows.

```tsx
import { Button, FooterLayout, Text } from "@clickyduck/solid-kit";
import { Portal } from "solid-js/web";

<Portal>
  <FooterLayout>
    <div class="flex items-center gap-3">
      <Text size="title" weight="bold" color="primary">
        $42.00
      </Text>
      <Button icon="shopping_cart_checkout" iconPosition="end" class="ml-auto">
        Place order
      </Button>
    </div>
  </FooterLayout>
</Portal>;
```

---

### SectionHeading

Standardized section heading (`<h3>`, body size, semibold, uppercase, tracked) — same size as body text but heavier and uppercase, so it reads as a label heading above content.

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

| Prop      | Type                              | Default   | Description                             |
| --------- | --------------------------------- | --------- | --------------------------------------- |
| `icon`    | `string \| JSX.Element`           | —         | Material Symbols name or an img/element |
| `variant` | `"solid" \| "outline" \| "ghost"` | `"solid"` | Visual style                            |
| `class`   | `string`                          | —         | Extra CSS classes                       |

Square (`h-10 w-10`), sized to match the sibling form controls via `FORM_CONTROL_ICON_BUTTON_SIZE_CLASSES`. The `type` defaults to `"button"`. Always pass an `aria-label` since the button has no text.

```tsx
import { IconButton } from "@clickyduck/solid-kit";

<IconButton icon="close" variant="ghost" aria-label="Close" />;
```

---

### Icons

Material Symbols renderer powered by the [Material Symbols](https://fonts.google.com/icons) rounded set. Icons are always rendered filled.

**Exports:** `Icon`, `IconColor` (type), `IconGlyphProperties` (type), `IconComponent` (type)

The `material-symbols/rounded.css` stylesheet is requested lazily on first use. Icons render by ligature name (the text content), so you pass the icon name string directly.

**`Icon` props:**

| Prop    | Type        | Default | Description                                                       |
| ------- | ----------- | ------- | ----------------------------------------------------------------- |
| `name`  | `string`    | —       | Material Symbols slug, e.g. `"account_balance_wallet"` (required) |
| `size`  | `number`    | —       | Sets both `width` and `height`                                    |
| `color` | `IconColor` | —       | Semantic color token                                              |
| `class` | `string`    | —       | Extra CSS classes                                                 |

**`IconColor` values:** `"default"` · `"inherit"` · `"muted"` · `"primary"` · `"secondary"` · `"success"` · `"warning"` · `"danger"` · `"info"`

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

#### Composing the full app shell

`MainLayout` is a full-viewport CSS grid (`h-dvh`) with four named areas: `header`, `left`, `main`, and `right`. Each layout component targets one area; place them as direct children in any order.

```
┌─────────────────────────────────────┐
│            HeaderLayout             │  ← grid-area: header
├──────────┬──────────────────────────┤
│          │                          │
│  Left    │       PageLayout         │  ← grid-area: main
│  Panel   │  (PageHeader + Sections) │
│ Layout   │                          │
│          ├──────────────────────────┤
│          │    RightPanelLayout      │  ← grid-area: right (optional)
└──────────┴──────────────────────────┘
    ↑ grid-area: left
```

**Minimal shell (header + nav + page):**

```tsx
import { Button, HeaderLayout, LeftPanelLayout, type LeftPanelLayoutNavigationDocumentJson, MainLayout, PageHeader, PageLayout, PageSection, Text } from "@clickyduck/solid-kit";
import { createSignal } from "solid-js";

const nav: LeftPanelLayoutNavigationDocumentJson = {
  groups: [
    {
      groupLabel: "Main",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
        { href: "/users", label: "Users", icon: "group" }
      ]
    }
  ]
};

export function App() {
  const [collapsed, setCollapsed] = createSignal(false);

  return (
    <MainLayout>
      {/* Top navigation bar */}
      <HeaderLayout title="My App">
        <Button variant="ghost" icon="notifications" />
      </HeaderLayout>

      {/* Left sidebar */}
      <LeftPanelLayout
        navigationDocument={nav}
        collapsed={collapsed()}
        onOpenChange={(open) => {
          if (!open) setCollapsed(true);
        }}
      />

      {/* Main content area */}
      <PageLayout>
        <PageHeader title="Dashboard" caption="Overview of your workspace" sidebuttons={<Button>New item</Button>} />
        <PageSection title="Recent activity">
          {/* All free-form text goes through <Text> */}
          <Text size="small" color="muted">
            Nothing happened yet.
          </Text>
        </PageSection>
      </PageLayout>
    </MainLayout>
  );
}
```

**With an optional right detail panel:**

```tsx
import { Button, HeaderLayout, LeftPanelLayout, type LeftPanelLayoutNavigationDocumentJson, MainLayout, PageHeader, PageLayout, PageSection, RightPanelLayout } from "@clickyduck/solid-kit";
import { Show, createSignal } from "solid-js";

export function AppWithPanel() {
  const [panelOpen, setPanelOpen] = createSignal(false);
  const [selectedId, setSelectedId] = createSignal<string>();

  const nav: LeftPanelLayoutNavigationDocumentJson = {
    groups: [/* … */]
  };

  return (
    <MainLayout>
      <HeaderLayout title="My App" />

      <LeftPanelLayout navigationDocument={nav} />

      <PageLayout>
        <PageHeader title="Items" />
        <PageSection>
          {/* Clicking a row opens the panel */}
          <Button
            variant="outline"
            onClick={() => {
              setSelectedId("123");
              setPanelOpen(true);
            }}
          >
            Open item
          </Button>
        </PageSection>
      </PageLayout>

      {/* Panel unmounts after its close animation finishes */}
      <Show when={panelOpen()}>
        <RightPanelLayout
          title={`Item ${selectedId()}`}
          closeAriaLabel="Close item details"
          onOpenChange={(open) => {
            if (!open) setPanelOpen(false);
          }}
          footer={<Button class="w-full">Save changes</Button>}
        >
          {/* detail content */}
        </RightPanelLayout>
      </Show>
    </MainLayout>
  );
}
```

**Key points:**

- `MainLayout` sets `--solid-kit-header-height: 4rem` as a CSS variable; `RightPanelLayout` uses it for its mobile top offset.
- `HeaderLayout` only renders when at least one of `title`, `titleElement`, or `children` is provided.
- `LeftPanelLayout` handles mobile (full-width overlay, swipe-to-close) and desktop (collapsible sidebar) automatically — no extra wiring needed.
- Wrap `RightPanelLayout` in `<Show>` and unmount it after `onOpenChange(false)` fires (the callback is called after the 200 ms close animation) to avoid keeping stale content in the tree.
- `PageLayout` scrolls independently; `RightPanelLayout`'s body also scrolls independently — no outer `overflow` wrapper needed.

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
| `anchorTag`           | `"A" \| "a"`                            | `"A"`                                   | Tag used for navigation links. `"A"` is `@solidjs/router`'s `<A>`; use `"a"` in non-router contexts.  |

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

### Link

Typographic link — the same typographic primitive as [`Text`](#text), but it renders an anchor. It shares `Text`'s size/color/weight/alignment/icon props so links match surrounding text exactly. **No underline** is applied (at rest or on hover); color (default `primary`) plus a subtle hover-opacity shift is the only affordance.

**Exports:** `Link`, `LinkProperties` (type), `LinkAnchorTag` (type)

Extends all native `<a>` HTML attributes (`href`, `target`, `rel`, …).

| Prop           | Type                                                                                                            | Default      | Description                                                                                                                      |
| -------------- | --------------------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `children`     | `JSX.Element`                                                                                                   | —            | Link label (required)                                                                                                            |
| `anchorTag`    | `"A" \| "a"`                                                                                                    | `"A"`        | `"A"` uses `@solidjs/router`'s client-side `<A>`; `"a"` is a plain anchor outside a router                                       |
| `size`         | `"display" \| "title" \| "body" \| "small" \| "caption"`                                                        | `"body"`     | Size step — identical scale to `Text` (see the [`TextSize` scale](#text)); match the size of the text the link sits in or beside |
| `color`        | `"default" \| "inherit" \| "muted" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger" \| "info"` | `"primary"`  | Semantic color — defaults to `primary` so links read as links                                                                    |
| `weight`       | `"thin" \| "normal" \| "medium" \| "semibold" \| "bold"`                                                        | size default | Font weight                                                                                                                      |
| `align`        | `"start" \| "center" \| "end"`                                                                                  | —            | Text alignment                                                                                                                   |
| `transform`    | `"none" \| "uppercase" \| "capitalize"`                                                                         | `"none"`     | Case transform                                                                                                                   |
| `display`      | `"flex" \| "block" \| "inline"`                                                                                 | `"inline"`   | Layout mode — `inline` (default) flows within text; `flex`/`block` for standalone rows                                           |
| `italic`       | `boolean`                                                                                                       | `false`      | Italic style                                                                                                                     |
| `truncate`     | `boolean`                                                                                                       | `false`      | Single-line CSS ellipsis truncation                                                                                              |
| `lineClamp`    | `number`                                                                                                        | —            | Clamp to N lines with an ellipsis (overrides `truncate`)                                                                         |
| `opacity`      | `number`                                                                                                        | —            | 0–100 percent opacity                                                                                                            |
| `icon`         | `string \| JSX.Element`                                                                                         | —            | Material Symbols name or an img/element                                                                                          |
| `iconPosition` | `"start" \| "end"`                                                                                              | `"start"`    | Icon placement                                                                                                                   |
| `maxLength`    | `number`                                                                                                        | —            | Truncates string children with `…` at this length                                                                                |
| `class`        | `string`                                                                                                        | —            | Extra CSS classes                                                                                                                |

`Link` has no `underline` prop (unlike `Text`) — links are intentionally not underlined. Use the `color` prop to distinguish them.

```tsx
import { Link } from "@clickyduck/solid-kit";

// Router link (default) — flows inline within a sentence
<Text>See the <Link href="/settings">settings page</Link> for details.</Text>

// Standalone link with a trailing icon
<Link href="/reports" size="small" weight="medium" icon="arrow_forward" iconPosition="end">
  View report
</Link>

// Plain anchor outside a router (e.g. an external URL)
<Link anchorTag="a" href="https://example.com" target="_blank" rel="noreferrer" color="primary">
  External docs
</Link>
```

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

| Prop        | Type                                                  | Description                                                                           |
| ----------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `title`     | `string`                                              | Metric label (rendered uppercase, required)                                           |
| `accent`    | `"emerald" \| "blue" \| "amber" \| "violet" \| "red"` | Left-border and icon box color (required)                                             |
| `icon`      | `string \| JSX.Element`                               | Material Symbols name or an img/element for the top-right icon (required)             |
| `value`     | `string`                                              | Large primary value (required)                                                        |
| `loading`   | `boolean`                                             | Shows an em dash instead of `value`                                                   |
| `linkHref`  | `string`                                              | Makes the footer a link                                                               |
| `linkLabel` | `string`                                              | Link text                                                                             |
| `anchorTag` | `"A" \| "a"`                                          | Tag for the link. `"A"` (default) uses `@solidjs/router`; use `"a"` outside a router. |
| `class`     | `string`                                              | Extra CSS classes                                                                     |

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

| Prop             | Type                              | Default                                  | Description                                                                                                                        |
| ---------------- | --------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `open`           | `boolean`                         | opens on mount                           | Controlled open state; when omitted the panel opens on mount (backwards compatible)                                                |
| `title`          | `JSX.Element`                     | —                                        | Panel heading content (required)                                                                                                   |
| `subtitle`       | `JSX.Element`                     | —                                        | Optional secondary header line                                                                                                     |
| `headerActions`  | `JSX.Element`                     | —                                        | Extra elements in the header row                                                                                                   |
| `children`       | `JSX.Element`                     | —                                        | Scrollable body content (required). The body scrolls independently and has built-in `px-4 py-3` padding — no extra wrapper needed. |
| `footer`         | `JSX.Element`                     | —                                        | Sticky footer slot                                                                                                                 |
| `onBeginClose`   | `() => void`                      | —                                        | Called immediately when close transition begins, before `onOpenChange(false)`                                                      |
| `onOpenChange`   | `(isPanelOpen: boolean) => void`  | —                                        | Required. `true` when the open transition runs; `false` after the close animation finishes (200ms), for unmounting with `Show`     |
| `closeAriaLabel` | `string`                          | —                                        | Accessible label for the close button (required)                                                                                   |
| `topOffset`      | `string`                          | `"var(--solid-kit-header-height, 4rem)"` | Top offset for the mobile overlay variant                                                                                          |
| `panelProps`     | `JSX.HTMLAttributes<HTMLElement>` | —                                        | Extra props applied to the `<aside>` element (e.g. drag/drop handlers); `class` is merged                                          |
| `variant`        | `"grid" \| "overlay"`             | `"grid"`                                 | `grid`: sibling inside `MainLayout`; `overlay`: fixed right-panel overlay                                                          |

On desktop the panel pushes the main area. On mobile it overlays full-screen with smooth entrance/exit transitions.

#### Recommended: drive the panel from the URL (create vs. update)

A `RightPanelLayout` that creates or edits a record should be opened from the
**query string**, not a private `open` signal, so the panel is deep-linkable, the
browser back button closes it, and the open state survives a refresh. Use one
convention across every panel in the app:

| Intent               | URL                  | Behaviour                                                                                           |
| -------------------- | -------------------- | --------------------------------------------------------------------------------------------------- |
| **Create new**       | `?create=true`       | Seed a blank draft, open the panel, submit with `POST`.                                             |
| **Open / edit one**  | `?id=<id>`           | Fetch the full record by id (list endpoints often return a subset), seed the draft, submit `PATCH`. |
| **Edit an open one** | `?id=<id>&edit=true` | Optional: open `?id=<id>` read-only (disabled fields) and flip to editable with `edit=true`.        |

Closing the panel clears these params (set them to `null`).

**One page owns one panel.** The params above don't name an entity, so let the
**route** decide which panel they mean — mount one panel per page (e.g. the
configuration panel only on `/configurations`, the run panel only on `/runs`).
Because the panel must be a direct child of [`MainLayout`](#mainlayout) (grid area
`right`), render it in the shell but gate it on `location.pathname`. Two panels
then never collide even though they share `?create=true`.

```tsx
import { MainLayout, RightPanelLayout } from "@clickyduck/solid-kit";
import { useLocation, useSearchParams } from "@solidjs/router";
import { type JSX, Show } from "solid-js";

function Shell(props: { children: JSX.Element }) {
  const [params, setParams] = useSearchParams();
  const location = useLocation();

  const recordId = () => (params.id ? Number(params.id) : null);
  const isCreating = () => params.create === "true";
  // This page (route) owns the "items" panel.
  const itemPanelOpen = () => location.pathname === "/items" && (isCreating() || recordId() !== null);

  const closePanel = () => setParams({ create: null, id: null, edit: null });

  return (
    <MainLayout>
      {/* …HeaderLayout / LeftPanelLayout / PageLayout… */}
      {/* Plain (un-keyed) Show: switching target while open is a prop change on
          the SAME instance, so the open animation does not replay. See
          "Animate on open/close, not on switch" below. */}
      <Show when={itemPanelOpen()}>
        <ItemPanel itemId={isCreating() ? null : recordId()} editing={isCreating() || params.edit === "true"} onClose={closePanel} />
      </Show>
    </MainLayout>
  );
}
```

The panel component fetches its own record (for edit), seeds a draft plus a clean
snapshot for dirty-tracking, and submits via `POST` (create) or `PATCH` (update,
with the id). Open it from a page by setting the params — e.g. a table row calls
`setParams({ id: String(row.id) })` and a "New" button calls
`setParams({ create: "true" })`.

#### Animate on open/close, not on switch

The panel should animate **only when opening from nothing or closing to nothing**.
When the user picks a _different_ item while it is already open, the content should
swap in place with no close/reopen flicker. Two rules make that work:

**1. Gate the panel on a plain, un-keyed `<Show>` (truthiness only).** Do **not**
key it on the id (`<Show keyed>`, `<Key>`, or `key={item.id}`) — a key change
forces a remount and replays the enter animation on every switch. With a plain
`<Show when={selectedItem()}>`, going A → B is a prop change on the same instance,
so the panel (whose animation is driven by mount/unmount, or by an explicit `open`
prop) stays open and only its content updates.

**2. Only ever close on "no selection".** Drive selection through one signal (or the
`?id=` param) and flip the panel closed solely when the selection goes away — never
as part of switching. The panel re-seeds itself from its reactive props (re-fetch +
re-seed when the id changes; reset to blank for create), so the parent never needs a
"reset before load" step.

```tsx
// Selection is the single source of truth; the panel reacts to it.
const selectedItem = () => itemForId(params.id);

<Show when={selectedItem()}>
  {/* NOT keyed — same instance across A → B */}
  <ItemPanel itemId={Number(params.id)} onClose={() => setParams({ id: null })} />
</Show>;
```

Inside the panel, re-seed on the id changing rather than once on mount, and don't
reset state on a same-id refetch (it would clobber edits):

```tsx
const [item] = createResource(() => props.itemId, fetchItem); // refetches on switch
const [seededForId, setSeededForId] = createSignal<number>();

createEffect(() => {
  const loaded = item();
  if (loaded && seededForId() !== loaded.id) {
    seedDraftFrom(loaded); // name, fields, a clean snapshot for dirty-tracking
    setSeededForId(loaded.id);
  }
});
```

**Pitfalls that re-trigger the animation:** keying the panel (`<Show keyed>` /
`key={id}`) → remount on every switch; calling the panel's "close" (`open=false`
or unmounting) on a selection _change_ rather than only on selection _cleared_ →
flicker; closing by setting `open=false` and clearing the item in the same tick —
clear the selection and let the close path own `open=false` so the exit animation
has a stable target.

Net: the panel animates on **none → selected** (open) and **selected → none**
(close); **selected → other** is a pure in-place content update.

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

### SwipeButton

Swipe-to-confirm control for deliberate actions (e.g. "Swipe to pay"). The user drags the thumb across the track — past the threshold it confirms and fires `onConfirm`; short of it the thumb springs back. Primary look only (no variants); pass `class` to size or reshape it (e.g. `class="w-full"` for full width, `class="rounded-none"` for square ends). The thumb cue is fixed — a double-chevron at rest, a check once confirmed — so there is no icon prop. Pointer-driven (works with mouse and touch) and keyboard accessible: focus the thumb, then **→** / **End** / **Enter** / **Space** to advance or confirm, **←** / **Home** to reset.

**Exports:** `SwipeButton`

Extends all native `<div>` HTML attributes except `class` and the pointer handlers it owns.

| Prop           | Type          | Default    | Description                                                             |
| -------------- | ------------- | ---------- | ----------------------------------------------------------------------- |
| `children`     | `JSX.Element` | —          | Track label, e.g. "Swipe to pay" (required)                             |
| `onConfirm`    | `() => void`  | —          | Called once when the thumb passes the confirmation threshold (required) |
| `confirmLabel` | `JSX.Element` | `children` | Label shown once confirmed                                              |
| `disabled`     | `boolean`     | `false`    | Disables interaction                                                    |
| `threshold`    | `number`      | `0.9`      | Fraction of the track (0–1) the thumb must cross to confirm             |
| `class`        | `string`      | —          | Extra CSS classes (size/shape it here — defaults to `h-11 w-64`)        |

The component is uncontrolled — it owns its drag state and fires `onConfirm` once when the threshold is crossed. To reset it after a failed action, remount it (e.g. change its `key`/`Show` condition).

```tsx
import { SwipeButton } from "@clickyduck/solid-kit";

// Full-width swipe-to-pay
<SwipeButton class="w-full" onConfirm={() => pay()}>
  Swipe to pay
</SwipeButton>

// Custom confirmed label
<SwipeButton confirmLabel="Sent!" onConfirm={() => send()}>
  Swipe to send
</SwipeButton>
```

---

### Table

Full compound component for data tables with pagination.

**Exports:** `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableFooterCell`, `TablePagination`

`Table` renders a card shell (border, radius, background) with a horizontally scrollable container (min-width 640 px). Place `TablePagination` as a direct child of `Table` — it renders attached below the scroll area inside the card. `TableHeader`, `TableBody`, `TableFooter` accept standard HTML attributes plus `class`.

**`TableRow` extra props:**

| Prop            | Type                | Default    | Description                         |
| --------------- | ------------------- | ---------- | ----------------------------------- |
| `clickable`     | `boolean`           | —          | Pointer cursor + hover highlight    |
| `active`        | `boolean`           | —          | Blue highlight for the selected row |
| `verticalAlign` | `"top" \| "middle"` | `"middle"` | Cell vertical alignment             |

**`TableHead` / `TableCell` / `TableFooterCell` extra props:**

| Prop        | Type                            | Default  | Description         |
| ----------- | ------------------------------- | -------- | ------------------- |
| `align`     | `"left" \| "right" \| "center"` | `"left"` | Text alignment      |
| `monospace` | `boolean`                       | —        | Applies `font-mono` |

Header, body, and footer rows share one uniform height (40px, matching the other form controls); a cell whose content is taller grows past it. `TableFooterCell` is a `<td>` styled like a header cell — use it inside `TableFooter` rows for summary/aggregate cells.

**`TablePagination` props:**

| Prop               | Type                                                | Default              | Description                                                               |
| ------------------ | --------------------------------------------------- | -------------------- | ------------------------------------------------------------------------- |
| `limit`            | `number`                                            | —                    | Rows per page (required)                                                  |
| `offset`           | `number`                                            | —                    | Current row offset (required)                                             |
| `currentPageCount` | `number`                                            | —                    | Number of rows on the current page (required)                             |
| `totalCount`       | `number`                                            | —                    | Total rows; shown in the range label and used to disable Next when at end |
| `onChange`         | `(next: { limit: number; offset: number }) => void` | —                    | Called on page or limit change (required)                                 |
| `limitOptions`     | `number[]`                                          | `[25, 50, 100, 200]` | Rows-per-page choices                                                     |
| `class`            | `string`                                            | —                    | Extra CSS classes                                                         |

The pagination bar renders a rows-per-page dropdown on the left and, on the right, a row-range label with previous/next arrows. The label reads `"{start} to {end} of {totalCount}"` (e.g. `1 to 25 of 100`) when `totalCount` is supplied, `"{start} to {end}"` when it is not, and `"0 of 0"` when the current page is empty. Clickable rows support keyboard activation via Enter / Space.

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
  <TablePagination limit={25} offset={0} currentPageCount={1} totalCount={100} onChange={() => {}} />
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

A single typographic primitive for **all** text in the library. Every typographic decision — size, color, weight, alignment, casing, layout, semantic element, truncation — is a prop, so consumers never need a `class` to style text. For text that links somewhere, use [`Link`](#link) — it shares these same typographic props but renders an anchor.

**Exports:** `Text`, `TextProperties`, `TextSize`, `TextColor`, `TextWeight`, `TextAlign`, `TextTransform`, `TextDisplay`, `TextElement`

**`TextSize` scale** — each step sets a font size and a default weight (override with `weight`). Use this to pick a size by intent:

| `size`      | Tailwind    | Font size       | Default weight | Use for                                               |
| ----------- | ----------- | --------------- | -------------- | ----------------------------------------------------- |
| `"display"` | `text-4xl`  | 2.25rem / 36px  | `bold`         | Hero numbers, page-level stat values, splash headings |
| `"title"`   | `text-2xl`  | 1.5rem / 24px   | `semibold`     | Page titles, card titles, section headings            |
| `"body"`    | `text-base` | 1rem / 16px     | `normal`       | Default — paragraphs, list items, most UI copy        |
| `"small"`   | `text-sm`   | 0.875rem / 14px | `normal`       | Secondary copy, form labels, table cells, dense rows  |
| `"caption"` | `text-xs`   | 0.75rem / 12px  | `normal`       | Captions, hints, metadata, uppercase eyebrow labels   |

`"body"` is the default. `display` and `title` also apply `tracking-tight`; `transform="uppercase"` adds `tracking-wide`.

| Prop           | Type                                                                                                            | Default      | Description                                                            |
| -------------- | --------------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------- |
| `as`           | `"div" \| "p" \| "span" \| "label" \| "h1" \| "h2" \| "h3" \| "h4"`                                             | `"div"`      | Rendered element — use `label` for form labels, `h1`–`h4` for headings |
| `size`         | `"display" \| "title" \| "body" \| "small" \| "caption"`                                                        | `"body"`     | Size step                                                              |
| `color`        | `"default" \| "inherit" \| "muted" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger" \| "info"` | `"default"`  | Semantic color                                                         |
| `weight`       | `"thin" \| "normal" \| "medium" \| "semibold" \| "bold"`                                                        | size default | Font weight                                                            |
| `align`        | `"start" \| "center" \| "end"`                                                                                  | —            | Text alignment                                                         |
| `transform`    | `"none" \| "uppercase" \| "capitalize"`                                                                         | `"none"`     | Case transform                                                         |
| `display`      | `"flex" \| "block" \| "inline"`                                                                                 | `"flex"`     | Layout mode — `block`/`inline` for plain runs of text                  |
| `italic`       | `boolean`                                                                                                       | `false`      | Italic style                                                           |
| `underline`    | `boolean`                                                                                                       | `false`      | Underline decoration                                                   |
| `truncate`     | `boolean`                                                                                                       | `false`      | Single-line CSS ellipsis truncation                                    |
| `lineClamp`    | `number`                                                                                                        | —            | Clamp to N lines with an ellipsis (overrides `truncate`)               |
| `opacity`      | `number`                                                                                                        | —            | 0–100 percent opacity                                                  |
| `icon`         | `string \| JSX.Element`                                                                                         | —            | Material Symbols name or an img/element                                |
| `iconPosition` | `"start" \| "end"`                                                                                              | `"start"`    | Icon placement                                                         |
| `maxLength`    | `number`                                                                                                        | —            | Truncates string children with `…` at this length                      |
| `class`        | `string`                                                                                                        | —            | Extra CSS classes                                                      |

```tsx
import { Text } from "@clickyduck/solid-kit";

<Text as="h1" size="title" color="primary">Dashboard</Text>
<Text size="small" color="muted" weight="normal">Last updated 2 hours ago</Text>
<Text as="label" size="caption" transform="uppercase" color="muted">Email</Text>
<Text display="block" truncate>A very long single line that ends with an ellipsis…</Text>
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

Native radio (single) or checkbox (multiple) group with labels and optional descriptions. Uses the browser's native input with `accent-color` styling so it matches the rest of the form controls in look and size.

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

| Prop            | Type                      | Description                 |
| --------------- | ------------------------- | --------------------------- |
| `selectionMode` | `"single"`                | (required)                  |
| `name`          | `string`                  | Radio group name (required) |
| `options`       | `ToggleGroupOption[]`     | (required)                  |
| `value`         | `string`                  | Selected value              |
| `onChange`      | `(value: string) => void` | Called on selection         |
| `disabled`      | `boolean`                 | Disables all options        |

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

### CardToggleGroup

Same selection model as [ToggleGroup](#togglegroup), but each option renders as a selectable card instead of a radio/checkbox row. The native `<input>` is visually hidden behind the card so form submission, keyboard navigation (Tab + Space/Arrow), and screen-reader semantics still work — no custom focus or selection logic.

**Exports:** `CardToggleGroup`, `CardToggleGroupOption`, `CardToggleGroupProperties` (type)

`CardToggleGroupOption` and the props are identical in shape to `ToggleGroupOption` / `ToggleGroupProperties` (single vs. multiple discriminated by `selectionMode`). See the [ToggleGroup](#togglegroup) tables for the field reference.

```tsx
import { CardToggleGroup } from "@clickyduck/solid-kit";
import { createSignal } from "solid-js";

const [plan, setPlan] = createSignal<string>("pro");

<CardToggleGroup
  selectionMode="single"
  name="plan"
  options={[
    { value: "starter", label: "Starter", description: "Up to 5 users and basic reports." },
    { value: "pro", label: "Pro", description: "Unlimited users, advanced analytics, priority support." }
  ]}
  value={plan()}
  onChange={setPlan}
/>;
```

---

### Upload

File picker with drag-and-drop, an empty-state drop zone (dashed border) that flips to a compact row once files are picked, a removable file list with formatted sizes, optional image thumbnails, and optional per-file upload progress.

**Exports:** `Upload`, `UploadProperties` (type), `UploadRejectionReason` (type)

Extends all native `<input type="file">` HTML attributes.

| Prop                    | Type                                                             | Description                                                                                                                                                |
| ----------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `selectedFiles`         | `File[]`                                                         | Controlled file list (required)                                                                                                                            |
| `onSelectedFilesChange` | `(files: File[]) => void`                                        | Called when the selection changes (required)                                                                                                               |
| `onReject`              | `(rejectedFiles: File[], reason: UploadRejectionReason) => void` | Called when files are rejected. `reason` is `"accept"`, `"maxSize"`, or `"multiple"` (extra files dropped in single mode)                                  |
| `maxSizeBytes`          | `number`                                                         | Per-file size limit. Files over this size are rejected via `onReject`                                                                                      |
| `acceptHint`            | `string`                                                         | Helper text under the empty-state drop zone. Defaults to the `accept` value joined with `maxSizeBytes` (e.g. `.pdf · up to 5 MB`)                          |
| `progressByFile`        | `Record<string, number>`                                         | Upload progress keyed by `` `${file.name}:${file.size}` ``; values are `0`–`100`. Renders a thin progress bar and a `42%` label, or a check icon at `100`. |
| `showImagePreviews`     | `boolean`                                                        | Render thumbnails for image files. Defaults to `true`                                                                                                      |
| `class`                 | `string`                                                         | Extra CSS classes                                                                                                                                          |
| `accept`                | `string`                                                         | Native file type filter (also enforced on drop)                                                                                                            |
| `multiple`              | `boolean`                                                        | Allow multiple file selection                                                                                                                              |
| `disabled`              | `boolean`                                                        | Disables the control                                                                                                                                       |

```tsx
import { Upload } from "@clickyduck/solid-kit";
import { addToast } from "@clickyduck/solid-kit";
import { createSignal } from "solid-js";

const [files, setFiles] = createSignal<File[]>([]);

<Upload
  selectedFiles={files()}
  onSelectedFilesChange={setFiles}
  accept=".pdf,.csv,image/*"
  maxSizeBytes={5 * 1024 * 1024}
  onReject={(rejected, reason) => {
    addToast({ title: reason === "maxSize" ? "File too large" : "Wrong type", description: rejected.map((f) => f.name).join(", "), variant: "warning" });
  }}
  multiple
/>;
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

### Deploy steps (TL;DR)

The canonical release order:

```bash
npm run format   # 1. Prettier-write the tree
npm run lint     # 2. tsc --noEmit && eslint (must be clean)
git add -A && git commit -m "…" && git push   # 3. Commit + push the changes
npm run patch    # 4. Version bump — commits the bump, tags, and (via postversion) pushes with tags
                 #    use `npm run minor` / `npm run major` per semver
npm run release  # 5. Publish — prepublishOnly runs typecheck + build, then npm publish to GitHub Packages
```

Notes: step 4's **`npm version`** refuses a dirty tree, which is why the commit in step 3 comes first; its **`postversion`** hook runs **`git push --follow-tags`** for you. Step 5's **`prepublishOnly`** re-runs typecheck + build, so the published tarball always matches the tagged sources. The subsections below expand each step.

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

Available sub-paths: `badge`, `button`, `card`, `date-picker`, `dialog`, `divider`, `dropdown`, `empty-state`, `field`, `header-layout`, `icon-button`, `icons`, `input`, `left-panel-layout`, `link`, `loading`, `main-layout`, `page-layout`, `right-panel-layout`, `section-heading`, `spinner`, `table`, `tabs`, `textarea`, `toast`, `toggle-group`, `typography`, `upload`, `utilities`.

```tsx
import { Button } from "@clickyduck/solid-kit/button";

function App() {
  return <Button>Click me</Button>;
}
```

## License

MIT
