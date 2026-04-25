import { Button } from "@/components/button/Button";
import { IconButton } from "@/components/icon-button/IconButton";
import { Icon, type IconComponent, chevronDown, search } from "@/components/icons";
import {
  CHROME_MUTED_ICON_CLASSES,
  DROPDOWN_MENU_SURFACE_CLASSES,
  FORM_CONTROL_DROP_DOWN_CONTENT_MIN_WIDTH_CLASS_BY_SIZE,
  FORM_CONTROL_DROP_DOWN_MENU_ITEM_ANCHOR_CLASS_BY_SIZE,
  FORM_CONTROL_DROP_DOWN_MENU_LIST_CLASS_BY_SIZE,
  FORM_CONTROL_DROP_DOWN_MENU_PANEL_CLASS_BY_SIZE,
  FORM_CONTROL_DROP_DOWN_MENU_SEARCH_WRAPPER_CLASS_BY_SIZE,
  FORM_CONTROL_ICON_SIZE,
  FORM_CONTROL_LEADING_ICON_INPUT_CLASS,
  FORM_CONTROL_LEADING_ICON_WRAPPER_CLASS,
  FORM_CONTROL_SIZE_CLASSES,
  FORM_CONTROL_TEXT_CLASS_BY_SIZE,
  type FormControlSize,
  mergeClasses,
  useEffectiveFormControlSize
} from "@/utilities";
import type { Accessor, Component, ComponentProps, JSX } from "solid-js";
import { For, ParentComponent, Show, createContext, createEffect, createMemo, createSignal, on, onCleanup, onMount, splitProps, useContext } from "solid-js";
import { Portal } from "solid-js/web";

type DropdownContextType = {
  options: string[];
  value: string | undefined;
  onChange: ((value: string | undefined) => void) | undefined;
  disabled: () => boolean | undefined;
  selectedValue: () => string | undefined;
  setSelectedValue: (value: string | undefined) => void;
  dropdownOpen: () => boolean;
  setDropdownOpen: (open: boolean) => void;
  searchable: boolean;
  filteredOptions: () => string[];
  effectiveFormControlSize: Accessor<FormControlSize>;
  getDropdownContainerElement: () => HTMLDivElement | undefined;
  setContentPortalMenuElement: (element: HTMLElement | null) => void;
};

const DropdownContext = createContext<DropdownContextType>();

export const useDropdownContext = (): DropdownContextType => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("useDropdownContext must be used within Dropdown");
  }
  return context;
};

type DropdownMenuPosition = {
  top: number;
  left: number;
  width: number;
};

type DropdownRootProperties = {
  options: string[];
  value?: string;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
  searchable?: boolean;
  itemComponent?: (props: { item: { rawValue: string } }) => JSX.Element;
  children: JSX.Element;
  menuClass?: string;
  menuFullWidth?: boolean;
  class?: string;
  usePortal?: boolean;
  initialOpen?: boolean;
};

type DropdownBuiltInSearchFieldProperties = {
  searchQuery: () => string;
  setSearchQuery: (value: string) => void;
  searchInputReference: (element: HTMLInputElement) => void;
  effectiveFormControlSize: Accessor<FormControlSize>;
};

const DropdownBuiltInSearchField: Component<DropdownBuiltInSearchFieldProperties> = (properties) => {
  return (
    <div class={FORM_CONTROL_DROP_DOWN_MENU_SEARCH_WRAPPER_CLASS_BY_SIZE[properties.effectiveFormControlSize()]}>
      <div class="relative">
        <div class={mergeClasses("pointer-events-none absolute inset-y-0 left-0 flex items-center", FORM_CONTROL_LEADING_ICON_WRAPPER_CLASS)}>
          <Icon
            icon={search}
            width={FORM_CONTROL_ICON_SIZE[properties.effectiveFormControlSize()]}
            height={FORM_CONTROL_ICON_SIZE[properties.effectiveFormControlSize()]}
            class={mergeClasses("pointer-events-none shrink-0", CHROME_MUTED_ICON_CLASSES)}
            aria-hidden="true"
          />
        </div>
        <input
          ref={properties.searchInputReference}
          type="text"
          value={properties.searchQuery()}
          onInput={(event) => {
            properties.setSearchQuery(event.currentTarget.value);
          }}
          placeholder="Search…"
          class={mergeClasses(
            "block w-full rounded-lg border border-solid border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors duration-150 focus:border-blue-500 focus:ring-0 focus:outline-none dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400",
            FORM_CONTROL_SIZE_CLASSES[properties.effectiveFormControlSize()],
            FORM_CONTROL_LEADING_ICON_INPUT_CLASS,
            "pr-3"
          )}
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
      </div>
    </div>
  );
};

