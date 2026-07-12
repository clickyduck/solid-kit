import { IconButton } from "@/components/icon-button/IconButton";
import { Text } from "@/components/typography";
import { mergeClasses } from "@/utilities";
import type { Accessor, ComponentProps, JSX } from "solid-js";
import { Show, createContext, createEffect, createSignal, on, onCleanup, onMount, splitProps, useContext } from "solid-js";

type DialogRootProperties = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeable?: boolean;
  children?: JSX.Element;
};

// Duration of the open (slide-up / fade-in) and close (slide-down / fade-out) animations, in milliseconds.
// Kept in one place so the JS close delay and the CSS transitions stay in lockstep.
const DIALOG_ANIMATION_DURATION_MILLISECONDS = 200;

type DialogContextValue = {
  closeable: Accessor<boolean>;
  // True once the OS "reduce motion" preference is active, so sub-components can skip transforms/transitions.
  prefersReducedMotion: Accessor<boolean>;
  // True while the dialog is animating out; sub-components slide the panel down during this window.
  isClosing: Accessor<boolean>;
  // True once the entrance animation has been kicked off (next frame after the dialog is shown).
  hasEntered: Accessor<boolean>;
  // Animated dismiss: plays the close animation, then closes the native dialog. Use this for every
  // dismissal (close button, swipe, programmatic) so the exit is always animated.
  requestClose: () => void;
};

const DialogContext = createContext<DialogContextValue>();

