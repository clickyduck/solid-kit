declare module "*.css";

// Declares SVG files imported by vite-plugin-solid as SolidJS components.
declare module "*.svg" {
  import type { Component, ComponentProps } from "solid-js";
  const content: Component<ComponentProps<"svg">>;
  export default content;
}
