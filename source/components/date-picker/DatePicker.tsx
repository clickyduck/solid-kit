import { Button } from "@/components/button/Button";
import { IconButton } from "@/components/icon-button/IconButton";
import { Icon } from "@/components/icons";
import { Text } from "@/components/typography";
import { DROPDOWN_MENU_SURFACE_CLASSES, FADE_TRANSITION_CLASSES, FORM_CONTROL_ICON_SIZE, mergeClasses, popoverStateClasses, usePopoverAnimation } from "@/utilities";
import { VIEWPORT_EDGE_GAP_PIXELS, computeFlippedMenuPosition } from "@/utilities/computeFlippedMenuPosition";
import { getPortalMount } from "@/utilities/getPortalMount";
import type { JSX } from "solid-js";
import { For, Show, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";

export type DatePickerMode = "single" | "range";

export type DatePickerValue = { mode: "single"; date: Date | undefined } | { mode: "range"; from: Date | undefined; to: Date | undefined };

export type DatePickerProperties = {
  mode?: DatePickerMode;
  value?: DatePickerValue;
  onChange?: (value: DatePickerValue) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  class?: string;
};

type CalendarDay = {
  date: Date;
  currentMonth: boolean;
};

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const isSameDay = (a: Date, b: Date): boolean => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const isInRange = (date: Date, from: Date | undefined, to: Date | undefined): boolean => {
  if (!from || !to) return false;
  const d = date.getTime();
  return d > from.getTime() && d < to.getTime();
};

const formatDate = (date: Date): string => date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const buildCalendarDays = (year: number, month: number): CalendarDay[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: CalendarDay[] = [];

  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push({ date: new Date(year, month, -firstDay.getDay() + 1 + i), currentMonth: false });
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ date: new Date(year, month, d), currentMonth: true });
  }
  const trailing = 42 - days.length;
  for (let i = 1; i <= trailing; i++) {
    days.push({ date: new Date(year, month + 1, i), currentMonth: false });
  }
  return days;
};

const formatTriggerLabel = (value: DatePickerValue | undefined, placeholder: string): string => {
  if (!value) return placeholder;
  if (value.mode === "single") return value.date ? formatDate(value.date) : placeholder;
  if (!value.from && !value.to) return placeholder;
  return `${value.from ? formatDate(value.from) : "…"} – ${value.to ? formatDate(value.to) : "…"}`;
};

const YEAR_RANGE = 12;

type CalendarView = "days" | "months" | "years";

type CalendarProperties = {
  year: number;
  month: number;
  mode: DatePickerMode;
  singleDate: Date | undefined;
  rangeFrom: Date | undefined;
  rangeTo: Date | undefined;
  hoverDate: Date | undefined;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date | undefined) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
};

