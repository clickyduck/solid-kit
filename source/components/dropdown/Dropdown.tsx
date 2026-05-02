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
  mergeClasses
} from "@/utilities";
import type { Component, ComponentProps, JSX } from "solid-js";
import { For, ParentComponent, Show, createContext, createEffect, createMemo, createSignal, on, onCleanup, onMount, splitProps, useContext } from "solid-js";
import { Portal } from "solid-js/web";

type DropdownContextType = {
  options: string[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled: () => boolean | undefined;
  selectedValue: () => string | undefined;
  setSelectedValue: (value: string | undefined) => void;
  dropdownOpen: () => boolean;
  setDropdownOpen: (open: boolean) => void;
  filteredOptions: () => string[];
  isSearchable: () => boolean;
  searchQuery: () => string;
  setSearchQuery: (value: string) => void;
  registerSearchInput: (element: HTMLInputElement) => void;
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
  class?: string;
  menuClass?: string;
  menuFullWidth?: boolean;
  usePortal?: boolean;
  initialOpen?: boolean;
};

type DropdownBuiltInSearchFieldProperties = {
  searchQuery: () => string;
  setSearchQuery: (value: string) => void;
  searchInputReference: (element: HTMLInputElement) => void;
};

const DropdownBuiltInSearchField: Component<DropdownBuiltInSearchFieldProperties> = (properties) => {
  return (
    <div class={FORM_CONTROL_DROP_DOWN_MENU_SEARCH_WRAPPER_CLASS_BY_SIZE}>
      <div class="relative">
        <div class={mergeClasses("pointer-events-none absolute inset-y-0 left-0 flex items-center", FORM_CONTROL_LEADING_ICON_WRAPPER_CLASS)}>
          <Icon icon={search} width={FORM_CONTROL_ICON_SIZE} height={FORM_CONTROL_ICON_SIZE} class={mergeClasses("pointer-events-none shrink-0", CHROME_MUTED_ICON_CLASSES)} aria-hidden="true" />
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
            FORM_CONTROL_SIZE_CLASSES,
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
};

const DropdownBuiltInOptionsList: Component<DropdownBuiltInOptionsListProperties> = (properties) => {
  return (
    <ul class={FORM_CONTROL_DROP_DOWN_MENU_LIST_CLASS_BY_SIZE}>
      <Show when={properties.filteredOptions().length > 0} fallback={<li class="py-4 text-center text-gray-500 dark:text-gray-400">No matches found</li>}>
        <For each={properties.filteredOptions()}>
          {(option: string) => {
            const selectedClasses = (): string => (properties.selectedValue() === option ? "bg-blue-600/15 text-blue-800 dark:bg-blue-600/20 dark:text-blue-300" : "");
            const itemClass = (): string => FORM_CONTROL_DROP_DOWN_MENU_ITEM_ANCHOR_CLASS_BY_SIZE;
            return (
              <li>
                <a
                  href="#"
                  class={mergeClasses(itemClass(), selectedClasses())}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    properties.onSelectOption(option);
                  }}
                >
                  {properties.itemComponent ? properties.itemComponent({ item: { rawValue: option } }) : option}
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
  const [local] = splitProps(properties, ["options", "value", "onChange", "disabled", "searchable", "itemComponent", "children", "class", "menuClass", "menuFullWidth", "usePortal", "initialOpen"]);
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
    onChange: (value: string | undefined) => {
      properties.onChange?.(value);
    },
    disabled: disabledState,
    selectedValue,
    setSelectedValue,
    dropdownOpen,
    setDropdownOpen,
    filteredOptions,
    isSearchable,
    searchQuery,
    setSearchQuery,
    registerSearchInput: (element: HTMLInputElement) => {
      searchInputElement = element;
    },
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
          <div class={mergeClasses("absolute top-full z-60 mt-1", local.menuFullWidth !== false ? "left-0 w-full" : "", builtInMenuChromeClass())}>
            <Show when={isSearchable()}>
              <DropdownBuiltInSearchField searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchInputReference={assignSearchInputReference} />
            </Show>
            <DropdownBuiltInOptionsList filteredOptions={filteredOptions} selectedValue={selectedValue} itemComponent={properties.itemComponent} onSelectOption={handleSelect} />
          </div>
        </Show>
        <Show when={dropdownOpen() && !disabledState() && properties.options.length > 0 && properties.usePortal && portalPosition()}>
          {(position) => (
            <Portal mount={document.body}>
              <div class={mergeClasses("z-60 min-w-min", builtInMenuChromeClass())} style={{ position: "fixed", top: `${position().top}px`, left: `${position().left}px`, width: `${position().width}px` }}>
                <Show when={isSearchable()}>
                  <DropdownBuiltInSearchField searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchInputReference={assignSearchInputReference} />
                </Show>
                <DropdownBuiltInOptionsList filteredOptions={filteredOptions} selectedValue={selectedValue} itemComponent={properties.itemComponent} onSelectOption={handleSelect} />
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
  const [local, rest] = splitProps(properties, ["class"]);
  return <div class={mergeClasses("min-w-0 flex-1 truncate text-left", FORM_CONTROL_TEXT_CLASS_BY_SIZE, local.class)} {...rest} />;
};

type DropdownTriggerWithLabel = Omit<ComponentProps<typeof Button>, "variant" | "iconPosition" | "class"> & {
  children: JSX.Element;
  icon?: IconComponent;
  variant?: "ghost";
};

type DropdownTriggerIconOnly = Omit<ComponentProps<typeof IconButton>, "variant" | "children" | "class"> & {
  children?: undefined;
  variant?: "ghost";
};

type DropdownTriggerProperties = DropdownTriggerWithLabel | DropdownTriggerIconOnly;

/**
 * Button that toggles the menu. Use inside Dropdown.
 * Styling is fixed to the outline trigger (text or icon-only).
 */
const DropdownTrigger = (properties: DropdownTriggerProperties) => {
  const context = useDropdownContext();
  const [local, rest] = splitProps(properties, ["children", "onClick", "id", "icon", "variant"]);

  if (!local.children) {
    return (
      <IconButton
        id={local.id}
        variant={local.variant ?? "outline"}
        icon={local.icon ?? chevronDown}
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
      variant={local.variant ?? "outline"}
      icon={chevronDown}
      iconPosition="end"
      class="w-full min-w-0 justify-between text-left font-medium aria-expanded:bg-gray-100 dark:aria-expanded:bg-gray-700"
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
        <Show when={local.icon}>
          {(iconComponentAccessor) => {
            return <Icon icon={iconComponentAccessor()} width={FORM_CONTROL_ICON_SIZE} height={FORM_CONTROL_ICON_SIZE} class="pointer-events-none shrink-0 text-current" aria-hidden="true" />;
          }}
        </Show>
        <span class="min-w-0 flex-1 truncate">{local.children}</span>
      </span>
    </Button>
  );
};

type DropdownIconTriggerProperties = Omit<ComponentProps<typeof IconButton>, "onClick" | "disabled" | "variant" | "class"> & {
  onClick?: ComponentProps<typeof IconButton>["onClick"];
  variant?: "ghost";
};

/**
 * Icon-only trigger for Dropdown.
 */
const DropdownIconTrigger = (properties: DropdownIconTriggerProperties) => {
  const context = useDropdownContext();
  const [local, rest] = splitProps(properties, ["onClick", "variant"]);
  return (
    <IconButton
      variant={local.variant ?? "outline"}
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

type DropdownContentProperties = Omit<ComponentProps<"div">, "class"> & {
  class?: string;
  useDocumentPortal?: boolean;
  documentPortalPlacement?: "top" | "bottom";
  xDirection?: "left" | "right";
  yDirection?: "up" | "down";
  wrapChildrenInList?: boolean;
};

/**
 * Dropdown content placeholder. When useDocumentPortal is true the menu mounts on
 * document.body so it is not clipped by ancestor overflow:hidden.
 */
const DropdownContent = (properties: DropdownContentProperties) => {
  const context = useDropdownContext();

  const [local, rest] = splitProps(properties, ["class", "children", "useDocumentPortal", "documentPortalPlacement", "xDirection", "yDirection", "wrapChildrenInList"]);
  const [portalMenuElement, setPortalMenuElement] = createSignal<HTMLDivElement | undefined>();

  const shouldWrapChildrenInList = (): boolean => local.wrapChildrenInList !== false;

  const listClass = (): string => FORM_CONTROL_DROP_DOWN_MENU_LIST_CLASS_BY_SIZE;

  const panelClass = (): string => FORM_CONTROL_DROP_DOWN_MENU_PANEL_CLASS_BY_SIZE;

  const contentMinimumWidthClass = (): string => FORM_CONTROL_DROP_DOWN_CONTENT_MIN_WIDTH_CLASS_BY_SIZE;

  const useDocumentPortalResolved = (): boolean => local.useDocumentPortal === true;

  const xDirectionResolved = (): "left" | "right" => local.xDirection ?? "right";

  const yDirectionResolved = (): "up" | "down" => local.yDirection ?? "down";

  const nonPortalPositioningClass = (): string => {
    const yClass = yDirectionResolved() === "up" ? "bottom-full mb-1" : "top-full mt-1";
    const xClass = xDirectionResolved() === "left" ? "right-0" : "left-0";
    return mergeClasses("absolute z-60", yClass, xClass);
  };

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
          element.style.zIndex = "60";
          element.style.left = "auto";
          element.style.right = "auto";
          element.style.top = "auto";
          element.style.bottom = "auto";

          // Horizontal direction
          if (xDirectionResolved() === "left") {
            // Anchor to trigger's right edge, so the menu grows leftwards.
            element.style.right = `${window.innerWidth - rectangle.right}px`;
          } else {
            // Anchor to trigger's left edge, so the menu grows rightwards.
            element.style.left = `${rectangle.left}px`;
          }

          // Vertical direction
          if (yDirectionResolved() === "up") {
            element.style.top = `${rectangle.top}px`;
            element.style.transform = `translateY(calc(-100% - ${gapPixels}px))`;
          } else {
            element.style.top = `${rectangle.bottom + gapPixels}px`;
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

  const searchField = () => (
    <Show when={context.isSearchable()}>
      <DropdownBuiltInSearchField searchQuery={context.searchQuery} setSearchQuery={context.setSearchQuery} searchInputReference={context.registerSearchInput} />
    </Show>
  );

  return (
    <>
      <Show when={context.dropdownOpen() && !useDocumentPortalResolved()}>
        <div class={mergeClasses(nonPortalPositioningClass(), contentMinimumWidthClass(), DROPDOWN_MENU_SURFACE_CLASSES, local.class)} {...rest}>
          {searchField()}
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
            {searchField()}
            <Show when={shouldWrapChildrenInList()} fallback={<div class={panelClass()}>{local.children}</div>}>
              <ul class={listClass()}>{local.children}</ul>
            </Show>
          </div>
        </Portal>
      </Show>
    </>
  );
};

type DropdownItemProperties = Omit<ComponentProps<"a">, "class"> & {
  class?: string;
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

  const [local, rest] = splitProps(properties, ["class", "item", "children", "onClick", "disabled", "selected", "closeOnSelect"]);

  const isSelected = () => {
    if (typeof local.selected === "boolean") {
      return local.selected;
    }
    return Boolean(local.item && context.selectedValue() === local.item.rawValue);
  };

  const isHiddenBySearch = (): boolean => {
    if (!context.isSearchable()) {
      return false;
    }
    const query = context.searchQuery().trim().toLowerCase();
    if (query === "" || !local.item) {
      return false;
    }
    return !local.item.rawValue.toLowerCase().includes(query);
  };

  const itemClass = (): string => FORM_CONTROL_DROP_DOWN_MENU_ITEM_ANCHOR_CLASS_BY_SIZE;

  const shouldCloseOnSelect = (): boolean => local.closeOnSelect !== false;

  return (
    <Show when={!isHiddenBySearch()}>
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
              context.onChange(local.item.rawValue);
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
    </Show>
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
