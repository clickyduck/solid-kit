import { RenderIcon } from "@/components/icons";
import { Text } from "@/components/typography";
import { FORM_CONTROL_ICON_SIZE, mergeClasses } from "@/utilities";
import type { ComponentProps, JSX } from "solid-js";
import { createMemo, createSignal, onCleanup, splitProps } from "solid-js";

// The same solid / outline looks as Button, so a swipe control drops in beside one: `solid` is the
// filled primary track, `outline` a bordered track on a plain surface.
type SwipeButtonVariant = "solid" | "outline";

type SwipeButtonProperties = Omit<ComponentProps<"div">, "class" | "onPointerDown" | "onPointerMove" | "onPointerUp"> & {
  /** Track label, e.g. "Swipe to pay". */
  children: JSX.Element;
  /** Called once when the thumb is dragged (or keyed) past the confirmation threshold. */
  onConfirm: () => void;
  /** Visual style, matching Button: `solid` (default) or `outline`. */
  variant?: SwipeButtonVariant;
  class?: string;
  /** Label shown once confirmed. Defaults to the resting `children`. */
  confirmLabel?: JSX.Element;
  /** Disables interaction. */
  disabled?: boolean;
  /** Fraction of the track (0–1) the thumb must pass to confirm. */
  threshold?: number;
};

// Track surface per variant, translated 1:1 from Button.getVariantClasses onto the full-bleed track.
// `solid` is the blue fill with white label text; `outline` is the bordered look on a plain surface,
// whose label sets its own neutral colour via <Text>, so the track only owns border + background.
const getTrackVariantClasses = (variant: SwipeButtonVariant = "solid"): string => {
  return variant === "solid" ? "border-2 border-transparent bg-blue-600 text-white" : "border border-solid border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800";
};

// The label colour follows the variant the same way Button's does: white on solid, secondary neutral
// (gray-800 / dark:gray-100) on outline.
const getTrackTextColor = (variant: SwipeButtonVariant = "solid"): "inherit" | "secondary" => (variant === "solid" ? "inherit" : "secondary");

// The thumb stays a filled disc so it reads as the grabbable affordance in either variant: a white
// disc with a blue glyph on the solid (coloured) track, and a blue disc with a white glyph on the
// outline (plain) track. The focus ring flips with it so it stays legible against whichever surface
// the thumb sits on — white ring over the blue track, blue ring over the plain one.
const getThumbVariantClasses = (variant: SwipeButtonVariant = "solid"): string => {
  return variant === "solid" ? "bg-white text-blue-600 focus-visible:ring-white/70" : "bg-blue-600 text-white focus-visible:ring-blue-500/70";
};

// Progress trail behind the thumb: a white wash reads over the solid blue track, a blue wash over the
// plain outline track.
const getTrailClass = (variant: SwipeButtonVariant = "solid"): string => {
  return variant === "solid" ? "bg-white/20" : "bg-blue-500/15";
};

// Thumb + 2 × track padding = 40px, so the control sits on the same h-10 grid as buttons and inputs.
const THUMB_SIZE_PX = 32;
const TRACK_PADDING_PX = 4;
const DEFAULT_THRESHOLD = 0.9;
const KEYBOARD_STEP_PX = 24;
// The thumb cue is fixed: a double-chevron at rest, a check once confirmed.
const THUMB_REST_ICON = "keyboard_double_arrow_right";
const THUMB_CONFIRMED_ICON = "check";

/**
 * Swipe-to-confirm control: the user drags (or keys) the thumb across the track
 * to commit a deliberate action. Takes the same `variant` looks as Button
 * (`solid` / `outline`); pass `class` to size it (e.g. `w-full`) or reshape it
 * (e.g. `rounded-none`).
 */