const matchesReducedMotion = (): boolean => {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Dialog root using native <dialog> element. Controls open state and provides context for sub-components.
 *
 * Opening animates the panel up from the bottom (mobile sheet) with a backdrop fade; every dismissal animates
 * the panel back down before the native dialog actually closes. Both respect `prefers-reduced-motion`.
 */
export const Dialog = (properties: DialogRootProperties) => {
  const closeable = (): boolean => {
    return properties.closeable !== false;
  };
  const [prefersReducedMotion, setPrefersReducedMotion] = createSignal(matchesReducedMotion());
  const [isClosing, setIsClosing] = createSignal(false);
  const [hasEntered, setHasEntered] = createSignal(false);
  let dialogElement: HTMLDialogElement | undefined;
  // Pending close timer, so a second dismissal during the animation does not schedule a duplicate close.
  let closeTimeoutIdentifier: ReturnType<typeof setTimeout> | undefined;

  // Show the native dialog and trigger the entrance animation.
  //
  // The slide must start from a painted from-state (panel parked offscreen, set synchronously below via
  // `setHasEntered(false)`). On the *first* open the panel goes from `display:none` to visible in the same tick
  // `showModal()` runs, so a single requestAnimationFrame can flip `hasEntered` before the from-state has ever
  // painted — leaving nothing for the transition to animate from. A double rAF guarantees the order: the first
  // frame lets the from-state paint, the second flips to the to-state. (The bottom-pinned wrapper in
  // DialogContent is what keeps the slide's anchor stable; this just sequences the paint.)
  const openDialog = (): void => {
    if (!dialogElement || dialogElement.open) {
      return;
    }
    setIsClosing(false);
    setHasEntered(false);
    dialogElement.showModal();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setHasEntered(true);
      });
    });
  };

  // Close the native dialog immediately and reset animation state.
  const finalizeClose = (): void => {
    if (closeTimeoutIdentifier !== undefined) {
      clearTimeout(closeTimeoutIdentifier);
      closeTimeoutIdentifier = undefined;
    }
    setIsClosing(false);
    setHasEntered(false);
    if (dialogElement?.open) {
      dialogElement.close();
    }
  };

  // Animated dismiss. Skips the animation entirely when reduced motion is requested.
  const requestClose = (): void => {
    if (!dialogElement?.open) {
      return;
    }
    if (prefersReducedMotion()) {
      finalizeClose();
      return;
    }
    // Already animating out: let the in-flight timer finish.
    if (isClosing()) {
      return;
    }
    setIsClosing(true);
    closeTimeoutIdentifier = setTimeout(finalizeClose, DIALOG_ANIMATION_DURATION_MILLISECONDS);
  };

  onMount(() => {
    const reducedMotionQuery: MediaQueryList = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleReducedMotionChange = (event: MediaQueryListEvent): void => {
      setPrefersReducedMotion(event.matches);
    };
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    onCleanup(() => {
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
    });
  });

  onMount(() => {
    if (properties.open) {
      openDialog();
    }
  });

  createEffect(
    on(
      () => properties.open,
      (open) => {
        if (!dialogElement) {
          return;
        }
        if (open) {
          openDialog();
        } else {
          requestClose();
        }
      },
      { defer: true }
    )
  );

  onMount(() => {
    const handleCancel = (event: Event): void => {
      // Always intercept ESC: block it when not closeable, otherwise route through the animated close path
      // instead of letting the browser close the dialog instantly.
      event.preventDefault();
      if (closeable()) {
        requestClose();
      }
    };
    const handleClose = (): void => {
      properties.onOpenChange?.(false);
    };
    dialogElement?.addEventListener("cancel", handleCancel);
    dialogElement?.addEventListener("close", handleClose);
    onCleanup(() => {
      dialogElement?.removeEventListener("cancel", handleCancel);
      dialogElement?.removeEventListener("close", handleClose);
    });
  });

  onMount(() => {
    const handleBackdropClick = (event: MouseEvent): void => {
      if (!dialogElement) {
        return;
      }
      if (!closeable()) {
        return;
      }
      // Backdrop clicks land on the <dialog> element itself; clicks on the inner
      // content card bubble up from a child. Comparing event.target identity is
      // viewport-agnostic, unlike getBoundingClientRect() which fails when the
      // dialog fills the screen (mobile full-height layout).
      if (event.target !== dialogElement) {
        return;
      }
      requestClose();
    };
    dialogElement?.addEventListener("click", handleBackdropClick);
    onCleanup(() => {
      dialogElement?.removeEventListener("click", handleBackdropClick);
    });
  });

  onCleanup(() => {
    if (closeTimeoutIdentifier !== undefined) {
      clearTimeout(closeTimeoutIdentifier);
    }
  });

  return (
    <DialogContext.Provider value={{ closeable, prefersReducedMotion, isClosing, hasEntered, requestClose }}>
      <dialog
        ref={(element) => {
          dialogElement = element;
        }}
        // No z-index by design: showModal() promotes the dialog to the browser's top layer, which paints above all
        // z-indexed content regardless of value. A z-index here would do nothing. The backdrop is the modal's own
        // scrim. This is why a dropdown/date-picker opened *outside* a dialog can never cover it — expected.
        // The backdrop fades in via the `starting:` from-state and fades out while the `closing` state is set.
        class={mergeClasses(
          "m-0 h-dvh max-h-dvh w-full max-w-full border-0 bg-transparent p-0 backdrop:bg-black/30 backdrop:opacity-100 backdrop:backdrop-blur-xl backdrop:transition-opacity backdrop:duration-200 backdrop:ease-out open:flex open:items-end open:justify-center motion-reduce:backdrop:transition-none sm:m-auto sm:h-auto sm:max-h-none sm:max-w-2xl sm:p-4 sm:open:items-center dark:backdrop:bg-gray-900/50 starting:open:backdrop:opacity-0",
          isClosing() && "backdrop:opacity-0"
        )}
      >
        {properties.children}
      </dialog>
    </DialogContext.Provider>
  );
};

/**
 * Button that opens the dialog. Use inside Dialog.
 */
export const DialogTrigger = (properties: ComponentProps<"button"> & { children?: JSX.Element }) => {
  return <button type="button" {...properties} />;
};

type DialogContentPropertiesType = ComponentProps<"div"> & { children?: JSX.Element | JSX.Element[] | null | undefined };

