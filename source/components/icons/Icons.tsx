import { mergeClasses } from "@/utilities";
import type { Component, ComponentProps } from "solid-js";
import { createMemo, createSignal, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

export type IconGlyphProperties = ComponentProps<"svg">;
export type IconComponent = Component<IconGlyphProperties>;

const iconModules = import.meta.glob<{ default: IconComponent }>("../../../node_modules/@material-symbols/svg-500/rounded/*-fill.svg");

const PlaceholderIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" opacity="0.25" />
    <text x="12" y="16" text-anchor="middle" font-size="11" fill="currentColor">
      ?
    </text>
  </svg>
);

const iconCache: Record<string, IconComponent> = {};
// notify signal: bumped whenever a new icon finishes loading so Icon components re-read the cache
const [iconGeneration, setIconGeneration] = createSignal(0);

const loadIcon = (name: string): void => {
  if (iconCache[name]) {
    return;
  }
  const key = `../../../node_modules/@material-symbols/svg-500/rounded/${name}-fill.svg`;
  const loader = iconModules[key];
  if (!loader) {
    iconCache[name] = PlaceholderIcon;
    return;
  }
  // Mark as in-progress with placeholder so we don't double-load
  iconCache[name] = PlaceholderIcon;
  loader().then((mod) => {
    iconCache[name] = mod.default ?? PlaceholderIcon;
    setIconGeneration((n) => n + 1);
  });
};

interface IconProperties {
  name: string;
  size?: number;
  class?: string;
  [key: string]: unknown;
}

/** Renders a rounded filled Material Symbol by name, e.g. `<Icon name="account_balance_wallet" size={20} />` */
export const Icon = (properties: IconProperties) => {
  const [local, rest] = splitProps(properties, ["name", "size", "class"]);
  const combinedClasses = mergeClasses("inline-flex shrink-0 items-center justify-center align-middle", local.class);

  // Kick off the load (no-op if already cached/loading)
  loadIcon(local.name);

  // Re-derives whenever a new icon finishes loading (iconGeneration changes)
  const resolvedComponent = createMemo(() => {
    iconGeneration();
    return iconCache[local.name] ?? PlaceholderIcon;
  });

  return <Dynamic component={resolvedComponent()} {...(rest as ComponentProps<"svg">)} {...(local.size !== undefined ? { width: local.size, height: local.size } : {})} fill="currentColor" class={combinedClasses} />;
};
