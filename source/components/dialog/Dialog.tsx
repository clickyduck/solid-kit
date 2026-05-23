import { IconButton } from "@/components/icon-button/IconButton";
import { Text } from "@/components/typography";
import { mergeClasses } from "@/utilities";
import type { ComponentProps, JSX } from "solid-js";
import { Show, createContext, createEffect, on, onCleanup, onMount, splitProps, useContext } from "solid-js";

type DialogRootProperties = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeable?: boolean;
  children?: JSX.Element;
};

const DialogContext = createContext<{ closeable: () => boolean; close: () => void }>();

/**
 * Dialog root using native <dialog> element. Controls open state and provides context for sub-components.
 */
export const Dialog = (properties: DialogRootProperties) => {
  const closeable = () => properties.closeable !== false;
  let dialogElement: HTMLDialogElement | undefined;

  const close = () => {
    dialogElement?.close();
  };

  onMount(() => {
    if (!dialogElement) return;
    if (properties.open) {
      dialogElement.showModal();
    }
  });

  createEffect(
    on(
      () => properties.open,
      (open) => {
        if (!dialogElement) return;
        if (open) {
          if (!dialogElement.open) dialogElement.showModal();
        } else {
          if (dialogElement.open) dialogElement.close();
        }
      },
      { defer: true }
    )
  );

  onMount(() => {
    const handleCancel = (event: Event): void => {
      if (!closeable()) {
        // Block native ESC dismissal when the dialog is not closeable.
        event.preventDefault();
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
      properties.onOpenChange?.(false);
    };
    dialogElement?.addEventListener("click", handleBackdropClick);
    onCleanup(() => {
      dialogElement?.removeEventListener("click", handleBackdropClick);
    });
  });

  return (
    <DialogContext.Provider value={{ closeable, close }}>
      <dialog
        ref={(el) => {
          dialogElement = el;
        }}
        class="m-0 h-dvh max-h-dvh w-full max-w-full border-0 bg-transparent p-0 backdrop:bg-black/30 backdrop:backdrop-blur-xl open:flex open:items-stretch open:justify-center sm:m-auto sm:h-auto sm:max-h-none sm:max-w-2xl sm:p-4 sm:open:items-center dark:backdrop:bg-gray-900/50"
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

/**
 * Dialog content wrapper with close button. Use inside Dialog.
 */
export const DialogContent = (properties: DialogContentPropertiesType) => {
  const [local, rest] = splitProps(properties, ["children", "class"]);

  return (
    <div class="relative h-dvh w-full p-0 sm:my-auto sm:h-auto sm:w-full">
      <div
        class={mergeClasses(
          "relative flex h-full flex-col bg-white sm:max-h-[calc(100dvh-0.75rem)] sm:rounded-lg sm:border sm:border-gray-200 sm:shadow-lg md:max-h-[calc(100dvh-4rem)] dark:bg-gray-900 dark:sm:border-gray-700 dark:sm:shadow-sm [&>form]:flex [&>form]:min-h-0 [&>form]:flex-1 [&>form]:flex-col",
          local.class
        )}
        {...rest}
      >
        {local.children}
      </div>
    </div>
  );
};

type DialogTitlePropertiesType = ComponentProps<"h3">;

/**
 * Dialog title heading.
 */
export const DialogTitle = (properties: DialogTitlePropertiesType) => {
  const [local, rest] = splitProps(properties, ["class", "children"]);
  return (
    <Text as="h3" size="body" weight="medium" color="default" display="block" class={mergeClasses("text-lg", local.class)} {...rest}>
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
 * Dialog header section. Does not shrink or scroll.
 */
export const DialogHeader = (properties: ComponentProps<"div"> & { actions?: JSX.Element }) => {
  const context = useContext(DialogContext);
  const [local, rest] = splitProps(properties, ["children", "actions", "class"]);
  const close = context?.close ?? (() => {});

  return (
    <div class={mergeClasses("flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-700", local.class)} {...rest}>
      <div class="flex flex-1 items-center overflow-hidden">{local.children}</div>
      <div class="flex items-center gap-2">
        <Show when={local.actions}>{local.actions}</Show>
        <Show when={context?.closeable?.()}>
          <IconButton variant="ghost" icon="cancel" onClick={close} aria-label="Close modal" />
        </Show>
      </div>
    </div>
  );
};

type DialogBodyPropertiesType = Omit<ComponentProps<"div">, "children"> & { children?: JSX.Element };

/**
 * Dialog body — scrollable content area.
 */
export const DialogBody = (properties: DialogBodyPropertiesType) => {
  const [local, rest] = splitProps(properties, ["children", "class"]);
  return (
    <div class={mergeClasses("min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5", local.class)} {...rest}>
      {local.children}
    </div>
  );
};

/**
 * Dialog footer — does not shrink or scroll. Buttons get equal minimum width.
 */
export const DialogFooter = (properties: ComponentProps<"div">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return (
    <div
      class={mergeClasses(
        "flex w-full shrink-0 flex-row items-stretch gap-3 border-t border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:gap-0 sm:space-x-4 dark:border-gray-700 [&>button]:min-w-32 [&>button]:flex-1 sm:[&>button]:flex-initial [&>div]:hidden sm:[&>div]:block",
        local.class
      )}
      {...rest}
    />
  );
};
