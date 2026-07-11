import { Dropdown, DropdownTrigger } from "@/components/dropdown/Dropdown";
import { Text } from "@/components/typography";
import { mergeClasses } from "@/utilities";
import type { JSX } from "solid-js";
import { createMemo } from "solid-js";

/** A time of day as a 24-hour `"HH:MM"` string (e.g. "09:30", "14:05"), matching `<input type="time">`. */
export type TimePickerValue = string | undefined;

export type TimePickerProperties = {
  value?: TimePickerValue;
  onChange?: (value: TimePickerValue) => void;
  disabled?: boolean;
  id?: string;
  class?: string;
};

type Period = "AM" | "PM";

type TimeParts = {
  hour12: number; // 1–12
  minute: number; // 0–59
  period: Period;
};

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const PERIOD_OPTIONS: Period[] = ["AM", "PM"];

/** Parse a `"HH:MM"` 24-hour string into 12-hour display parts, or undefined if empty/malformed. */
const parseValue = (value: TimePickerValue): TimeParts | undefined => {
  if (!value) return undefined;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return undefined;
  const hours24 = Number(match[1]);
  const minute = Number(match[2]);
  if (hours24 < 0 || hours24 > 23 || minute < 0 || minute > 59) return undefined;
  const period: Period = hours24 < 12 ? "AM" : "PM";
  const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return { hour12, minute, period };
};

/** Convert 12-hour display parts back into a `"HH:MM"` 24-hour string. */
const toValue = (parts: TimeParts): string => {
  const hours24 = parts.period === "AM" ? parts.hour12 % 12 : (parts.hour12 % 12) + 12;
  return `${String(hours24).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
};

/**
 * TimePicker — an inline row of three dropdowns (hour · minute · AM/PM) for selecting a
 * time of day. Emits a 24-hour `"HH:MM"` string; the dropdowns display 12-hour with AM/PM.
 */
const TimePicker = (properties: TimePickerProperties): JSX.Element => {
  const parts = createMemo(() => parseValue(properties.value));

  const hourLabel = (): string | undefined => {
    const p = parts();
    return p ? String(p.hour12).padStart(2, "0") : undefined;
  };
  const minuteLabel = (): string | undefined => {
    const p = parts();
    return p ? String(p.minute).padStart(2, "0") : undefined;
  };
  const periodLabel = (): Period | undefined => parts()?.period;

  // Apply a single field change. A partial selection (no value yet) defaults the
  // other two fields so any first pick immediately produces a complete "HH:MM".
  const emit = (next: Partial<TimeParts>): void => {
    const current = parts() ?? { hour12: 12, minute: 0, period: "AM" as Period };
    properties.onChange?.(toValue({ ...current, ...next }));
  };

  return (
    <div class={mergeClasses("inline-flex items-center gap-2", properties.disabled && "cursor-not-allowed opacity-50", properties.class)} id={properties.id}>
      <Dropdown class="w-20 shrink-0" options={HOUR_OPTIONS} value={hourLabel()} onChange={(v) => v != null && emit({ hour12: Number(v) })} disabled={properties.disabled}>
        <DropdownTrigger>{hourLabel() ?? "HH"}</DropdownTrigger>
      </Dropdown>

      <Text as="span" size="small" color="muted" display="inline" aria-hidden="true" class="select-none">
        :
      </Text>

      <Dropdown class="w-20 shrink-0" options={MINUTE_OPTIONS} value={minuteLabel()} onChange={(v) => v != null && emit({ minute: Number(v) })} disabled={properties.disabled} searchable>
        <DropdownTrigger>{minuteLabel() ?? "MM"}</DropdownTrigger>
      </Dropdown>

      <Dropdown class="w-20 shrink-0" options={PERIOD_OPTIONS} value={periodLabel()} onChange={(v) => v != null && emit({ period: v as Period })} disabled={properties.disabled}>
        <DropdownTrigger>{periodLabel() ?? "AM"}</DropdownTrigger>
      </Dropdown>
    </div>
  );
};

export { TimePicker };