// Mobile breakpoint below which the dialog behaves as a bottom sheet. Mirrors Tailwind's `sm` (640px),
// so the swipe gesture is only ever active when the sheet-style layout classes are applied.
const MOBILE_BOTTOM_SHEET_QUERY = "(max-width: 639px)";
// Distance (in pixels) the sheet must slide below the collapsed detent on release to dismiss rather than snap
// back. A modest, fixed value so a normal swipe-down dismisses without dragging halfway down the screen.
const SHEET_DISMISS_OFFSET_THRESHOLD = 96;
// Minimum drag distance (in pixels) before fling velocity is allowed to decide the detent, so a short,
// fast twitch cannot fling the sheet on its own.
const SWIPE_VELOCITY_MINIMUM_DISTANCE = 24;
// Fling velocity (in pixels per millisecond, smoothed) past which a release snaps in the drag direction.
const SWIPE_VELOCITY_THRESHOLD = 0.5;
// Weight applied to each new velocity sample when smoothing, to damp single-frame spikes.
const SWIPE_VELOCITY_SMOOTHING = 0.3;
// Minimum time between pointer samples (in milliseconds) for a velocity reading to be trusted, filtering out
// the near-instant first move after pointerdown that would otherwise read as a huge spurious velocity.
const SWIPE_VELOCITY_SAMPLE_MINIMUM_MILLISECONDS = 8;
// Minimum movement (in pixels) in the swipe direction before a body swipe that has reached a scroll edge is
// handed off to the sheet. Keeps sub-pixel jitter or a stationary tap at the top of the body from grabbing the
// sheet, while staying small enough that the handoff feels immediate.
const BODY_SWIPE_HANDOFF_MINIMUM_PIXELS = 4;

// Handlers DialogContent provides to its sub-components on mobile.
//  - The `DragHandle` set drives the header, which is a pure drag handle: every drag slides the sheet down and
//    releases either snap it back or dismiss it.
//  - The `Body` set drives the scrollable body, which scrolls natively until it reaches its top edge and only
//    then hands a downward swipe off to the sheet. `registerBodyElement` lets the body hand DialogContent the
//    scroll container it reads scrollTop from. The body callbacks take raw coordinates (not events) so DialogBody
//    can feed them from either pointer events (mouse/pen) or a non-passive touch listener (touch); `moveBody`
//    returns whether the swipe has been taken over, so the touch listener knows to suppress native scrolling.
type DialogContentContextValue = {
  onDragHandlePointerDown: (event: PointerEvent) => void;
  onDragHandlePointerMove: (event: PointerEvent) => void;
  onDragHandlePointerEnd: (event: PointerEvent) => void;
  registerBodyElement: (element: HTMLElement) => void;
  beginBodyGesture: (pointerIdentifier: number, clientY: number) => void;
  moveBodyGesture: (pointerIdentifier: number, clientY: number, timeStamp: number) => boolean;
  endBodyGesture: (pointerIdentifier: number, clientY: number) => void;
};

const DialogContentContext = createContext<DialogContentContextValue>();

/**
 * Dialog content wrapper with close button. Use inside Dialog.
 *
 * On mobile widths the panel renders as a bottom sheet with two positions: collapsed (content height, capped at
 * 85dvh) and dismissed. Dragging the header slides the sheet down with the finger; releasing snaps it back to
 * collapsed or dismisses it (past a fixed distance or on a downward fling). The body participates in the same
 * gesture: it scrolls natively until it reaches its top edge and then hands a continued downward swipe off to the
 * sheet, so the panel keeps following the finger without it lifting. Opening slides the panel up from the bottom
 * and dismissing slides it back down, both honoring reduced motion. At the `sm` breakpoint and up it is the
 * centered modal card and the gesture is inert.
 */
