import { createEffect, createSignal, onCleanup } from "solid-js";

/**
 * The single "mobile" breakpoint boundary for the whole library, in CSS pixels.
 *
 * This is the min-width at which the layout is considered "desktop", and it MUST match the Tailwind
 * `md` screen (Tailwind's default `md` is `768px`). Every JS-driven responsive behaviour (`useIsMobile`,
 * and anything gating on it) reads this value, while the matching CSS behaviours use Tailwind's `md:` /
 * `max-md:` variants — so the two stay on one source of truth. If a consumer retunes the `md` screen in
 * their Tailwind config, override this constant to the same value so JS and CSS do not desync.
 */
export const MOBILE_BREAKPOINT_MIN_WIDTH_PX = 768;

/**
 * Media query that is true on "mobile" (narrower than the desktop breakpoint). Uses `768 - 0.02` rather
 * than `767` so there is no sub-pixel dead zone: a fractional viewport width (e.g. 767.5px) matches this
 * `max-width` query exactly where it stops matching the `min-width: 768px` desktop query, with no overlap
 * or gap. This mirrors Tailwind's own `max-md` boundary.
 */
export const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT_MIN_WIDTH_PX - 0.02}px)`;

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = createSignal(typeof window !== "undefined" && window.matchMedia(MOBILE_MEDIA_QUERY).matches);
  createEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    onCleanup(() => mediaQuery.removeEventListener("change", handleChange));
  });
  return isMobile;
};