type DropdownBuiltInOptionsListProperties = {
  filteredOptions: () => string[];
  selectedValue: () => string | undefined;
  itemComponent: DropdownRootProperties["itemComponent"];
  onSelectOption: (option: string) => void;
  effectiveFormControlSize: Accessor<FormControlSize>;
};

const DropdownBuiltInOptionsList: Component<DropdownBuiltInOptionsListProperties> = (properties) => {
  return (
    <ul class={FORM_CONTROL_DROP_DOWN_MENU_LIST_CLASS_BY_SIZE[properties.effectiveFormControlSize()]}>
      <Show when={properties.filteredOptions().length > 0} fallback={<li class="py-4 text-center text-gray-500 dark:text-gray-400">No matches found</li>}>
        <For each={properties.filteredOptions()}>
          {(option: string) => {
            const selectedClasses = properties.selectedValue() === option ? "bg-blue-600/15 text-blue-800 dark:bg-blue-600/20 dark:text-blue-200" : "";
            const itemClass = (): string => FORM_CONTROL_DROP_DOWN_MENU_ITEM_ANCHOR_CLASS_BY_SIZE[properties.effectiveFormControlSize()];
            if (properties.itemComponent) {
              return (
                <li>
                  <a
                    href="#"
                    class={mergeClasses(itemClass(), selectedClasses)}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      properties.onSelectOption(option);
                    }}
                  >
                    {properties.itemComponent({ item: { rawValue: option } })}
                  </a>
                </li>
              );
            }
            return (
              <li>
                <a
                  href="#"
                  class={mergeClasses(itemClass(), selectedClasses)}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    properties.onSelectOption(option);
                  }}
                >
                  {option}
                </a>
              </li>
            );
          }}
        </For>
      </Show>
    </ul>
  );
};

/**
 * Dropdown root. Provides options, value, onChange and open state via context.
 */
