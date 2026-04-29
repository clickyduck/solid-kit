import { IconButton } from "@/components/icon-button/IconButton";
import { closeCircle } from "@/components/icons";
import { mergeClasses } from "@/utilities";
import { Modal } from "flowbite";
import type { ModalInterface, ModalOptions } from "flowbite";
import type { ComponentProps, JSX } from "solid-js";
import { Show, createContext, createEffect, on, onCleanup, onMount, splitProps, useContext } from "solid-js";

type DialogRootProperties = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeable?: boolean;
  children?: JSX.Element;
};

const DialogContext = createContext<{ modalId: string; closeable: () => boolean; hideModal: () => void }>();

let modalIdCounter = 0;

/**
 * Dialog root using Flowbite Modal. Controls open state and provides context for sub-components.
 */
export const Dialog = (properties: DialogRootProperties) => {
  const closeable = () => {
    return properties.closeable !== false;
  };
  const modalId = `modal-${modalIdCounter++}`;
  let modalElement: HTMLElement | null = null;
  let modalInstance: ModalInterface | null = null;

  const hideModal = () => {
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  onMount(() => {
    if (modalElement) {
      const modalOptions: ModalOptions = {
        placement: "center",
        backdrop: "dynamic",
        backdropClasses: "fixed inset-0 z-40 bg-black/30 backdrop-blur-xl dark:bg-gray-900/50",
        closable: false,
        onHide: () => {
          if (properties.onOpenChange) {
            properties.onOpenChange(false);
          }
        },
        onShow: () => {
          if (properties.onOpenChange) {
            properties.onOpenChange(true);
          }
        }
      };
      modalInstance = new Modal(modalElement, modalOptions);
      if (properties.open) {
        modalInstance.show();
      }
    }
  });

  createEffect(
    on(
      () => {
        return properties.open;
      },
      (open) => {
        if (modalInstance && modalElement) {
          if (open) {
            modalInstance.show();
          } else {
            modalInstance.hide();
          }
        }
      },
      { defer: true }
    )
  );

  onCleanup(() => {
    if (modalInstance) {
      modalInstance.hide();
    }
  });

  return (
    <DialogContext.Provider value={{ modalId, closeable, hideModal }}>
      <div
        ref={(element) => {
          modalElement = element as HTMLElement;
        }}
        id={modalId}
        tabindex="-1"
        aria-hidden={properties.open === true ? "false" : "true"}
        inert={properties.open === true ? undefined : true}
        class="fixed inset-0 z-50 hidden h-dvh w-full items-stretch justify-center overflow-hidden sm:items-center md:inset-0"
      >
        {properties.children}
      </div>
    </DialogContext.Provider>
  );
};

/**
 * Button that opens the dialog. Use inside Dialog.
 */
export const DialogTrigger = (properties: ComponentProps<"button"> & { children?: JSX.Element }) => {
  return <button type="button" {...properties} />;
};

type DialogContentPropertiesType = ComponentProps<"div"> & { class?: string; children?: JSX.Element | JSX.Element[] | null | undefined };

/**
 * Dialog content wrapper with close button. Use inside Dialog.
 */
export const DialogContent = (properties: DialogContentPropertiesType) => {
  const [local, rest] = splitProps(properties, ["class", "children"]);

  return (
    <div class="relative my-auto h-dvh w-full p-0 sm:h-auto sm:max-w-2xl sm:p-4">
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

type DialogTitlePropertiesType = ComponentProps<"h3"> & { class?: string };

/**
 * Dialog title heading.
 */
export const DialogTitle = (properties: DialogTitlePropertiesType) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <h3 class={mergeClasses("text-lg font-medium text-gray-900 dark:text-white", local.class)} {...rest} />;
};

type DialogDescriptionPropertiesType = ComponentProps<"div"> & { class?: string };

/**
 * Dialog description text.
 */
export const DialogDescription = (properties: DialogDescriptionPropertiesType) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("leading-relaxed text-gray-600 dark:text-gray-300", local.class)} {...rest} />;
};

/**
 * Dialog header section. Does not shrink or scroll.
 */
export const DialogHeader = (properties: ComponentProps<"div"> & { actions?: JSX.Element }) => {
  const context = useContext(DialogContext);
  const [local, rest] = splitProps(properties, ["class", "children", "actions"]);
  const hideModal = context?.hideModal ?? (() => {});

  return (
    <div class={mergeClasses("flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-700", local.class)} {...rest}>
      <div class="flex flex-1 items-center overflow-hidden">{local.children}</div>
      <div class="flex items-center gap-2">
        <Show when={local.actions}>{local.actions}</Show>
        <Show when={context?.closeable?.()}>
          <IconButton variant="ghost" icon={closeCircle} onClick={hideModal} aria-label="Close modal" />
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
  const [local, rest] = splitProps(properties, ["class", "children"]);
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
