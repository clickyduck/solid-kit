import { RenderIcon } from "@/components/icons";
import { Text } from "@/components/typography";
import { CHROME_MUTED_ICON_CLASSES, FORM_CONTROL_ICON_SIZE, FORM_CONTROL_LEADING_ICON_INPUT_CLASS, FORM_CONTROL_LEADING_ICON_WRAPPER_CLASS, FORM_CONTROL_SIZE_CLASSES, callBoundHandler, mergeClasses } from "@/utilities";
import type { ComponentProps, JSX } from "solid-js";
import { Show, splitProps } from "solid-js";

export type InputProperties = Omit<ComponentProps<"input">, "class"> & {
  class?: string;
  icon?: string | JSX.Element;
  trailingText?: string;
  currency?: boolean;
};

// Characters the caret is anchored to across a reformat. Commas are grouping separators the formatter
// inserts/removes freely, so they are NOT significant — anchoring on them is exactly what makes the caret
// drift. Digits, a decimal point, and a leading minus are the characters the user actually typed.
const isSignificantCurrencyCharacter = (character: string): boolean => {
  return /[\d.-]/.test(character);
};

// Count significant characters (see above) in `text` up to `caretOffset`. After reformatting, placing the
// caret just past this many significant characters keeps it visually anchored to the digit the user was
// editing, regardless of how many commas the formatter added or removed to the left of it.
const countSignificantCurrencyCharactersBeforeCaret = (text: string, caretOffset: number): number => {
  let significantCharacterCount = 0;
  for (let characterIndex = 0; characterIndex < caretOffset && characterIndex < text.length; characterIndex = characterIndex + 1) {
    if (isSignificantCurrencyCharacter(text[characterIndex])) {
      significantCharacterCount = significantCharacterCount + 1;
    }
  }
  return significantCharacterCount;
};

// Find the offset in `formattedValue` that sits just after `significantCharacterCount` significant
// characters, so the restored caret lands on the same digit boundary the user was at pre-format.
const resolveCaretOffsetAfterSignificantCharacters = (formattedValue: string, significantCharacterCount: number): number => {
  if (significantCharacterCount === 0) {
    return 0;
  }
  let remainingSignificantCharacters = significantCharacterCount;
  for (let characterIndex = 0; characterIndex < formattedValue.length; characterIndex = characterIndex + 1) {
    if (isSignificantCurrencyCharacter(formattedValue[characterIndex])) {
      remainingSignificantCharacters = remainingSignificantCharacters - 1;
      if (remainingSignificantCharacters === 0) {
        return characterIndex + 1;
      }
    }
  }
  return formattedValue.length;
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

const Input = (properties: InputProperties) => {
  const [local, rest] = splitProps(properties, ["class", "icon", "trailingText", "currency", "autocomplete", "disabled", "value", "onInput"]);
  const baseClasses =
    "block w-full rounded-lg border border-solid border-gray-300 bg-white text-gray-900 placeholder-gray-500 transition-colors duration-100 ease-out focus:border-blue-500 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";
  const inputProps = { step: properties.type === "number" ? "0.01" : undefined, ...rest, autocomplete: local.autocomplete ?? "off" };
  const resolvedInputProps = local.currency ? { ...inputProps, type: "text", inputMode: "decimal" as const, autocomplete: "off" } : inputProps;

  const handleCurrencyInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (event) => {
    // Reformatting rewrites the whole value, which collapses the caret to the end. Anchor it on the count
    // of significant characters (digits / decimal / minus) before the caret, then restore that anchor after
    // the reformat so mid-string edits keep the cursor where the user put it rather than jumping to the end.
    const inputElement = event.currentTarget;
    const previousValue = inputElement.value;
    const caretOffsetBeforeFormat = inputElement.selectionStart ?? previousValue.length;
    // Capture the collapsed-caret check BEFORE rewriting `.value`, since assigning `.value` collapses any
    // selection to the end and would make the comparison trivially true afterwards.
    const hadCollapsedCaret = inputElement.selectionStart === inputElement.selectionEnd;
    const significantCharactersBeforeCaret = countSignificantCurrencyCharactersBeforeCaret(previousValue, caretOffsetBeforeFormat);

    const formattedValue = formatCurrencyInputValue(previousValue);
    inputElement.value = formattedValue;

    // Only reposition when the user had a collapsed caret; leave range selections alone.
    if (hadCollapsedCaret) {
      const restoredCaretOffset = resolveCaretOffsetAfterSignificantCharacters(formattedValue, significantCharactersBeforeCaret);
      inputElement.setSelectionRange(restoredCaretOffset, restoredCaretOffset);
    }

    callBoundHandler(local.onInput, event);
  };

  const resolvedOnInput = local.currency ? handleCurrencyInput : local.onInput;

  if (!local.icon && !local.trailingText) {
    return <input class={mergeClasses(baseClasses, FORM_CONTROL_SIZE_CLASSES, local.class)} disabled={local.disabled} value={local.value} onInput={resolvedOnInput} {...resolvedInputProps} />;
  }

  return (
    <div class="relative">
      <Show when={local.icon != null}>
        <div class={mergeClasses("pointer-events-none absolute inset-y-0 left-0 flex items-center", FORM_CONTROL_LEADING_ICON_WRAPPER_CLASS)}>
          <RenderIcon icon={local.icon!} size={FORM_CONTROL_ICON_SIZE} class={CHROME_MUTED_ICON_CLASSES} />
        </div>
      </Show>
      <input
        class={mergeClasses(baseClasses, FORM_CONTROL_SIZE_CLASSES, local.icon ? FORM_CONTROL_LEADING_ICON_INPUT_CLASS : "", local.trailingText ? "pr-12" : "", local.class)}
        disabled={local.disabled}
        value={local.value}
        onInput={resolvedOnInput}
        {...resolvedInputProps}
      />
      <Show when={local.trailingText}>
        <Text as="div" size="small" color="inherit" class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400">
          {local.trailingText}
        </Text>
      </Show>
    </div>
  );
};

export { Input };