const Dropdown = (properties: DropdownRootProperties) => {
  const [local] = splitProps(properties, ["options", "value", "onChange", "disabled", "searchable", "itemComponent", "children", "menuClass", "menuFullWidth", "class", "usePortal", "initialOpen"]);
  const effectiveFormControlSize = useEffectiveFormControlSize();
  const [selectedValue, setSelectedValue] = createSignal(properties.value);
  const [dropdownOpen, setDropdownOpen] = createSignal(local.initialOpen ?? false);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [portalPosition, setPortalPosition] = createSignal<DropdownMenuPosition | null>(null);
  let dropdownContainerElement: HTMLDivElement | undefined;
  let contentPortalMenuElement: HTMLElement | null = null;
  let searchInputElement: HTMLInputElement | undefined;

  const disabledState = createMemo(() => properties.disabled);
  const isSearchable = () => properties.searchable === true;
  const filteredOptions = createMemo(() => {
    const query = searchQuery().trim().toLowerCase();
    if (!isSearchable() || query === "") {
      return properties.options;
    }
    return properties.options.filter((option) => option.toLowerCase().includes(query));
  });

  createEffect(
    on(
      () => properties.value,
      (value) => {
        setSelectedValue(value);
      }
    )
  );

  createEffect(
    on(dropdownOpen, (open) => {
      if (!open) {
        setSearchQuery("");
      }
    })
  );

  createEffect(
    on([dropdownOpen, isSearchable], ([open, searchable]) => {
      if (open && searchable) {
        requestAnimationFrame(() => {
          searchInputElement?.focus();
        });
      }
    })
  );

  createEffect(
    on([dropdownOpen, () => properties.usePortal], ([open, usePortal]) => {
      if (!open || !usePortal) {
        setPortalPosition(null);
        return;
      }
      const updatePosition = () => {
        if (!dropdownContainerElement) {
          return;
        }
        const rectangle = dropdownContainerElement.getBoundingClientRect();
        setPortalPosition({
          top: rectangle.bottom + 4,
          left: rectangle.left,
          width: rectangle.width
        });
      };
      requestAnimationFrame(updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      onCleanup(() => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      });
    })
  );

  onMount(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (dropdownContainerElement?.contains(event.target as Node)) {
        return;
      }
      if (contentPortalMenuElement?.contains(event.target as Node)) {
        return;
      }
      setDropdownOpen(false);
    };
    document.addEventListener("click", handleDocumentClick);
    onCleanup(() => {
      document.removeEventListener("click", handleDocumentClick);
    });
  });

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    if (properties.onChange) {
      properties.onChange(value);
    }
    setDropdownOpen(false);
  };

  const contextValue: DropdownContextType = {
    options: properties.options,
    value: properties.value,
    onChange: properties.onChange,
    disabled: disabledState,
    selectedValue,
    setSelectedValue,
    dropdownOpen,
    setDropdownOpen,
    searchable: isSearchable(),
    filteredOptions,
    effectiveFormControlSize,
    getDropdownContainerElement: () => dropdownContainerElement,
    setContentPortalMenuElement: (element: HTMLElement | null) => {
      contentPortalMenuElement = element;
    }
  };

  const assignSearchInputReference = (element: HTMLInputElement) => {
    searchInputElement = element;
  };

  const builtInMenuChromeClass = () => mergeClasses(DROPDOWN_MENU_SURFACE_CLASSES, local.menuClass);

  return (
    <DropdownContext.Provider value={contextValue}>
      <div
        ref={(element) => {
          dropdownContainerElement = element;
        }}
        class={mergeClasses("relative", local.class)}
      >
        {local.children}
        <Show when={dropdownOpen() && !disabledState() && properties.options.length > 0 && !properties.usePortal}>
          <div class={mergeClasses("absolute top-full z-10 mt-1", local.menuFullWidth !== false ? "left-0 w-full" : "", builtInMenuChromeClass())}>
            <Show when={isSearchable()}>
              <DropdownBuiltInSearchField searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchInputReference={assignSearchInputReference} effectiveFormControlSize={effectiveFormControlSize} />
            </Show>
            <DropdownBuiltInOptionsList filteredOptions={filteredOptions} selectedValue={selectedValue} itemComponent={properties.itemComponent} onSelectOption={handleSelect} effectiveFormControlSize={effectiveFormControlSize} />
          </div>
        </Show>
        <Show when={dropdownOpen() && !disabledState() && properties.options.length > 0 && properties.usePortal && portalPosition()}>
          {(position) => (
            <Portal mount={document.body}>
              <div class={mergeClasses("z-50 min-w-min", builtInMenuChromeClass())} style={{ position: "fixed", top: `${position().top}px`, left: `${position().left}px`, width: `${position().width}px` }}>
                <Show when={isSearchable()}>
                  <DropdownBuiltInSearchField searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchInputReference={assignSearchInputReference} effectiveFormControlSize={effectiveFormControlSize} />
                </Show>
                <DropdownBuiltInOptionsList filteredOptions={filteredOptions} selectedValue={selectedValue} itemComponent={properties.itemComponent} onSelectOption={handleSelect} effectiveFormControlSize={effectiveFormControlSize} />
              </div>
            </Portal>
          )}
        </Show>
      </div>
    </DropdownContext.Provider>
  );
};

/**
 * Displays the selected value. Use inside Dropdown.
 */
const DropdownValue: ParentComponent<ComponentProps<"div">> = (properties) => {
  const context = useDropdownContext();
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("min-w-0 flex-1 truncate text-left", FORM_CONTROL_TEXT_CLASS_BY_SIZE[context.effectiveFormControlSize()], local.class)} {...rest} />;
};

type DropdownTriggerWithLabel = Omit<ComponentProps<typeof Button>, "variant"> & {
  children: JSX.Element;
  icon?: IconComponent;
};

type DropdownTriggerIconOnly = Omit<ComponentProps<typeof IconButton>, "variant" | "children"> & {
  children?: undefined;
};

type DropdownTriggerProperties = DropdownTriggerWithLabel | DropdownTriggerIconOnly;

/**
 * Button that toggles the menu. Use inside Dropdown.
 * Styling is fixed to the outline trigger (text or icon-only).
 */
