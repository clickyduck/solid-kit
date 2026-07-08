import { createEffect, createSignal, on, onCleanup } from "solid-js";

/**
 * Duration (in milliseconds) of the shared enter/exit opacity fade — the numeric
 * twin of the design system's `REVEAL_TRANSITION_DURATION` (150ms) tier. Kept in
 * sync with `FADE_TRANSITION_CLASSES` (`duration-150`) so an element is unmounted
 * only after its exit fade has finished painting.
 */
export const FADE_TRANSITION_DURATION_MS = 150;

/**
 * Shared enter/exit fade for anchored popover surfaces (Dropdown menus, the
 * DatePicker calendar): a plain opacity transition on `ease-out` per the design
 * system, at the 150ms `REVEAL_TRANSITION_DURATION` tier — no transform, so it
 * never fights popover position/flip math and stays smooth. Pair with the
 * `opacity-100` / `opacity-0` end states (see `popoverStateClasses`). Toasts
 * intentionally slide rather than fade (they enter from a screen edge, not in
 * place), so they own their own transition.
 */
export const FADE_TRANSITION_CLASSES = "transition-opacity duration-150 ease-out motion-reduce:transition-none";

export const popoverStateClasses = (entered: boolean): string => (entered ? "opacity-100" : "opacity-0");

/**
 * Enter reveal for a component that mounts into place (list items — Upload rows,
 * ArrayInput chips, toasts). Returns an `entered` accessor that is `false` on the
 * first render and flips to `true` on the next animation frame, so a transition
 * applied to the element runs from its hidden start-state instead of snapping in.
 * Pair with a `transition-*` class and two end-states, e.g.
 * `entered() ? "opacity-100" : "opacity-0"`.
 *
 * Enter-only: for exit animations the item must outlive its removal (see the
 * `exitingToastIds` deferred-unmount pattern in Toast.tsx). Callers whose list is
 * a controlled prop they don't own can't hold a removed item, so they animate
 * enter only and let removal be instant.
 */
export const createEnterReveal = (): (() => boolean) => {
  const [entered, setEntered] = createSignal(false);
  const frame = requestAnimationFrame(() => setEntered(true));
  onCleanup(() => cancelAnimationFrame(frame));
  return entered;
};

/**
 * Drives the mount/enter/exit lifecycle for an animated popover so it animates
 * both open and closed. While `open` is true the popover is mounted and, once
 * `markMeasured()` has been called (i.e. it has been positioned), transitions
 * into its open state. When `open` flips to false the popover stays mounted in
 * its exit state for one transition duration, then unmounts.
 *
 * - `shouldRender()` — keep the portal mounted (open OR still closing).
 * - `isEntered()` — apply the open end-state (feed to `popoverStateClasses`).
 * - `markMeasured()` — call after the popover has been positioned and made
 *   visible, to start the enter transition on the next frame.
 */
export const usePopoverAnimation = (open: () => boolean) => {
  const [shouldRender, setShouldRender] = createSignal(open());
  const [isEntered, setIsEntered] = createSignal(false);

  let closeTimer: number | undefined;
  let enterFrame: number | undefined;

  const clearTimers = (): void => {
    if (closeTimer !== undefined) {
      window.clearTimeout(closeTimer);
      closeTimer = undefined;
    }
    if (enterFrame !== undefined) {
      cancelAnimationFrame(enterFrame);
      enterFrame = undefined;
    }
  };

  createEffect(
    on(open, (isOpen) => {
      clearTimers();
      if (isOpen) {
        setShouldRender(true);
        // Stay in the closed end-state until markMeasured() flips us in, so the
        // enter transition runs from the closed state rather than snapping open.
        setIsEntered(false);
      } else if (shouldRender()) {
        // Play the exit transition, then unmount after it finishes.
        setIsEntered(false);
        closeTimer = window.setTimeout(() => {
          closeTimer = undefined;
          setShouldRender(false);
        }, FADE_TRANSITION_DURATION_MS);
      }
    })
  );

  const markMeasured = (): void => {
    // Only the first measurement of an open cycle starts the fade; later calls
    // (scroll/resize repositions) are no-ops so we don't churn frames.
    if (!open() || isEntered() || enterFrame !== undefined) return;
    enterFrame = requestAnimationFrame(() => {
      enterFrame = undefined;
      if (open()) setIsEntered(true);
    });
  };

  onCleanup(clearTimers);

  return { shouldRender, isEntered, markMeasured };
};
