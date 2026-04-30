import type { ParentComponent } from "solid-js";

import { type TypographyBaseProps, createTypography } from "./_typography";

export type TextSize = "0" | "1" | "2" | "3" | "4";

export type TextProperties = TypographyBaseProps & {
  size?: TextSize;
};

const SIZE_CLASSES: Record<TextSize, string> = {
  "0": "text-4xl tracking-tight",
  "1": "text-2xl tracking-tight",
  "2": "text-base",
  "3": "text-sm",
  "4": "text-xs"
};

const Text0Impl = createTypography({ sizeClasses: SIZE_CLASSES["0"], defaultWeight: "bold" });
const Text1Impl = createTypography({ sizeClasses: SIZE_CLASSES["1"], defaultWeight: "semibold" });
const Text2Impl = createTypography({ sizeClasses: SIZE_CLASSES["2"], defaultWeight: "medium" });
const Text3Impl = createTypography({ sizeClasses: SIZE_CLASSES["3"], defaultWeight: "medium" });
const Text4Impl = createTypography({ sizeClasses: SIZE_CLASSES["4"], defaultWeight: "medium" });

export const Text: ParentComponent<TextProperties> = (properties) => {
  const size = (): TextSize => properties.size ?? "2";
  if (size() === "0") return <Text0Impl {...properties} />;
  if (size() === "1") return <Text1Impl {...properties} />;
  if (size() === "4") return <Text4Impl {...properties} />;
  if (size() === "3") return <Text3Impl {...properties} />;
  return <Text2Impl {...properties} />;
};