const DropdownTrigger = (properties: DropdownTriggerProperties) => {
  const context = useDropdownContext();
  const [local, rest] = splitProps(properties, ["class", "children", "onClick", "id", "icon"]);

  const resolvedIcon = (): IconComponent | undefined => {
    if (!local.icon) {
      return undefined;
    }
    return local.icon;
  };

  const triggerButtonClass = (): string => {
    return mergeClasses("w-full min-w-0 justify-between text-left font-medium aria-expanded:bg-gray-100 dark:aria-expanded:bg-gray-700", local.class);
  };

  if (!local.children) {
    return (
      <IconButton
        id={local.id}
        variant="outline"
        icon={local.icon ?? chevronDown}
        class={local.class}
        onClick={(event) => {
          if (context.disabled()) {
            return;
          }
          event.stopPropagation();
          context.setDropdownOpen(!context.dropdownOpen());
          if (typeof local.onClick === "function") {
            local.onClick(event);
          }
        }}
        disabled={context.disabled()}
        aria-expanded={context.dropdownOpen()}
        aria-haspopup="true"
        {...rest}
      />
    );
  }

  return (
    <Button
      id={local.id}
      variant="outline"
      icon={chevronDown}
      iconPosition="end"
      class={triggerButtonClass()}
      onClick={(event) => {
        if (context.disabled()) {
          return;
        }
        event.stopPropagation();
        context.setDropdownOpen(!context.dropdownOpen());
        if (typeof local.onClick === "function") {
          local.onClick(event);
        }
      }}
      disabled={context.disabled()}
      aria-expanded={context.dropdownOpen()}
      aria-haspopup="true"
      {...rest}
    >
      <span class="flex min-w-0 flex-1 items-center gap-2">
        <Show when={resolvedIcon()}>
          {(iconComponentAccessor) => {
            return (
              <Icon
                icon={iconComponentAccessor()}
                width={FORM_CONTROL_ICON_SIZE[context.effectiveFormControlSize()]}
                height={FORM_CONTROL_ICON_SIZE[context.effectiveFormControlSize()]}
                class="pointer-events-none shrink-0 text-current"
                aria-hidden="true"
              />
            );
          }}
        </Show>
        <span class="min-w-0 flex-1 truncate">{local.children}</span>
      </span>
    </Button>
  );
};

type DropdownIconTriggerProperties = Omit<ComponentProps<typeof IconButton>, "onClick" | "disabled" | "variant"> & {
  onClick?: ComponentProps<typeof IconButton>["onClick"];
};

/**
 * Icon-only trigger for Dropdown.
 */
const DropdownIconTrigger = (properties: DropdownIconTriggerProperties) => {
  const context = useDropdownContext();
  const [local, rest] = splitProps(properties, ["onClick", "class"]);
  return (
    <IconButton
      variant="outline"
      class={local.class}
      disabled={context.disabled()}
      aria-expanded={context.dropdownOpen()}
      aria-haspopup="true"
      onClick={(event) => {
        if (context.disabled()) {
          return;
        }
        event.stopPropagation();
        context.setDropdownOpen(!context.dropdownOpen());
        if (typeof local.onClick === "function") {
          local.onClick(event);
        }
      }}
      {...rest}
    />
  );
};

type DropdownContentProperties = ComponentProps<"div"> & {
  useDocumentPortal?: boolean;
  documentPortalPlacement?: "top" | "bottom";
  wrapChildrenInList?: boolean;
};

/**
 * Dropdown content placeholder. When useDocumentPortal is true the menu mounts on
 * document.body so it is not clipped by ancestor overflow:hidden.
 */
