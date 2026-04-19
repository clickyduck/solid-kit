import { Icon, type IconComponent } from "@/components/icons";
import { CLICKABLE_COMPONENT_PADDING, FORM_CONTROL_LEADING_ICON_INPUT_CLASS, FORM_CONTROL_LEADING_ICON_WRAPPER_CLASS, INLINE_ICON_START_PADDING_CLASS, PRIMARY_LABEL_TEXT_CLASS } from "@/utilities/controlLayoutClasses";
import { INLINE_ICON_WITHIN_CLICKABLE_CLASS } from "@/utilities/icon";
import { mergeClasses } from "@/utilities/mergeClasses";
import type { ComponentProps, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

export type InputProperties = ComponentProps<"input"> & {
  icon?: IconComponent;
  trailingText?: string;
  currency?: boolean;
};

const formatCurrencyInputValue = (value: string): string => {
  if (value === "") {
    return value;
  }

  const valueWithoutCommas = value.split(",").join("");
  if (valueWithoutCommas === "") {
    return valueWithoutCommas;
  }

  if (valueWithoutCommas === "-") {
    return valueWithoutCommas;
  }

  const sanitizedValue = valueWithoutCommas.replace(/(?!^-)[-]/g, "").replace(/[^\d.-]/g, "");

  if (sanitizedValue === "") {
    return "";
  }

  const isNegative = sanitizedValue.startsWith("-");
  const sanitizedValueWithoutSign = isNegative ? sanitizedValue.slice(1) : sanitizedValue;

  if (sanitizedValueWithoutSign === "") {
    return "-";
  }

  if (sanitizedValueWithoutSign === ".") {
    return isNegative ? "-0." : "0.";
  }

  const hasDecimalSeparator = sanitizedValueWithoutSign.includes(".");
  const [integerPartRaw, fractionalPartRaw] = sanitizedValueWithoutSign.split(".");
  const safeIntegerPartRaw = integerPartRaw === "" ? "0" : integerPartRaw;
  const integerPartAsNumber = Number(safeIntegerPartRaw);
  if (!Number.isFinite(integerPartAsNumber)) {
    return value;
  }

  const formattedIntegerPart = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(integerPartAsNumber);
  if (!hasDecimalSeparator) {
    return isNegative ? `-${formattedIntegerPart}` : formattedIntegerPart;
  }

  if (sanitizedValueWithoutSign.endsWith(".")) {
    return isNegative ? `-${formattedIntegerPart}.` : `${formattedIntegerPart}.`;
  }

  const formattedWithFraction = `${formattedIntegerPart}.${(fractionalPartRaw ?? "").slice(0, 2)}`;
  return isNegative ? `-${formattedWithFraction}` : formattedWithFraction;
};

const callInputHandler = (handler: InputProperties["onInput"], event: unknown): void => {
  if (!handler) {
    return;
  }

  if (typeof handler === "function") {
    (handler as (event: unknown) => void)(event);
    return;
  }

  if (Array.isArray(handler)) {
    const [boundHandler, boundData] = handler as unknown as [(data: unknown, event: unknown) => void, unknown];
    boundHandler(boundData, event);
  }
};

const Input = (properties: InputProperties) => {
  const [local, rest] = splitProps(properties, ["class", "icon", "trailingText", "currency", "autocomplete", "disabled", "value", "onInput"]);
  const baseClasses =
    "block w-full rounded-lg border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 transition-colors duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50";
  const inputProps = { step: properties.type === "number" ? "0.01" : undefined, ...rest, autocomplete: local.autocomplete ?? "off" };
  const resolvedInputProps = local.currency ? { ...inputProps, type: "text", inputMode: "decimal" as const, autocomplete: "off" } : inputProps;

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    const inputElement = event.currentTarget;
    if (local.currency) {
      inputElement.value = formatCurrencyInputValue(inputElement.value);
    }

    callInputHandler(local.onInput, event);
  };

  if (!local.icon && !local.trailingText) {
    return <input class={mergeClasses(baseClasses, CLICKABLE_COMPONENT_PADDING, local.class)} disabled={local.disabled} value={properties.value} onInput={handleInput} {...resolvedInputProps} />;
  }

  return (
    <div class="relative">
      <Show when={local.icon}>
        {(iconAccessor) => {
          return (
            <div class={mergeClasses("pointer-events-none absolute inset-y-0 left-0 flex items-center", FORM_CONTROL_LEADING_ICON_WRAPPER_CLASS)}>
              <Icon icon={iconAccessor()} class={mergeClasses(INLINE_ICON_WITHIN_CLICKABLE_CLASS, INLINE_ICON_START_PADDING_CLASS, "pointer-events-none shrink-0 text-gray-400")} aria-hidden="true" />
            </div>
          );
        }}
      </Show>
      <input
        class={mergeClasses(baseClasses, CLICKABLE_COMPONENT_PADDING, local.icon ? FORM_CONTROL_LEADING_ICON_INPUT_CLASS : "", local.trailingText ? "pr-12" : "", local.class)}
        disabled={local.disabled}
        value={properties.value}
        onInput={handleInput}
        {...resolvedInputProps}
      />
      {local.trailingText && <div class={mergeClasses("pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400", PRIMARY_LABEL_TEXT_CLASS)}>{local.trailingText}</div>}
    </div>
  );
};

export { Input };