export const DialogContent = (properties: DialogContentPropertiesType) => {
  const context = useContext(DialogContext);
  const [local, rest] = splitProps(properties, ["children", "class"]);
  let panelElement: HTMLDivElement | undefined;
  // The scrollable body element, registered by DialogBody. DialogContent reads its scrollTop to decide when a
  // downward body swipe has reached the top edge and should hand the gesture off to the sheet.
  let bodyElement: HTMLElement | undefined;
  // Active drag, or undefined when neither the header nor the body is driving the sheet. Captures the starting
  // offset and pointer position so the panel can follow the finger down and a fling can be judged on release.
  let activeDrag:
    | {
        pointerIdentifier: number;
        startClientY: number;
        startOffsetPixels: number;
        lastClientY: number;
        lastTimestamp: number;
        smoothedVelocity: number;
        hasVelocitySample: boolean;
      }
    | undefined;
  // A touch that started inside the body but has not (yet) been handed off to the sheet. While pending, the body
  // scrolls natively; on each move we test whether the body has reached its top edge and, if so, promote this
  // into an `activeDrag` rebased to the current finger position (so the sheet does not jump).
  let pendingBodyGesture:
    | {
        pointerIdentifier: number;
        startClientY: number;
      }
    | undefined;

  const isMobileBottomSheet = (): boolean => {
    return typeof window !== "undefined" && window.matchMedia(MOBILE_BOTTOM_SHEET_QUERY).matches;
  };

  // The inline transition used whenever a transform change should animate (entrance, exit, and the settle-back
  // after a drag). The live finger-follow passes animate=false for an instant `none` transition so the panel
  // tracks the pointer without lag.
  const animatedTransition = `transform ${DIALOG_ANIMATION_DURATION_MILLISECONDS}ms ease-out`;

  // Apply a translateY to the panel directly. Inline style is the single source of transform truth on mobile;
  // on desktop the transform is never set, so the desktop fade classes apply unobstructed.
  const setPanelTransform = (value: string, animate: boolean): void => {
    if (!panelElement) {
      return;
    }
    panelElement.style.transition = animate ? animatedTransition : "none";
    panelElement.style.transform = value === "" ? "" : `translateY(${value})`;
  };

  // The panel's current downward offset in pixels, read from its live transform matrix (m42 is translateY).
  const currentOffsetPixels = (): number => {
    if (!panelElement) {
      return 0;
    }
    return Math.max(0, new DOMMatrixReadOnly(getComputedStyle(panelElement).transform).m42);
  };

  // Settle the sheet after a drag: either animate the offset back to 0 (collapsed) or route through the root's
  // animated close (dismissed). Reduced motion snaps without a transition.
  const settleToDetent = (detent: "collapsed" | "dismissed"): void => {
    if (detent === "dismissed") {
      context?.requestClose();
      return;
    }
    setPanelTransform("0px", !(context?.prefersReducedMotion() ?? false));
  };

  // Drive the entrance and exit slide on mobile from the root's animation state. Reduced motion or desktop
  // leaves the inline transform untouched (instant, or handled by desktop CSS classes respectively).
  //
  // This effect just maps the current animation state to a transform; it does not orchestrate frame timing.
  // `openDialog` guarantees (via a double requestAnimationFrame) that the parked from-state below has painted
  // before `hasEntered` flips to true, so by the time the entered branch runs the slide-to-0 already has a
  // committed, visible origin and no per-frame reflow dance is needed here.
  createEffect(() => {
    const closing: boolean = context?.isClosing() ?? false;
    const entered: boolean = context?.hasEntered() ?? true;
    if (!isMobileBottomSheet() || (context?.prefersReducedMotion() ?? false)) {
      setPanelTransform("", false);
      return;
    }
    if (closing) {
      // Slide fully offscreen (own height) downward. The wrapper is pinned to the viewport bottom, so the panel's
      // bottom edge sits at the fold and translating by 100% of its own height clears it completely.
      setPanelTransform("100%", true);
      return;
    }
    if (!entered) {
      // Pre-entrance from-state: parked just below the fold (100% of the panel's height), no transition so the
      // slide-in reads cleanly. Stable because the bottom-pinned wrapper gives the panel a fixed resting edge.
      setPanelTransform("100%", false);
      return;
    }
    // Entered: slide up to rest. The from-state has already painted, so this animates from a real origin.
    setPanelTransform("0px", true);
  });

  // Shared guard: a sheet drag may only begin on mobile, when dismissible, on the primary pointer, and never
  // mid-exit. Used by both the header (drag handle) and the body (before it hands the gesture off).
  const canBeginSheetDrag = (button: number): boolean => {
    if (!isMobileBottomSheet()) {
      return false;
    }
    if (!(context?.closeable() ?? true)) {
      return false;
    }
    if (button !== 0) {
      return false;
    }
    if (context?.isClosing() ?? false) {
      return false;
    }
    return panelElement !== undefined;
  };

  // Start tracking a drag, anchored at `anchorClientY`. The header anchors at the pointerdown position (the
  // gesture is the drag from its first pixel); the body anchors at the position where it hands off, so the sheet
  // starts exactly where the finger is and does not jump by the distance the body already scrolled. The starting
  // offset is captured so a drag begun mid-animation (or after a previous partial drag) continues from where the
  // panel actually sits.
  const beginDrag = (pointerIdentifier: number, anchorClientY: number, timeStamp: number): void => {
    activeDrag = {
      pointerIdentifier,
      startClientY: anchorClientY,
      startOffsetPixels: currentOffsetPixels(),
      lastClientY: anchorClientY,
      lastTimestamp: timeStamp,
      smoothedVelocity: 0,
      hasVelocitySample: false
    };
  };

  // Drive a live drag: sample velocity, then slide the panel to follow the finger. The sheet only moves
  // downward — an upward drag clamps at the collapsed rest position (offset 0) since there is no taller detent.
  const updateDrag = (currentClientY: number, timeStamp: number): void => {
    if (!activeDrag || !panelElement) {
      return;
    }
    const elapsedMilliseconds: number = timeStamp - activeDrag.lastTimestamp;
    if (elapsedMilliseconds >= SWIPE_VELOCITY_SAMPLE_MINIMUM_MILLISECONDS) {
      const instantaneousVelocity: number = (currentClientY - activeDrag.lastClientY) / elapsedMilliseconds;
      if (!activeDrag.hasVelocitySample) {
        // Seed from the first trustworthy sample so a short, fast flick (a couple of moves) registers its true
        // speed rather than being dragged toward zero by the smoothing.
        activeDrag.smoothedVelocity = instantaneousVelocity;
        activeDrag.hasVelocitySample = true;
      } else {
        // Low-pass filter thereafter to damp single-frame velocity spikes.
        activeDrag.smoothedVelocity = activeDrag.smoothedVelocity * (1 - SWIPE_VELOCITY_SMOOTHING) + instantaneousVelocity * SWIPE_VELOCITY_SMOOTHING;
      }
      activeDrag.lastClientY = currentClientY;
      activeDrag.lastTimestamp = timeStamp;
    }
    const offsetPixels: number = Math.max(0, activeDrag.startOffsetPixels + (currentClientY - activeDrag.startClientY));
    setPanelTransform(`${offsetPixels}px`, false);
  };

  // Finish a drag and snap to a detent: dismiss when flung downward or dragged past the fixed offset threshold,
  // otherwise settle back to collapsed. Shared by the header and the body (once it has handed off).
  const endDrag = (pointerIdentifier: number, clientY: number): void => {
    if (!activeDrag || activeDrag.pointerIdentifier !== pointerIdentifier) {
      return;
    }
    const velocity: number = activeDrag.smoothedVelocity;
    const totalDragDistance: number = Math.abs(clientY - activeDrag.startClientY);
    const flingingDown: boolean = totalDragDistance > SWIPE_VELOCITY_MINIMUM_DISTANCE && velocity > SWIPE_VELOCITY_THRESHOLD;
    const offsetPixels: number = currentOffsetPixels();
    activeDrag = undefined;
    settleToDetent(flingingDown || offsetPixels > SHEET_DISMISS_OFFSET_THRESHOLD ? "dismissed" : "collapsed");
  };

  const onDragHandlePointerDown = (event: PointerEvent): void => {
    if (!canBeginSheetDrag(event.button)) {
      return;
    }
    // Do not start a drag from an interactive control (e.g. the close button); let it handle its own click.
    if (event.target instanceof Element && event.target.closest("button, a, input, select, textarea")) {
      return;
    }
    // Engage immediately: the header is not a scroll container, so there is nothing to yield to.
    beginDrag(event.pointerId, event.clientY, event.timeStamp);
    if (event.currentTarget instanceof Element) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const onDragHandlePointerMove = (event: PointerEvent): void => {
    if (!activeDrag || event.pointerId !== activeDrag.pointerIdentifier) {
      return;
    }
    updateDrag(event.clientY, event.timeStamp);
  };

  const onDragHandlePointerEnd = (event: PointerEvent): void => {
    endDrag(event.pointerId, event.clientY);
  };

  // DialogBody hands DialogContent its scroll container so the handoff logic can read its scrollTop.
  const registerBodyElement = (element: HTMLElement): void => {
    bodyElement = element;
  };

  // Record a candidate body gesture but yield to native scrolling for now; moveBodyGesture decides whether and
  // when to hand the swipe off to the sheet. Started from raw coordinates so it works for pointer and touch alike.
  const beginBodyGesture = (pointerIdentifier: number, clientY: number): void => {
    if (!canBeginSheetDrag(0)) {
      return;
    }
    pendingBodyGesture = { pointerIdentifier, startClientY: clientY };
  };

  // Advance a body gesture. Returns true once the sheet is being dragged (so a touch caller suppresses native
  // scrolling). While the body still has room to scroll up, or the swipe is upward, this returns false and lets
  // the body scroll. The instant a downward swipe reaches the top edge it promotes the gesture into a sheet drag,
  // anchored at the current finger position so the sheet picks up seamlessly from where scrolling left off.
  const moveBodyGesture = (pointerIdentifier: number, clientY: number, timeStamp: number): boolean => {
    if (activeDrag && activeDrag.pointerIdentifier === pointerIdentifier) {
      updateDrag(clientY, timeStamp);
      return true;
    }
    if (!pendingBodyGesture || pendingBodyGesture.pointerIdentifier !== pointerIdentifier) {
      return false;
    }
    const deltaY: number = clientY - pendingBodyGesture.startClientY;
    // Only a downward swipe (deltaY > 0) past a small threshold, once the body is scrolled to its top, hands off.
    if (deltaY < BODY_SWIPE_HANDOFF_MINIMUM_PIXELS || (bodyElement?.scrollTop ?? 0) > 0) {
      return false;
    }
    pendingBodyGesture = undefined;
    beginDrag(pointerIdentifier, clientY, timeStamp);
    updateDrag(clientY, timeStamp);
    return true;
  };

  const endBodyGesture = (pointerIdentifier: number, clientY: number): void => {
    if (pendingBodyGesture?.pointerIdentifier === pointerIdentifier) {
      pendingBodyGesture = undefined;
    }
    // If the swipe was handed off to the sheet, settle it; otherwise it was a plain scroll and there is nothing
    // to settle (endDrag no-ops when there is no matching active drag).
    endDrag(pointerIdentifier, clientY);
  };

  return (
    <DialogContentContext.Provider value={{ onDragHandlePointerDown, onDragHandlePointerMove, onDragHandlePointerEnd, registerBodyElement, beginBodyGesture, moveBodyGesture, endBodyGesture }}>
      {/*
        Mobile: pin the sheet wrapper to the viewport bottom with `fixed inset-x-0 bottom-0` rather than relying
        on the dialog's `open:items-end` flex alignment. The dialog is `h-dvh`, and on the first open the mobile
        `dvh` value resolves a frame late (the URL bar / top-layer entry), so a flex `items-end` anchor shifts
        between frames — the entrance slide then animates against a moving anchor and the panel visibly jumps to
        the top and back (only on tall sheets, where the shift is large). A fixed `bottom-0` anchor is resolved
        from the real viewport edge on the first frame and never moves, so the slide has a static origin. Reset to
        `static` at `sm:` so the desktop centered-card flex layout is unchanged.
      */}
      <div class="fixed inset-x-0 bottom-0 w-full p-0 sm:static sm:my-auto sm:h-auto sm:w-full">
        <div
          ref={(element) => {
            panelElement = element;
          }}
          // Mobile: bottom sheet — content height capped at 85dvh with a rounded top, slid down imperatively
          // while dragging/settling. Desktop: centered modal card that fades/rises in. The drag handlers live on
          // DialogHeader (the drag handle); the body hands its downward swipe off once scrolled to the top.
          class={mergeClasses(
            "relative flex max-h-[85dvh] flex-col rounded-t-2xl border-t border-gray-200 bg-white shadow-lg sm:rounded-lg sm:border sm:border-gray-200 sm:shadow-lg sm:transition-none md:max-h-[calc(100dvh-4rem)] dark:border-gray-700 dark:bg-gray-900 dark:sm:border-gray-700 dark:sm:shadow-sm [&>form]:flex [&>form]:min-h-0 [&>form]:flex-1 [&>form]:flex-col",
            "sm:max-h-[calc(100dvh-0.75rem)]",
            // Desktop-only entrance fade/rise, keyed off the root's open state.
            !(context?.hasEntered() ?? true) || (context?.isClosing() ?? false) ? "sm:translate-y-1 sm:opacity-0" : "sm:translate-y-0 sm:opacity-100",
            local.class
          )}
          {...rest}
        >
          {local.children}
        </div>
      </div>
    </DialogContentContext.Provider>
  );
};

type DialogTitlePropertiesType = ComponentProps<"h3">;

/**
 * Dialog title heading.
 */
export const DialogTitle = (properties: DialogTitlePropertiesType) => {
  const [local, rest] = splitProps(properties, ["class", "children"]);
  return (
    <Text as="h3" size="heading" weight="medium" transform="title" color="default" display="block" class={local.class} {...rest}>
      {local.children}
    </Text>
  );
};

type DialogDescriptionPropertiesType = ComponentProps<"div">;

/**
 * Dialog description text.
 */
export const DialogDescription = (properties: DialogDescriptionPropertiesType) => {
  const [local, rest] = splitProps(properties, ["class", "children"]);
  return (
    <Text as="div" color="secondary" display="block" class={mergeClasses("leading-relaxed", local.class)} {...rest}>
      {local.children}
    </Text>
  );
};

/**
 * Dialog header section. Does not shrink or scroll. On mobile it doubles as the bottom sheet's drag handle.
 */
export const DialogHeader = (properties: ComponentProps<"div"> & { actions?: JSX.Element }) => {
  const context = useContext(DialogContext);
  const contentContext = useContext(DialogContentContext);
  const [local, rest] = splitProps(properties, ["children", "actions", "class"]);
  const requestClose = (): void => {
    context?.requestClose();
  };

  return (
    <div
      // The header is the bottom sheet's drag handle on mobile. `touch-none` (mobile only) lets it own vertical
      // drags without the browser hijacking them as scroll; the grab cursor hints the affordance. Interactive
      // controls inside (the close button) are excluded from the drag and still receive their own events.
      class={mergeClasses(
        "flex shrink-0 cursor-grab touch-none items-center justify-between border-b border-gray-200 p-3 active:cursor-grabbing sm:cursor-auto sm:touch-auto sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-4 dark:border-gray-700",
        local.class
      )}
      onPointerDown={contentContext?.onDragHandlePointerDown}
      onPointerMove={contentContext?.onDragHandlePointerMove}
      onPointerUp={contentContext?.onDragHandlePointerEnd}
      onPointerCancel={contentContext?.onDragHandlePointerEnd}
      {...rest}
    >
      <div class="flex flex-1 items-center overflow-hidden">{local.children}</div>
      <div class="flex items-center gap-2">
        <Show when={local.actions}>{local.actions}</Show>
        <Show when={context?.closeable()}>
          <IconButton variant="ghost" icon="cancel" onClick={requestClose} aria-label="Close modal" />
        </Show>
      </div>
    </div>
  );
};

type DialogBodyPropertiesType = Omit<ComponentProps<"div">, "children"> & { children?: JSX.Element };

/**
 * Dialog body — scrollable content area.
 *
 * On mobile it participates in the bottom sheet's swipe gesture: it scrolls its content normally, and once
 * scrolled to the top a continued downward swipe is handed off to the sheet (which then follows the finger toward
 * dismissal). Touch is handled through a non-passive `touchmove` listener so native scrolling can be suppressed
 * at the moment of handoff; mouse/pen go through pointer events. At `sm` and up the gesture is inert.
 */
export const DialogBody = (properties: DialogBodyPropertiesType) => {
  const contentContext = useContext(DialogContentContext);
  const [local, rest] = splitProps(properties, ["children", "class"]);
  let bodyElement: HTMLDivElement | undefined;

  // Touch handoff: drive the body gesture from the active touch and, once the sheet has taken the swipe over,
  // preventDefault so the body stops scrolling and only the sheet moves. The listener must be non-passive for
  // preventDefault to take effect, which is why it is attached imperatively rather than via a JSX prop.
  onMount(() => {
    if (!bodyElement || !contentContext) {
      return;
    }
    const element: HTMLDivElement = bodyElement;
    const handleTouchStart = (event: TouchEvent): void => {
      const touch: Touch | undefined = event.changedTouches[0];
      if (touch) {
        contentContext.beginBodyGesture(touch.identifier, touch.clientY);
      }
    };
    const handleTouchMove = (event: TouchEvent): void => {
      const touch: Touch | undefined = event.changedTouches[0];
      if (touch && contentContext.moveBodyGesture(touch.identifier, touch.clientY, event.timeStamp) && event.cancelable) {
        event.preventDefault();
      }
    };
    const handleTouchEnd = (event: TouchEvent): void => {
      const touch: Touch | undefined = event.changedTouches[0];
      if (touch) {
        contentContext.endBodyGesture(touch.identifier, touch.clientY);
      }
    };
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });
    element.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    onCleanup(() => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("touchcancel", handleTouchEnd);
    });
  });

  // Mouse/pen handoff via pointer events. Touch is excluded here (the touch listener above owns it). There is no
  // native scroll to fight for a mouse drag, so once the gesture is taken over we just capture the pointer to
  // keep tracking it if the cursor leaves the body.
  const onPointerDown = (event: PointerEvent): void => {
    if (event.pointerType === "touch") {
      return;
    }
    contentContext?.beginBodyGesture(event.pointerId, event.clientY);
  };
  const onPointerMove = (event: PointerEvent): void => {
    if (event.pointerType === "touch") {
      return;
    }
    if ((contentContext?.moveBodyGesture(event.pointerId, event.clientY, event.timeStamp) ?? false) && event.currentTarget instanceof Element) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };
  const onPointerEnd = (event: PointerEvent): void => {
    if (event.pointerType === "touch") {
      return;
    }
    contentContext?.endBodyGesture(event.pointerId, event.clientY);
  };

  return (
    <div
      ref={(element) => {
        bodyElement = element;
        contentContext?.registerBodyElement(element);
      }}
      class={mergeClasses("min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain bg-gray-100 p-3 sm:p-4 md:p-5 lg:p-6 dark:bg-gray-950", local.class)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      {...rest}
    >
      {local.children}
    </div>
  );
};

/**
 * Dialog footer — does not shrink or scroll. Buttons stretch to fill the row width
 * equally at every breakpoint, so they read as full, consistent-height controls
 * rather than collapsing to content width on desktop.
 */
export const DialogFooter = (properties: ComponentProps<"div">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("flex w-full shrink-0 flex-row items-center gap-3 border-t border-gray-200 p-3 sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-4 dark:border-gray-700 [&>button]:flex-1 [&>div]:hidden", local.class)} {...rest} />;
};
