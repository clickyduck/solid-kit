import { Button } from "@/components/button/Button";
import { IconButton } from "@/components/icon-button/IconButton";
import { Icon } from "@/components/icons";
import { CHROME_MUTED_ICON_CLASSES, DROPDOWN_MENU_SURFACE_CLASSES, FORM_CONTROL_ICON_SIZE, mergeClasses } from "@/utilities";
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

  const effectiveTo = createMemo((): Date | undefined => {
    if (properties.mode === "range" && properties.rangeFrom && !properties.rangeTo && properties.hoverDate) {
      return properties.hoverDate;
    }
    return properties.rangeTo;
  });

  const makeDayState = (day: CalendarDay) => {
    const isToday = isSameDay(day.date, new Date());
    const isCurrentMonth = day.currentMonth;
    const mutedText = isCurrentMonth ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-600";
    const base = "relative z-10 flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors duration-100 focus:outline-none";
    const todayRing = isToday ? "ring-1 ring-inset ring-blue-500" : "";

    const isFrom = createMemo(() => properties.mode === "range" && !!properties.rangeFrom && isSameDay(day.date, properties.rangeFrom));
    const isTo = createMemo(() => properties.mode === "range" && !!effectiveTo() && isSameDay(day.date, effectiveTo()!));
    const isSingle = createMemo(() => properties.mode === "single" && !!properties.singleDate && isSameDay(day.date, properties.singleDate));
    const inRange = createMemo(() => properties.mode === "range" && isInRange(day.date, properties.rangeFrom, effectiveTo()));
    const isSelected = createMemo(() => isSingle() || isFrom() || isTo());

    const buttonClass = createMemo(() => {
      if (isSelected()) return mergeClasses(base, "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600");
      if (inRange()) return mergeClasses(base, "text-blue-800 hover:bg-blue-600/20 dark:text-blue-200 dark:hover:bg-blue-500/25");
      if (isToday) return mergeClasses(base, mutedText, todayRing, "hover:bg-gray-100 dark:hover:bg-gray-700");
      return mergeClasses(base, mutedText, "hover:bg-gray-100 dark:hover:bg-gray-700");
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

  const chipBase = "rounded-md px-2 py-0.5 text-sm font-semibold transition-colors duration-100 focus:outline-none";
  const chipActive = "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  const chipIdle = "text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700";

  const itemBase = "flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-100 focus:outline-none";
  const itemDefault = "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700";
  const itemSelected = "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600";

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
          <button type="button" class={mergeClasses(chipBase, view() === "months" ? chipActive : chipIdle)} onClick={() => toggleMonth()}>
            {MONTHS[properties.month]}
          </button>
          <button type="button" class={mergeClasses(chipBase, view() === "years" ? chipActive : chipIdle)} onClick={() => toggleYear()}>
            {properties.year}
          </button>
        </div>
        <IconButton variant="ghost" icon="chevron_right" aria-label="Next" onClick={handleNext} />
      </div>

      <Show when={view() === "days"}>
        <div class="mb-1 grid grid-cols-7">
          <For each={DAYS_OF_WEEK}>{(dow) => <div class="flex h-8 items-center justify-center text-xs font-semibold text-gray-500 dark:text-gray-400">{dow}</div>}</For>
        </div>
        <div class="grid grid-cols-7" onMouseLeave={() => properties.onDayHover(undefined)}>
          <For each={days()}>
            {(day) => {
              const { buttonClass, bandClass } = makeDayState(day);
              return (
                <div class="relative flex h-9 w-full items-center justify-center">
                  <div class={bandClass()} />
                  <button type="button" class={buttonClass()} onClick={() => properties.onDayClick(day.date)} onMouseEnter={() => properties.onDayHover(day.date)}>
                    {day.date.getDate()}
                  </button>
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
              <button type="button" class={mergeClasses(itemBase, "h-9 px-1", i() === properties.month ? itemSelected : itemDefault)} onClick={() => handleMonthSelect(i())}>
                {name.slice(0, 3)}
              </button>
            )}
          </For>
        </div>
      </Show>

      <Show when={view() === "years"}>
        <div class="grid grid-cols-3 gap-1">
          <For each={Array.from({ length: YEAR_RANGE }, (_, i) => yearPageStart() + i)}>
            {(yr) => (
              <button type="button" class={mergeClasses(itemBase, "h-9 px-1", yr === properties.year ? itemSelected : itemDefault)} onClick={() => handleYearSelect(yr)}>
                {yr}
              </button>
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
};

/**
 * DatePicker — supports single date or date range selection.
 * In range mode, "from" is set to 12:00 AM and "to" is set to 11:59:59 PM.
 */
const DatePicker = (properties: DatePickerProperties): JSX.Element => {
  const mode = (): DatePickerMode => properties.mode ?? "single";
  const placeholder = (): string => properties.placeholder ?? (mode() === "range" ? "Select date range" : "Select date");

  const [open, setOpen] = createSignal(false);

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
    setPortalPosition({ top: rect.bottom + 4, left: rect.left });
  };

  createEffect(
    on(open, (isOpen) => {
      if (!isOpen) {
        setPortalPosition(null);
        return;
      }
      // When the calendar opens with a complete range already set, always restart selection.
      if (mode() === "range" && rangeFrom() && rangeTo()) {
        setPickingStart(true);
      }
      requestAnimationFrame(updatePortalPosition);
      window.addEventListener("scroll", updatePortalPosition, true);
      window.addEventListener("resize", updatePortalPosition);
      onCleanup(() => {
        window.removeEventListener("scroll", updatePortalPosition, true);
        window.removeEventListener("resize", updatePortalPosition);
      });
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
    <div class={mergeClasses(DROPDOWN_MENU_SURFACE_CLASSES, "w-[280px]")} onClick={(e) => e.stopPropagation()}>
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
      <Show when={rangeStatusLabel()}>{(label) => <div class="border-t border-gray-200 px-3 py-2 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">{label()}</div>}</Show>
      <Show when={hasValue()}>
        <div class="border-t border-gray-200 px-3 py-2 dark:border-gray-700">
          <Button variant="ghost" class="w-full text-xs text-gray-500 dark:text-gray-400" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </Show>
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
        class="w-full min-w-0 justify-between text-left font-medium aria-expanded:bg-gray-100 dark:aria-expanded:bg-gray-700"
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
          <Icon name="calendar_today" size={FORM_CONTROL_ICON_SIZE} class={mergeClasses("pointer-events-none shrink-0", CHROME_MUTED_ICON_CLASSES)} aria-hidden="true" />
          <span class={mergeClasses("min-w-0 flex-1 truncate", hasValue() ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500")}>{triggerLabel()}</span>
        </span>
      </Button>

      <Show when={open() && portalPosition()}>
        {(position) => (
          <Portal mount={document.body}>
            <div
              ref={(el) => {
                popoverElement = el;
              }}
              class="z-[9999]"
              style={{ position: "fixed", top: `${position().top}px`, left: `${position().left}px` }}
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
