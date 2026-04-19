import { STATUS_DOT_DIMENSION_CLASS, STATUS_PILL_SURFACE_CLASS } from "@/utilities/controlLayoutClasses";
import { mergeClasses } from "@/utilities/mergeClasses";
import type { JSX } from "solid-js";

export type StatusVariant = "success" | "info" | "warning" | "danger" | "neutral";

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  success: "bg-green-500/15 text-green-400 ring-1 ring-inset ring-green-500/20",
  info: "bg-blue-500/15 text-blue-400 ring-1 ring-inset ring-blue-500/20",
  warning: "bg-amber-500/15 text-amber-400 ring-1 ring-inset ring-amber-500/20",
  danger: "bg-red-500/15 text-red-400 ring-1 ring-inset ring-red-500/20",
  neutral: "bg-gray-700 text-gray-300 ring-1 ring-inset ring-gray-600/40"
};

const DOT_CLASSES: Record<StatusVariant, string> = {
  success: "bg-green-400",
  info: "bg-blue-400",
  warning: "bg-amber-400",
  danger: "bg-red-400",
  neutral: "bg-gray-400"
};

type StatusProperties = {
  children: JSX.Element;
  variant?: StatusVariant;
  dot?: boolean;
  class?: string;
};

/**
 * Pill-style status label with colour variants and optional leading dot.
 */
export const Status = (properties: StatusProperties) => {
  const variant = (): StatusVariant => {
    return properties.variant ?? "neutral";
  };

  return (
    <span class={mergeClasses("inline-flex items-center gap-1.5 rounded-full font-medium", STATUS_PILL_SURFACE_CLASS, VARIANT_CLASSES[variant()], properties.class)}>
      {properties.dot && <span class={mergeClasses("rounded-full", STATUS_DOT_DIMENSION_CLASS, DOT_CLASSES[variant()])} />}
      {properties.children}
    </span>
  );
};
