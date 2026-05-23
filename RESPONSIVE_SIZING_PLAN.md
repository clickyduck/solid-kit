# Responsive Sizing Plan — solid-kit

> Goal: make text, form controls, icons, and layout spacing scale with screen
> size across the whole component library, in the cleanest way possible.

## Decisions (locked in)

- **Mechanism: Tailwind responsive variants (CSS-only).** Bake `sm:`/`md:`/`lg:`
  breakpoint variants directly into the shared class strings. No JS, no extra
  props, no hydration flash, SSR-safe, zero layout shift.
- **Scope: everything** — typography, form controls, icons, and layout spacing/gaps.

## Why CSS-only over the JS-signal approach

The repo already has `useIsMobile()` (a `matchMedia` signal), but using a signal to
pick sizes means: a hydration/first-paint flash, every component re-rendering on
resize, and SSR returning the wrong size. Tailwind variants are evaluated by the
browser at paint time — strictly better for _sizing_. We keep `useIsMobile()` for
what it's actually good at (swapping whole layouts, e.g. `LeftPanelLayout`), not sizing.

## The one real obstacle: icons use inline `px` styles

This is the part that needs care. Today icon size flows as a **number**:

- `RenderIcon` (`source/components/icons/RenderIcon.tsx`) takes `size: number` and
  sets `style={{ width: 'Npx', height: 'Npx' }}`.
- `Icon` (`source/components/icons/Icons.tsx`) sets inline `font-size/width/height` in px.
- Components pass numeric constants: `FORM_CONTROL_ICON_SIZE = 14`,
  `SIZE_CONFIG[*].iconSize` (36/24/16/14/12).

**Inline styles cannot be overridden by Tailwind `md:` variants.** So for icons to
be responsive in a CSS-only world, `RenderIcon`/`Icon` must accept a **class-based
size** path (Tailwind `size-*` + `text-*` utilities) in addition to the existing
numeric `size`. Material Symbols size is driven by `font-size`, so the responsive
icon class must set both box size (`size-*`) and `text-*` (font-size).

Plan: add an optional `sizeClass?: string` to `RenderIcon` (and a matching path in
`Icon`). When `sizeClass` is provided, skip the inline px style and apply the class
(which can carry breakpoint variants). Keep numeric `size` working unchanged for all
existing call sites and for cases where a JS-computed pixel size is genuinely needed.

## Breakpoint scale (proposed tokens)

Use Tailwind's default breakpoints. Define a small set of **responsive size token
strings** so every component references one source of truth (mirrors how
`FORM_CONTROL_SIZE_CLASSES` already works).

| Token             | base (mobile)        | `md:` (tablet)      | `lg:` (desktop)               |
| ----------------- | -------------------- | ------------------- | ----------------------------- |
| form control box  | `h-8 px-2.5 text-sm` | `md:h-8 md:text-sm` | `lg:h-9 lg:px-3 lg:text-base` |
| form control text | `text-sm`            | —                   | `lg:text-base`                |
| icon (form)       | `size-3.5 text-sm`   | —                   | `lg:size-4 lg:text-base`      |

> Exact numbers to be tuned during implementation; the table shows the shape. The
> base size stays equal to today's fixed size so **desktop is unchanged** and we only
> _add_ a smaller mobile step + optional larger step — no visual regression risk on
> the current target.

## File-by-file changes

### 1. `source/utilities/formControlSizing.ts` (the hub)

Make the shared strings responsive. These already feed Button, Input, IconButton,
Textarea, Dropdown, DatePicker, etc., so editing here propagates everywhere:

- `FORM_CONTROL_SIZE_CLASSES`
- `FORM_CONTROL_TEXTAREA_SIZE_CLASSES`
- `FORM_CONTROL_ICON_BUTTON_SIZE_CLASSES`
- `FORM_CONTROL_TEXT_CLASS_BY_SIZE`, label/hint/auxiliary text classes
- Add `FORM_CONTROL_ICON_SIZE_CLASS` (responsive `size-*`/`text-*`) alongside the
  existing numeric `FORM_CONTROL_ICON_SIZE` (keep the number for back-compat).

### 2. `source/components/icons/RenderIcon.tsx` + `Icons.tsx`

Add the `sizeClass` (class-based) path described above. Inline-px path stays as the
default/fallback so nothing breaks.

### 3. `source/components/typography/_typography.tsx`

Make `SIZE_CONFIG[*].textClass` responsive (e.g. `display`: `text-3xl lg:text-4xl`,
`title`: `text-xl lg:text-2xl`, etc.). Add a responsive `iconSizeClass` per token so
typography icons scale via `RenderIcon`'s new class path instead of `iconSize` px.

### 4. Form-control components (consume the hub)

Button, IconButton, Input, Textarea, Dropdown, DatePicker, Field — switch their
`RenderIcon size={...}` calls to the responsive `sizeClass` where the icon should
scale. Most pick up box/text changes automatically via the hub strings.

### 5. Layout spacing & gaps

Audit and add breakpoint variants to gutters/gaps in: `PageLayout` (`px-4 py-6
md:px-6` — extend with `lg:`), `PageHeader`/`PageSection`, `LeftPanelLayout`,
`RightPanelLayout`, `HeaderLayout`, `Card`/`MetricCard`/`DataCard`, `SectionHeading`,
`Table` cell padding (`componentClassStrings.ts`: `TABLE_*` strings).

### 6. `source/utilities/componentClassStrings.ts`

Make `TABLE_HEAD_CELL_CLASSES` / `TABLE_DATA_CELL_CLASSES` / pagination padding and
the `TABLE_*_TEXT_CLASSES` responsive.

## Tailwind config note

Default breakpoints (`sm 640 / md 768 / lg 1024 / xl 1280`) are sufficient; no
`tailwind.config.ts` change required unless we want custom breakpoints. Library
consumers compile their own Tailwind against our class strings, so all variants we
emit must be standard Tailwind utilities (they are).

## Rollout order (each step independently shippable)

1. Add responsive icon path to `RenderIcon`/`Icons` (no behavior change yet).
2. Make `formControlSizing.ts` strings responsive → all form controls scale.
3. Make typography `SIZE_CONFIG` responsive.
4. Switch component icon call sites to `sizeClass`.
5. Layout spacing/gaps + table.
6. Showcase: verify each breakpoint visually; tune token numbers.

## Verification

- `npm run typecheck` + `npm run lint` after each step.
- Resize the showcase app (`npm run development`) across mobile/tablet/desktop.
- Confirm **desktop (current base) is visually unchanged**; only smaller/larger
  steps are added.

## Risks / open questions

- **Icon px → class migration** is the only structurally invasive change; everything
  else is additive string edits. Need to confirm Material Symbols renders correctly
  when sized by `text-*` class instead of inline `font-size`.
- Should we add a 3rd (`lg:`) _larger_ step at all, or only add a smaller mobile step
  below today's size? (Affects whether large monitors get bigger UI.)