const Calendar = (properties: CalendarProperties): JSX.Element => {
  const [view, setView] = createSignal<CalendarView>("days");
  const [yearPageStart, setYearPageStart] = createSignal(Math.floor(properties.year / YEAR_RANGE) * YEAR_RANGE);

  const days = createMemo(() => buildCalendarDays(properties.year, properties.month));

  // While picking the end date the user may hover a day *before* the start.
  // Order the preview endpoints so the highlighted band always spans from the
  // earlier day to the later one, mirroring the swap performed on completion.
  const previewRange = createMemo((): { start: Date; end: Date | undefined } | undefined => {
    if (properties.mode !== "range" || !properties.rangeFrom) return undefined;
    const from = properties.rangeFrom;
    // The pending end is the committed "to", or the hovered day while still picking.
    const other = properties.rangeTo ?? properties.hoverDate;
    if (!other) return { start: from, end: undefined };
    return other.getTime() < from.getTime() ? { start: other, end: from } : { start: from, end: other };
  });

  const previewStart = createMemo((): Date | undefined => previewRange()?.start);
  const previewEnd = createMemo((): Date | undefined => previewRange()?.end);

  const makeDayState = (day: CalendarDay) => {
    const isToday = isSameDay(day.date, new Date());
    const isCurrentMonth = day.currentMonth;
    const mutedText = isCurrentMonth ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-600";
    const base = "relative z-10 h-9 w-9 p-0";
    const todayRing = isToday ? "ring-1 ring-inset ring-blue-500" : "";

    const isFrom = createMemo(() => properties.mode === "range" && !!previewStart() && isSameDay(day.date, previewStart()!));
    const isTo = createMemo(() => properties.mode === "range" && !!previewEnd() && isSameDay(day.date, previewEnd()!));
    const isSingle = createMemo(() => properties.mode === "single" && !!properties.singleDate && isSameDay(day.date, properties.singleDate));
    const inRange = createMemo(() => properties.mode === "range" && isInRange(day.date, previewStart(), previewEnd()));
    const isSelected = createMemo(() => isSingle() || isFrom() || isTo());

    const buttonClass = createMemo(() => {
      if (isSelected()) return mergeClasses(base, "bg-blue-600 text-white enabled:hover:bg-blue-700 dark:bg-blue-500 dark:enabled:hover:bg-blue-600");
      if (inRange()) return mergeClasses(base, "text-blue-800 enabled:hover:bg-blue-600/20 dark:text-blue-200 dark:enabled:hover:bg-blue-500/25");
      // Default/today cells inherit the ghost variant's own neutral hover wash (gray-700/50); no override needed.
      if (isToday) return mergeClasses(base, mutedText, todayRing);
      return mergeClasses(base, mutedText);
    });

    // Band visibility and shape — always rendered in DOM, shown/hidden via opacity.
    const bandClass = createMemo(() => {
      const bg = "absolute inset-y-0 bg-blue-600/10 dark:bg-blue-500/15";
      if (isFrom() && isTo()) return "hidden";
      if (isFrom()) return mergeClasses(bg, "left-1/2 right-0");
      if (isTo()) return mergeClasses(bg, "left-0 right-1/2");
      if (inRange()) return mergeClasses(bg, "left-0 right-0");
      return "hidden";
    });

    return { buttonClass, bandClass };
  };

  // Overrides layered onto Button's ghost variant; hover overrides need the enabled:hover prefix
  // to conflict with (and win over) the variant's own enabled:hover wash in tailwind-merge.
  const chipSize = "h-auto px-2.5 py-1.5";
  const chipActive = "bg-blue-500/10 text-blue-700 enabled:hover:bg-blue-500/15 dark:bg-blue-500/15 dark:text-blue-300 dark:enabled:hover:bg-blue-500/20";

  const itemSize = "h-10 px-1";
  // Default month/year cells inherit the ghost variant's own neutral hover wash (gray-700/50).
  const itemDefault = "text-gray-900 dark:text-gray-100";
  const itemSelected = "bg-blue-600 text-white enabled:hover:bg-blue-700 dark:bg-blue-500 dark:enabled:hover:bg-blue-600";

  const toggleMonth = (): void => {
    setView((v) => (v === "months" ? "days" : "months"));
  };

  const toggleYear = (): void => {
    setYearPageStart(Math.floor(properties.year / YEAR_RANGE) * YEAR_RANGE);
    setView((v) => (v === "years" ? "days" : "years"));
  };

  const handleMonthSelect = (month: number): void => {
    properties.onMonthChange(month);
    setView("days");
  };

  const handleYearSelect = (year: number): void => {
    properties.onYearChange(year);
    setView("days");
  };

  const handlePrev = (): void => {
    if (view() === "years") setYearPageStart((s) => s - YEAR_RANGE);
    else if (view() === "months") properties.onYearChange(properties.year - 1);
    else properties.onPrevMonth();
  };

  const handleNext = (): void => {
    if (view() === "years") setYearPageStart((s) => s + YEAR_RANGE);
    else if (view() === "months") properties.onYearChange(properties.year + 1);
    else properties.onNextMonth();
  };

  return (
    <div class="p-3 select-none">
      <div class="mb-3 flex items-center justify-between gap-1">
        <IconButton variant="ghost" icon="chevron_left" aria-label="Previous" onClick={handlePrev} />
        <div class="flex items-center gap-1">
          <Button variant="ghost" class={mergeClasses(chipSize, view() === "months" && chipActive)} onClick={() => toggleMonth()}>
            {MONTHS[properties.month]}
          </Button>
          <Button variant="ghost" class={mergeClasses(chipSize, view() === "years" && chipActive)} onClick={() => toggleYear()}>
            {properties.year}
          </Button>
        </div>
        <IconButton variant="ghost" icon="chevron_right" aria-label="Next" onClick={handleNext} />
      </div>

      <Show when={view() === "days"}>
        <div class="mb-1 grid grid-cols-7">
          <For each={DAYS_OF_WEEK}>
            {(dow) => (
              <Text as="div" size="caption" weight="semibold" color="muted" align="center" class="h-9 justify-center">
                {dow}
              </Text>
            )}
          </For>
        </div>
        <div class="grid grid-cols-7" onMouseLeave={() => properties.onDayHover(undefined)}>
          <For each={days()}>
            {(day) => {
              const { buttonClass, bandClass } = makeDayState(day);
              return (
                <div class="relative flex h-10 w-full items-center justify-center">
                  <div class={bandClass()} />
                  <Button variant="ghost" class={buttonClass()} onClick={() => properties.onDayClick(day.date)} onMouseEnter={() => properties.onDayHover(day.date)}>
                    {day.date.getDate()}
                  </Button>
                </div>
              );
            }}
          </For>
        </div>
      </Show>

      <Show when={view() === "months"}>
        <div class="grid grid-cols-3 gap-1">
          <For each={MONTHS}>
            {(name, i) => (
              <Button variant="ghost" class={mergeClasses(itemSize, i() === properties.month ? itemSelected : itemDefault)} onClick={() => handleMonthSelect(i())}>
                {name.slice(0, 3)}
              </Button>
            )}
          </For>
        </div>
      </Show>

      <Show when={view() === "years"}>
        <div class="grid grid-cols-3 gap-1">
          <For each={Array.from({ length: YEAR_RANGE }, (_, i) => yearPageStart() + i)}>
            {(yr) => (
              <Button variant="ghost" class={mergeClasses(itemSize, yr === properties.year ? itemSelected : itemDefault)} onClick={() => handleYearSelect(yr)}>
                {yr}
              </Button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

type PopoverMenuPosition = {
  top: number;
  left: number;
  width: number;
  measured: boolean;
};

/**
 * DatePicker — supports single date or date range selection.
 * In range mode, "from" is set to 12:00 AM and "to" is set to 11:59:59 PM.
 */
const DatePicker = (properties: DatePickerProperties): JSX.Element => {
  const mode = (): DatePickerMode => properties.mode ?? "single";
  const placeholder = (): string => properties.placeholder ?? (mode() === "range" ? "Select date range" : "Select date");

  const [open, setOpen] = createSignal(false);
  const popover = usePopoverAnimation(open);

  const today = new Date();
  const [viewYear, setViewYear] = createSignal(today.getFullYear());
  const [viewMonth, setViewMonth] = createSignal(today.getMonth());

  const [singleDate, setSingleDate] = createSignal<Date | undefined>(undefined);
  const [rangeFrom, setRangeFrom] = createSignal<Date | undefined>(undefined);
  const [rangeTo, setRangeTo] = createSignal<Date | undefined>(undefined);
  const [hoverDate, setHoverDate] = createSignal<Date | undefined>(undefined);
  // true = waiting for user to pick the start date (or restart after a complete range)
  const [pickingStart, setPickingStart] = createSignal(true);

  const [portalPosition, setPortalPosition] = createSignal<PopoverMenuPosition | null>(null);

  let containerElement: HTMLDivElement | undefined;
  let triggerElement: HTMLButtonElement | undefined;
  let popoverElement: HTMLElement | null = null;

  createEffect(
    on(
      () => properties.value,
      (value) => {
        if (!value) return;
        if (value.mode === "single" && value.date) {
          setSingleDate(value.date);
          setViewYear(value.date.getFullYear());
          setViewMonth(value.date.getMonth());
        } else if (value.mode === "range") {
          setRangeFrom(value.from);
          setRangeTo(value.to);
          if (value.from) {
            setViewYear(value.from.getFullYear());
            setViewMonth(value.from.getMonth());
          }
        }
      }
    )
  );

  const handleDayClick = (date: Date): void => {
    if (mode() === "single") {
      const selected = startOfDay(date);
      setSingleDate(selected);
      properties.onChange?.({ mode: "single", date: selected });
      setOpen(false);
      return;
    }

    if (pickingStart()) {
      // First click: set the start, clear any previous end, wait for end click.
      setRangeFrom(startOfDay(date));
      setRangeTo(undefined);
      setPickingStart(false);
    } else {
      // Second click: complete the range.
      const from = rangeFrom()!;
      if (date.getTime() < from.getTime()) {
        setRangeFrom(startOfDay(date));
        setRangeTo(endOfDay(from));
        properties.onChange?.({ mode: "range", from: startOfDay(date), to: endOfDay(from) });
      } else {
        setRangeTo(endOfDay(date));
        properties.onChange?.({ mode: "range", from, to: endOfDay(date) });
      }
      setPickingStart(true);
      setOpen(false);
    }
  };

  const handleClear = (): void => {
    setSingleDate(undefined);
    setRangeFrom(undefined);
    setRangeTo(undefined);
    setPickingStart(true);
    if (mode() === "single") {
      properties.onChange?.({ mode: "single", date: undefined });
    } else {
      properties.onChange?.({ mode: "range", from: undefined, to: undefined });
    }
  };

  const hasValue = (): boolean => (mode() === "single" ? singleDate() !== undefined : rangeFrom() !== undefined || rangeTo() !== undefined);

  const triggerLabel = (): string => {
    if (mode() === "single") return formatTriggerLabel({ mode: "single", date: singleDate() }, placeholder());
    return formatTriggerLabel({ mode: "range", from: rangeFrom(), to: rangeTo() }, placeholder());
  };

  const updatePortalPosition = (): void => {
    if (!triggerElement) return;
    const rect = triggerElement.getBoundingClientRect();
    // Before the popover is mounted we cannot measure it to know whether it
    // overflows, so place it below the trigger and keep it hidden (measured:
    // false) until the next frame, when we can flip it against the viewport.
    if (!popoverElement) {
      setPortalPosition({ top: rect.bottom + VIEWPORT_EDGE_GAP_PIXELS, left: rect.left, width: rect.width, measured: false });
      return;
    }
    const { top, left } = computeFlippedMenuPosition(rect, popoverElement);
    setPortalPosition({ top, left, width: rect.width, measured: true });
    // Positioned and about to become visible — start the enter transition.
    popover.markMeasured();
  };

  createEffect(
    on(open, (isOpen) => {
      if (!isOpen) {
        // Keep portalPosition/popoverElement intact so the exit transition can
        // paint from the last position; they are recomputed on the next open and
        // the element unmounts once the close animation finishes.
        setHoverDate(undefined);
        return;
      }
      // When the calendar opens with a complete range already set, always restart selection.
      if (mode() === "range" && rangeFrom() && rangeTo()) {
        setPickingStart(true);
      }
      // First frame mounts the popover (measured: false, hidden); the second
      // frame measures it and flips against the viewport if needed.
      requestAnimationFrame(() => {
        updatePortalPosition();
        requestAnimationFrame(updatePortalPosition);
      });
      window.addEventListener("scroll", updatePortalPosition, true);
      window.addEventListener("resize", updatePortalPosition);
      onCleanup(() => {
        window.removeEventListener("scroll", updatePortalPosition, true);
        window.removeEventListener("resize", updatePortalPosition);
      });
    })
  );

  // Once the exit animation finishes and the popover unmounts, drop the stale
  // element ref / cached position so the next open re-measures cleanly.
  createEffect(
    on(popover.shouldRender, (rendered) => {
      if (!rendered) {
        popoverElement = null;
        setPortalPosition(null);
      }
    })
  );

  onMount(() => {
    const handleDocumentClick = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (!document.contains(target)) return;
      if (containerElement?.contains(target)) return;
      if (popoverElement?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("click", handleDocumentClick);
    onCleanup(() => document.removeEventListener("click", handleDocumentClick));
  });

  const handlePrevMonth = (): void => {
    if (viewMonth() === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (): void => {
    if (viewMonth() === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleYearChange = (year: number): void => {
    setViewYear(year);
  };
  const handleMonthChange = (month: number): void => {
    setViewMonth(month);
  };

  const rangeStatusLabel = (): string | undefined => {
    if (mode() !== "range" || !open()) return undefined;
    if (pickingStart()) return "Select start date";
    return "Select end date";
  };

  const calendarElement = (): JSX.Element => (
    <div class={mergeClasses(DROPDOWN_MENU_SURFACE_CLASSES, "w-full min-w-[300px]")} onClick={(e) => e.stopPropagation()}>
      <Calendar
        year={viewYear()}
        month={viewMonth()}
        mode={mode()}
        singleDate={singleDate()}
        rangeFrom={rangeFrom()}
        rangeTo={rangeTo()}
        hoverDate={hoverDate()}
        onDayClick={handleDayClick}
        onDayHover={setHoverDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onYearChange={handleYearChange}
        onMonthChange={handleMonthChange}
      />
      <Show when={rangeStatusLabel()}>
        {(label) => (
          <Text as="div" size="caption" color="muted" display="block" class="border-t border-gray-200 px-3 py-2 dark:border-gray-700">
            {label()}
          </Text>
        )}
      </Show>
      <div class="border-t border-gray-200 px-3 py-2 dark:border-gray-700">
        <Button variant="ghost" class="w-full" onClick={handleClear} disabled={!hasValue()}>
          Clear
        </Button>
      </div>
    </div>
  );

  return (
    <div
      ref={(el) => {
        containerElement = el;
      }}
      class={mergeClasses("relative", properties.class)}
    >
      {/* Trigger — identical markup and classes to DropdownTrigger */}
      <Button
        ref={(el: HTMLButtonElement) => {
          triggerElement = el;
        }}
        id={properties.id}
        variant="outline"
        icon="keyboard_arrow_down"
        iconPosition="end"
        class="w-full min-w-0 justify-between text-left font-normal aria-expanded:bg-gray-100 dark:aria-expanded:bg-gray-700"
        disabled={properties.disabled}
        aria-expanded={open()}
        aria-haspopup="dialog"
        onClick={(event: MouseEvent) => {
          if (properties.disabled) return;
          event.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        <span class="flex min-w-0 flex-1 items-center gap-2">
          <Icon name="calendar_today" size={FORM_CONTROL_ICON_SIZE} class="pointer-events-none shrink-0 text-current" aria-hidden="true" />
          <Text as="span" size="small" color="default" display="inline" truncate class="min-w-0 flex-1">
            {triggerLabel()}
          </Text>
        </span>
      </Button>

      <Show when={popover.shouldRender() && portalPosition()}>
        {(position) => (
          <Portal mount={getPortalMount(containerElement)}>
            <div
              ref={(el) => {
                popoverElement = el;
              }}
              class={mergeClasses("z-50", FADE_TRANSITION_CLASSES, popoverStateClasses(popover.isEntered()))}
              style={{ position: "fixed", top: `${position().top}px`, left: `${position().left}px`, "min-width": `${position().width}px`, visibility: position().measured ? "visible" : "hidden" }}
            >
              {calendarElement()}
            </div>
          </Portal>
        )}
      </Show>
    </div>
  );
};

export { DatePicker };
