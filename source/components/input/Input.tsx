import { Icon, type IconComponent } from "@/components/icons";
import {
  CHROME_MUTED_ICON_CLASSES,
  FORM_CONTROL_ICON_SIZE,
  FORM_CONTROL_LEADING_ICON_INPUT_CLASS,
  FORM_CONTROL_LEADING_ICON_WRAPPER_CLASS,
  FORM_CONTROL_SIZE_CLASSES,
  FORM_CONTROL_TEXT_CLASS_BY_SIZE,
  mergeClasses,
  useEffectiveFormControlSize
} from "@/utilities";
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
  const effectiveSize = useEffectiveFormControlSize();
  const baseClasses =
    "block w-full rounded-lg border border-solid border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors duration-150 focus:border-blue-500 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";
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
    return <input class={mergeClasses(baseClasses, FORM_CONTROL_SIZE_CLASSES[effectiveSize()], local.class)} disabled={local.disabled} value={properties.value} onInput={handleInput} {...resolvedInputProps} />;
  }

  return (
    <div class="relative">
      <Show when={local.icon}>
        {(iconAccessor) => {
          return (
            <div class={mergeClasses("pointer-events-none absolute inset-y-0 left-0 flex items-center", FORM_CONTROL_LEADING_ICON_WRAPPER_CLASS)}>
              <Icon icon={iconAccessor()} width={FORM_CONTROL_ICON_SIZE[effectiveSize()]} height={FORM_CONTROL_ICON_SIZE[effectiveSize()]} class={mergeClasses("pointer-events-none shrink-0", CHROME_MUTED_ICON_CLASSES)} aria-hidden="true" />
            </div>
          );
        }}
      </Show>
      <input
        class={mergeClasses(baseClasses, FORM_CONTROL_SIZE_CLASSES[effectiveSize()], local.icon ? FORM_CONTROL_LEADING_ICON_INPUT_CLASS : "", local.trailingText ? "pr-12" : "", local.class)}
        disabled={local.disabled}
        value={properties.value}
        onInput={handleInput}
        {...resolvedInputProps}
      />
      {local.trailingText && <div class={mergeClasses("pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500", FORM_CONTROL_TEXT_CLASS_BY_SIZE[effectiveSize()])}>{local.trailingText}</div>}
    </div>
  );
};

export { Input };