const DropdownContent = (properties: DropdownContentProperties) => {
  const context = useDropdownContext();

  const [local, rest] = splitProps(properties, ["class", "children", "useDocumentPortal", "documentPortalPlacement", "wrapChildrenInList"]);
  const [portalMenuElement, setPortalMenuElement] = createSignal<HTMLDivElement | undefined>();

  const shouldWrapChildrenInList = (): boolean => local.wrapChildrenInList !== false;

  const listClass = (): string => FORM_CONTROL_DROP_DOWN_MENU_LIST_CLASS_BY_SIZE[context.effectiveFormControlSize()];

  const panelClass = (): string => FORM_CONTROL_DROP_DOWN_MENU_PANEL_CLASS_BY_SIZE[context.effectiveFormControlSize()];

  const contentMinimumWidthClass = (): string => FORM_CONTROL_DROP_DOWN_CONTENT_MIN_WIDTH_CLASS_BY_SIZE[context.effectiveFormControlSize()];

  const useDocumentPortalResolved = (): boolean => local.useDocumentPortal === true;

  const documentPortalPlacementResolved = (): "top" | "bottom" => local.documentPortalPlacement ?? "bottom";

  createEffect(
    on(
      (): [HTMLDivElement | undefined, boolean, boolean] => [portalMenuElement(), context.dropdownOpen(), useDocumentPortalResolved()],
      ([element, open, useDocumentPortal]) => {
        if (!open || !useDocumentPortal) {
          context.setContentPortalMenuElement(null);
          return;
        }
        if (!element) {
          return;
        }
        const applyPosition = (): void => {
          const container = context.getDropdownContainerElement();
          if (!container) {
            return;
          }
          const rectangle = container.getBoundingClientRect();
          const gapPixels = 4;
          element.style.position = "fixed";
          element.style.zIndex = "50";
          element.style.left = "auto";
          element.style.bottom = "auto";
          if (documentPortalPlacementResolved() === "top") {
            element.style.top = `${rectangle.top}px`;
            element.style.right = `${window.innerWidth - rectangle.right}px`;
            element.style.transform = `translateY(calc(-100% - ${gapPixels}px))`;
          } else {
            element.style.top = `${rectangle.bottom + gapPixels}px`;
            element.style.right = `${window.innerWidth - rectangle.right}px`;
            element.style.transform = "";
          }
        };
        context.setContentPortalMenuElement(element);
        applyPosition();
        window.addEventListener("scroll", applyPosition, true);
        window.addEventListener("resize", applyPosition);
        onCleanup(() => {
          window.removeEventListener("scroll", applyPosition, true);
          window.removeEventListener("resize", applyPosition);
          context.setContentPortalMenuElement(null);
        });
      }
    )
  );

  return (
    <>
      <Show when={context.dropdownOpen() && !useDocumentPortalResolved()}>
        <div class={mergeClasses("absolute top-full z-10 mt-1", contentMinimumWidthClass(), DROPDOWN_MENU_SURFACE_CLASSES, local.class)} {...rest}>
          <Show when={shouldWrapChildrenInList()} fallback={<div class={panelClass()}>{local.children}</div>}>
            <ul class={listClass()}>{local.children}</ul>
          </Show>
        </div>
      </Show>
      <Show when={context.dropdownOpen() && useDocumentPortalResolved()}>
        <Portal mount={document.body}>
          <div
            ref={(element) => {
              setPortalMenuElement(element === null ? undefined : element);
            }}
            class={mergeClasses(contentMinimumWidthClass(), DROPDOWN_MENU_SURFACE_CLASSES, local.class)}
            {...rest}
          >
            <Show when={shouldWrapChildrenInList()} fallback={<div class={panelClass()}>{local.children}</div>}>
              <ul class={listClass()}>{local.children}</ul>
            </Show>
          </div>
        </Portal>
      </Show>
    </>
  );
};

type DropdownItemProperties = ComponentProps<"a"> & {
  item?: { rawValue: string };
  disabled?: boolean;
  selected?: boolean;
  closeOnSelect?: boolean;
};

/**
 * Single option in the menu. Use inside Dropdown with For.
 */
const DropdownItem = (properties: DropdownItemProperties) => {
  const context = useDropdownContext();

  const [local, rest] = splitProps(properties, ["item", "children", "class", "onClick", "disabled", "selected", "closeOnSelect"]);

  const isSelected = () => {
    if (typeof local.selected === "boolean") {
      return local.selected;
    }
    return Boolean(local.item && context.selectedValue() === local.item.rawValue);
  };

  const itemClass = (): string => FORM_CONTROL_DROP_DOWN_MENU_ITEM_ANCHOR_CLASS_BY_SIZE[context.effectiveFormControlSize()];

  const shouldCloseOnSelect = (): boolean => local.closeOnSelect !== false;

  return (
    <li>
      <a
        href="#"
        class={mergeClasses(itemClass(), local.disabled || context.disabled() ? "pointer-events-none cursor-not-allowed opacity-50" : "", isSelected() ? "bg-blue-600/15 text-blue-800 dark:bg-blue-600/20 dark:text-blue-300" : "", local.class)}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (local.disabled || context.disabled()) {
            return;
          }
          if (local.item) {
            context.setSelectedValue(local.item.rawValue);
            if (context.onChange) {
              context.onChange(local.item.rawValue);
            }
          }
          if (shouldCloseOnSelect()) {
            context.setDropdownOpen(false);
          }
          if (typeof local.onClick === "function") {
            local.onClick(event);
          }
        }}
        {...rest}
      >
        {local.children}
      </a>
    </li>
  );
};

/**
 * Label for the menu. Use inside Dropdown.
 */
const DropdownLabel = (properties: ComponentProps<"label">) => {
  return <label {...properties} />;
};

/**
 * Horizontal separator line inside a dropdown menu.
 */
const DropdownSeparator = (properties: ComponentProps<"div">) => {
  return <div class="my-1 border-t border-gray-200 dark:border-gray-700" {...properties} />;
};

export { Dropdown, DropdownValue, DropdownTrigger, DropdownIconTrigger, DropdownContent, DropdownLabel, DropdownItem, DropdownSeparator };