export const SwipeButton = (properties: SwipeButtonProperties) => {
  const [local, rest] = splitProps(properties, ["children", "onConfirm", "variant", "class", "confirmLabel", "disabled", "threshold"]);

  let trackElement: HTMLDivElement | undefined;
  const [offsetPx, setOffsetPx] = createSignal(0);
  const [isDragging, setIsDragging] = createSignal(false);
  const [isConfirmed, setIsConfirmed] = createSignal(false);
  let activePointerId: number | undefined;
  let pointerStartX = 0;
  let offsetAtPointerStart = 0;

  // Distance the thumb can travel: full track width minus the thumb and both inset paddings.
  const maxOffsetPx = (): number => {
    const trackWidth = trackElement?.clientWidth ?? 0;
    return Math.max(0, trackWidth - THUMB_SIZE_PX - TRACK_PADDING_PX * 2);
  };

  const thresholdFraction = createMemo(() => {
    const value = local.threshold ?? DEFAULT_THRESHOLD;
    return Math.min(1, Math.max(0, value));
  });

  const clampOffset = (value: number): number => Math.min(maxOffsetPx(), Math.max(0, value));

  const progressFraction = (): number => {
    const max = maxOffsetPx();
    return max === 0 ? 0 : offsetPx() / max;
  };

  const confirm = (): void => {
    if (isConfirmed()) {
      return;
    }
    setIsConfirmed(true);
    setOffsetPx(maxOffsetPx());
    local.onConfirm();
  };

  const settle = (): void => {
    // Past threshold → snap to the end and confirm; otherwise spring back to rest.
    if (progressFraction() >= thresholdFraction()) {
      confirm();
    } else {
      setOffsetPx(0);
    }
  };

  const releasePointer = (): void => {
    if (activePointerId !== undefined) {
      trackElement?.releasePointerCapture(activePointerId);
      activePointerId = undefined;
    }
    window.removeEventListener("pointermove", handleWindowPointerMove);
    window.removeEventListener("pointerup", handleWindowPointerUp);
    window.removeEventListener("pointercancel", handleWindowPointerUp);
  };

  const handleWindowPointerMove = (event: PointerEvent): void => {
    if (activePointerId === undefined || event.pointerId !== activePointerId) {
      return;
    }
    setOffsetPx(clampOffset(offsetAtPointerStart + (event.clientX - pointerStartX)));
  };

  const handleWindowPointerUp = (event: PointerEvent): void => {
    if (activePointerId === undefined || event.pointerId !== activePointerId) {
      return;
    }
    setIsDragging(false);
    releasePointer();
    settle();
  };

  const handleThumbPointerDown: JSX.EventHandler<HTMLButtonElement, PointerEvent> = (event) => {
    if (local.disabled || isConfirmed()) {
      return;
    }
    event.preventDefault();
    activePointerId = event.pointerId;
    pointerStartX = event.clientX;
    offsetAtPointerStart = offsetPx();
    setIsDragging(true);
    trackElement?.setPointerCapture(event.pointerId);
    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);
  };

  const handleThumbKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (event) => {
    if (local.disabled || isConfirmed()) {
      return;
    }
    switch (event.key) {
      case "Enter":
      case " ":
      case "End":
        event.preventDefault();
        confirm();
        break;
      case "ArrowRight":
        event.preventDefault();
        setOffsetPx((previous) => {
          const next = clampOffset(previous + KEYBOARD_STEP_PX);
          if (next >= maxOffsetPx()) {
            confirm();
          }
          return next;
        });
        break;
      case "ArrowLeft":
      case "Home":
        event.preventDefault();
        setOffsetPx(0);
        break;
    }
  };

  onCleanup(releasePointer);

  const thumbIcon = (): string => {
    return isConfirmed() ? THUMB_CONFIRMED_ICON : THUMB_REST_ICON;
  };

  // No transition while dragging so the thumb tracks the finger 1:1; animate the spring-back / snap.
  const motionClass = (): string => (isDragging() ? "" : "transition-[transform,width] duration-200 ease-out");

  return (
    <div
      ref={(element) => {
        trackElement = element;
      }}
      class={mergeClasses("relative flex h-10 w-64 items-center overflow-hidden rounded-full select-none", getTrackVariantClasses(local.variant), local.disabled ? "cursor-not-allowed opacity-50" : "cursor-grab", local.class)}
      style={{ padding: `${TRACK_PADDING_PX}px` }}
      aria-hidden={local.disabled ? "true" : undefined}
      {...rest}
    >
      {/* Filled progress trail behind the thumb. */}
      <div class={mergeClasses("pointer-events-none absolute inset-y-1 left-1 rounded-full", getTrailClass(local.variant), motionClass())} style={{ width: `${offsetPx() + THUMB_SIZE_PX}px` }} aria-hidden="true" />

      {/* Centred label; fades as the thumb advances. Horizontal padding only needs to clear the thumb
          (32px + 4px track padding) on the left, so pad tighter on narrow tracks — px-12 both sides
          clipped medium-length labels ("Swipe to request bill") on a phone-width control. */}
      <span class="pointer-events-none absolute inset-0 flex items-center justify-center px-9 text-center" style={{ opacity: `${Math.max(0, 1 - progressFraction() * 1.4)}` }} aria-hidden={isConfirmed() ? "true" : undefined}>
        <Text as="span" size="small" weight="medium" color={getTrackTextColor(local.variant)} display="inline" truncate>
          {isConfirmed() ? (local.confirmLabel ?? local.children) : local.children}
        </Text>
      </span>

      {/* Draggable thumb. */}
      <button
        type="button"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressFraction() * 100)}
        aria-disabled={local.disabled}
        tabIndex={local.disabled ? -1 : 0}
        disabled={local.disabled}
        class={mergeClasses(
          "relative z-10 flex aspect-square h-8 touch-none items-center justify-center rounded-full shadow-sm focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed",
          getThumbVariantClasses(local.variant),
          local.disabled ? "" : "cursor-grab active:cursor-grabbing",
          motionClass()
        )}
        style={{ transform: `translateX(${offsetPx()}px)` }}
        onPointerDown={handleThumbPointerDown}
        onKeyDown={handleThumbKeyDown}
      >
        <RenderIcon icon={thumbIcon()} size={FORM_CONTROL_ICON_SIZE} />
      </button>
    </div>
  );
};
