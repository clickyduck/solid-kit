import type { ParentComponent } from "solid-js";

import { type TypographyBaseProps, createTypography } from "./_typography";

export type TextSize = "0" | "1" | "2" | "3" | "4";

export type TextProperties = TypographyBaseProps & {
  size?: TextSize;
  maxLength?: number;
};

const SIZE_CLASSES: Record<TextSize, string> = {
  "0": "text-4xl tracking-tight",
  "1": "text-2xl tracking-tight",
  "2": "text-base",
  "3": "text-sm",
  "4": "text-xs"
};

const Text0Impl = createTypography({ sizeClasses: SIZE_CLASSES["0"], gapClass: "gap-5", iconSize: 36, defaultWeight: "bold" });
const Text1Impl = createTypography({ sizeClasses: SIZE_CLASSES["1"], gapClass: "gap-3.5", iconSize: 24, defaultWeight: "semibold" });
const Text2Impl = createTypography({ sizeClasses: SIZE_CLASSES["2"], gapClass: "gap-2", iconSize: 16, defaultWeight: "medium" });
const Text3Impl = createTypography({ sizeClasses: SIZE_CLASSES["3"], gapClass: "gap-2", iconSize: 14, defaultWeight: "medium" });
const Text4Impl = createTypography({ sizeClasses: SIZE_CLASSES["4"], gapClass: "gap-1.5", iconSize: 12, defaultWeight: "medium" });

export const Text: ParentComponent<TextProperties> = (properties) => {
  const size = (): TextSize => properties.size ?? "2";

  const resolvedChildren = () => {
    const { maxLength, children } = properties;
    if (maxLength !== undefined && typeof children === "string" && children.length > maxLength) {
      return children.slice(0, maxLength) + "…";
    }
    return children;
  };

  const props = () => ({ ...properties, children: resolvedChildren() });

  if (size() === "0") return <Text0Impl {...props()} />;
  if (size() === "1") return <Text1Impl {...props()} />;
  if (size() === "4") return <Text4Impl {...props()} />;
  if (size() === "3") return <Text3Impl {...props()} />;
  return <Text2Impl {...props()} />;
};
