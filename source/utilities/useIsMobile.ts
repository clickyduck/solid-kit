import { createEffect, createSignal, onCleanup } from "solid-js";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = createSignal(typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);
  createEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    onCleanup(() => mediaQuery.removeEventListener("change", handleChange));
  });
  return isMobile;
};
