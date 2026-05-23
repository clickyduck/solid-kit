/**
 * Dispatches a Solid event handler accepting either the function or
 * `[handler, data]` bound-array form. Use only when the handler is invoked
 * from inside our own intercepting handler (where Solid's JSX compile-site
 * dispatch does not run). When forwarding `onInput`/`onChange` directly via
 * JSX, pass the prop through unwrapped instead — the compiler handles both
 * forms.
 */
export const callBoundHandler = (handler: unknown, event: Event): void => {
  if (handler === undefined || handler === null) {
    return;
  }
  if (typeof handler === "function") {
    (handler as (event: Event) => void)(event);
    return;
  }
  if (Array.isArray(handler) && typeof handler[0] === "function") {
    const boundHandler = handler[0] as (data: unknown, event: Event) => void;
    const boundData: unknown = handler[1];
    boundHandler(boundData, event);
  }
};
