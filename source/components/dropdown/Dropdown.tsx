import { Button } from "@/components/button/Button";
import { IconButton } from "@/components/icon-button/IconButton";
import { Icon, RenderIcon } from "@/components/icons";
import { Input } from "@/components/input/Input";
import { Text } from "@/components/typography";
import {
  DROPDOWN_MENU_SURFACE_CLASSES,
  FORM_CONTROL_DROP_DOWN_CONTENT_MIN_WIDTH_CLASS_BY_SIZE,
  FORM_CONTROL_DROP_DOWN_MENU_ITEM_CLASS_BY_SIZE,
  FORM_CONTROL_DROP_DOWN_MENU_LIST_CLASS_BY_SIZE,
  FORM_CONTROL_DROP_DOWN_MENU_PANEL_CLASS_BY_SIZE,
  FORM_CONTROL_DROP_DOWN_MENU_SEARCH_WRAPPER_CLASS_BY_SIZE,
  FORM_CONTROL_ICON_SIZE,
  mergeClasses
} from "@/utilities";
import { VIEWPORT_EDGE_GAP_PIXELS, computeFlippedMenuPosition } from "@/utilities/computeFlippedMenuPosition";
import { getPortalMount } from "@/utilities/getPortalMount";
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
  selectedValues: () => string[];
  setSelectedValues: (values: string[]) => void;
  dropdownOpen: () => boolean;
  setDropdownOpen: (open: boolean) => void;
  filteredOptions: () => string[];
  isSearchable: () => boolean;
  isRemoteSearch: () => boolean;
  isMultiSelect: () => boolean;
  searchQuery: () => string;
  setSearchQuery: (value: string) => void;
  registerSearchInput: (element: HTMLInputElement) => void;
  getDropdownContainerElement: () => HTMLDivElement | undefined;
  setContentPortalMenuElement: (element: HTMLElement | null) => void;
  registerCustomContent: () => void;
};

const DropdownContext = createContext<DropdownContextType>();

export const useDropdownContext = (): DropdownContextType => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("useDropdownContext must be used within Dropdown");
  }
  return context;
};

const makeToggleHandler = (context: DropdownContextType, externalOnClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> | undefined) => {
  return (event: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }) => {
    if (context.disabled()) {
      return;
    }
    event.stopPropagation();
    context.setDropdownOpen(!context.dropdownOpen());
    if (typeof externalOnClick === "function") {
      externalOnClick(event);
    }
  };
};

type DropdownMenuPosition = {
  top: number;
  left: number;
  width: number;
  measured: boolean;
};

type DropdownRootProperties = {
  options: string[];
  value?: string;
  multiSelectValue?: string[];
  onChange?: (value: string | undefined) => void;
  onMultiSelectChange?: (values: string[]) => void;
  disabled?: boolean;
  searchable?: boolean;
  searchMode?: "local" | "remote";
  onSearchChange?: (query: string) => void;
  searchDebounceMs?: number;
  multiSelect?: boolean;
  itemComponent?: (props: { item: { rawValue: string } }) => JSX.Element;
  children: JSX.Element;
  class?: string;
  menuClass?: string;
  menuFullWidth?: boolean;
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
      <Input
        ref={properties.searchInputReference}
        type="text"
        icon="search"
        value={properties.searchQuery()}
        onInput={(event) => {
          properties.setSearchQuery(event.currentTarget.value);
        }}
        placeholder="Search…"
        onClick={(event) => {
          event.stopPropagation();
        }}
      />
    </div>
  );
};

type DropdownBuiltInOptionsListProperties = {
  filteredOptions: () => string[];
  selectedValue: () => string | undefined;
  selectedValues: () => string[];
  isMultiSelect: () => boolean;
  itemComponent: DropdownRootProperties["itemComponent"];
  onSelectOption: (option: string) => void;
};

const DropdownBuiltInOptionsList: Component<DropdownBuiltInOptionsListProperties> = (properties) => {
  return (
    <ul class={FORM_CONTROL_DROP_DOWN_MENU_LIST_CLASS_BY_SIZE}>
      <Show
        when={properties.filteredOptions().length > 0}
        fallback={
          <li class="py-4">
            <Text as="div" size="small" color="muted" align="center" display="block">
              No matches found
            </Text>
          </li>
        }
      >
        <For each={properties.filteredOptions()}>
          {(option: string) => {
            const isSelected = (): boolean => (properties.isMultiSelect() ? properties.selectedValues().includes(option) : properties.selectedValue() === option);
            const selectedClasses = (): string => (isSelected() ? "bg-blue-500/8 hover:bg-blue-500/15 hover:text-gray-900 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:hover:text-white" : "");
            return (
              <li>
                <button
                  type="button"
                  class={mergeClasses(FORM_CONTROL_DROP_DOWN_MENU_ITEM_CLASS_BY_SIZE, selectedClasses(), "cursor-pointer transition-opacity duration-100 ease-out active:opacity-75")}
                  onClick={(event) => {
                    event.stopPropagation();
                    properties.onSelectOption(option);
                  }}
                >
                  <span class="flex min-w-0 flex-1 items-center">{properties.itemComponent ? properties.itemComponent({ item: { rawValue: option } }) : option}</span>
                  <Show when={isSelected()}>
                    <Icon name="check" size={FORM_CONTROL_ICON_SIZE} class="ml-2 shrink-0 text-blue-500 dark:text-blue-400" aria-hidden="true" />
                  </Show>
                </button>
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
  const [local] = splitProps(properties, [
    "options",
    "value",
    "multiSelectValue",
    "onChange",
    "onMultiSelectChange",
    "disabled",
    "searchable",
    "searchMode",
    "onSearchChange",
    "searchDebounceMs",
    "multiSelect",
    "itemComponent",
    "children",
    "class",
    "menuClass",
    "menuFullWidth",
    "initialOpen"
  ]);
  const [selectedValue, setSelectedValue] = createSignal(properties.value);
  const [selectedValues, setSelectedValues] = createSignal<string[]>(properties.multiSelectValue ?? []);
  const [dropdownOpen, setDropdownOpen] = createSignal(local.initialOpen ?? false);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [portalPosition, setPortalPosition] = createSignal<DropdownMenuPosition | null>(null);
  const [hasCustomContent, setHasCustomContent] = createSignal(false);
  let dropdownContainerElement: HTMLDivElement | undefined;
  let contentPortalMenuElement: HTMLElement | null = null;
  let builtInMenuElement: HTMLDivElement | undefined;
  let searchInputElement: HTMLInputElement | undefined;

  const disabledState = (): boolean | undefined => properties.disabled;
  const isSearchable = () => properties.searchable === true;
  const isRemoteSearch = () => properties.searchMode === "remote";
  const isMultiSelect = () => properties.multiSelect === true;
  const filteredOptions = createMemo(() => {
    if (!isSearchable() || isRemoteSearch()) {
      return properties.options;
    }
    const query = searchQuery().trim().toLowerCase();
    if (query === "") {
      return properties.options;
    }
    return properties.options.filter((option) => option.toLowerCase().includes(query));
  });

  let searchDebounceTimer: number | undefined;
  createEffect(
    on(
      searchQuery,
      (query) => {
        if (!isSearchable() || !properties.onSearchChange) {
          return;
        }
        if (searchDebounceTimer !== undefined) {
          window.clearTimeout(searchDebounceTimer);
        }
        const delay = properties.searchDebounceMs ?? 300;
        if (delay <= 0) {
          properties.onSearchChange(query);
          return;
        }
        searchDebounceTimer = window.setTimeout(() => {
          searchDebounceTimer = undefined;
          properties.onSearchChange?.(query);
        }, delay);
      },
      { defer: true }
    )
  );
  onCleanup(() => {
    if (searchDebounceTimer !== undefined) {
      window.clearTimeout(searchDebounceTimer);
    }
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
    on(
      () => properties.multiSelectValue,
      (values) => {
        setSelectedValues(values ?? []);
      },
      { defer: true }
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
    on(dropdownOpen, (open) => {
      if (open && isSearchable()) {
        // Double rAF ensures the Portal re-mounts its DOM before we focus,
        // since Show tears down and recreates the search input each open cycle.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            searchInputElement?.focus();
          });
        });
      }
    })
  );

  createEffect(
    on(dropdownOpen, (open) => {
      if (!open) {
        setPortalPosition(null);
        builtInMenuElement = undefined;
        return;
      }
      const updatePosition = () => {
        if (!dropdownContainerElement) {
          return;
        }
        const triggerRectangle = dropdownContainerElement.getBoundingClientRect();
        if (!builtInMenuElement) {
          setPortalPosition({
            top: triggerRectangle.bottom + VIEWPORT_EDGE_GAP_PIXELS,
            left: triggerRectangle.left,
            width: triggerRectangle.width,
            measured: false
          });
          return;
        }
        const { top, left } = computeFlippedMenuPosition(triggerRectangle, builtInMenuElement);
        setPortalPosition({ top, left, width: triggerRectangle.width, measured: true });
      };
      requestAnimationFrame(() => {
        updatePosition();
        requestAnimationFrame(updatePosition);
      });
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
    if (isMultiSelect()) {
      const current = selectedValues();
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      setSelectedValues(next);
      if (properties.onMultiSelectChange) {
        properties.onMultiSelectChange(next);
      }
    } else {
      setSelectedValue(value);
      if (properties.onChange) {
        properties.onChange(value);
      }
      setDropdownOpen(false);
    }
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
    selectedValues,
    setSelectedValues,
    dropdownOpen,
    setDropdownOpen,
    filteredOptions,
    isSearchable,
    isRemoteSearch,
    isMultiSelect,
    searchQuery,
    setSearchQuery,
    registerSearchInput: (element: HTMLInputElement) => {
      searchInputElement = element;
    },
    getDropdownContainerElement: () => dropdownContainerElement,
    setContentPortalMenuElement: (element: HTMLElement | null) => {
      contentPortalMenuElement = element;
    },
    registerCustomContent: () => {
      setHasCustomContent(true);
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
        <Show when={!hasCustomContent() && dropdownOpen() && !disabledState() && properties.options.length > 0 && portalPosition()}>
          {(position) => (
            <Portal mount={getPortalMount(dropdownContainerElement)}>
              <div
                ref={(el) => {
                  contentPortalMenuElement = el;
                  builtInMenuElement = el;
                }}
                class={mergeClasses("z-9999 min-w-min", builtInMenuChromeClass())}
                style={{
                  position: "fixed",
                  top: `${position().top}px`,
                  left: `${position().left}px`,
                  width: `${position().width}px`,
                  visibility: position().measured ? "visible" : "hidden"
                }}
              >
                <Show when={isSearchable()}>
                  <DropdownBuiltInSearchField searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchInputReference={assignSearchInputReference} />
                </Show>
                <DropdownBuiltInOptionsList filteredOptions={filteredOptions} selectedValue={selectedValue} selectedValues={selectedValues} isMultiSelect={isMultiSelect} itemComponent={properties.itemComponent} onSelectOption={handleSelect} />
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
  const [local, rest] = splitProps(properties, ["class", "children"]);
  return (
    <Text as="div" size="small" color="inherit" align="start" display="block" truncate class={mergeClasses("min-w-0 flex-1", local.class)} {...rest}>
      {local.children}
    </Text>
  );
};

type DropdownTriggerWithLabel = Omit<ComponentProps<typeof Button>, "variant" | "iconPosition" | "class"> & {
  children: JSX.Element;
  icon?: string | JSX.Element;
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
        icon={local.icon ?? "keyboard_arrow_down"}
        onClick={makeToggleHandler(context, local.onClick)}
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
      icon="keyboard_arrow_down"
      iconPosition="end"
      class="w-full min-w-0 justify-between text-left font-normal aria-expanded:bg-gray-100 dark:aria-expanded:bg-gray-700"
      onClick={makeToggleHandler(context, local.onClick)}
      disabled={context.disabled()}
      aria-expanded={context.dropdownOpen()}
      aria-haspopup="true"
      {...rest}
    >
      <span class="flex min-w-0 flex-1 items-center gap-2">
        <Show when={local.icon != null}>
          <RenderIcon icon={local.icon!} size={FORM_CONTROL_ICON_SIZE} />
        </Show>
        <Text as="span" size="small" color="default" display="inline" truncate class="min-w-0 flex-1">
          {local.children}
        </Text>
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
  return <IconButton variant={local.variant ?? "outline"} disabled={context.disabled()} aria-expanded={context.dropdownOpen()} aria-haspopup="true" onClick={makeToggleHandler(context, local.onClick)} {...rest} />;
};

type DropdownContentProperties = Omit<ComponentProps<"div">, "class"> & {
  class?: string;
  wrapChildrenInList?: boolean;
};

/**
 * Dropdown content. Always mounts to document.body via Portal so SolidJS manages
 * the element lifecycle, but on open it is manually moved into the nearest open
 * <dialog> ancestor (via getPortalMount) so it enters the top layer and renders
 * above the modal backdrop. getPortalMount must run at open-time, not render-time.
 */
const DropdownContent = (properties: DropdownContentProperties) => {
  const context = useDropdownContext();
  context.registerCustomContent();

  const [local, rest] = splitProps(properties, ["class", "children", "wrapChildrenInList"]);
  let menuEl: HTMLDivElement | undefined;

  const applyPosition = (): void => {
    const container = context.getDropdownContainerElement();
    if (!container || !menuEl) return;

    const triggerRectangle = container.getBoundingClientRect();
    menuEl.style.minWidth = `${triggerRectangle.width}px`;
    const { top, left } = computeFlippedMenuPosition(triggerRectangle, menuEl);
    menuEl.style.top = `${top}px`;
    menuEl.style.left = `${left}px`;
  };

  createEffect(
    on(context.dropdownOpen, (open) => {
      if (!menuEl) return;
      if (open) {
        const mount = getPortalMount(context.getDropdownContainerElement());
        mount.appendChild(menuEl);
        menuEl.style.visibility = "hidden";
        menuEl.style.display = "";
        applyPosition();
        menuEl.style.visibility = "";
        context.setContentPortalMenuElement(menuEl);
        window.addEventListener("scroll", applyPosition, true);
        window.addEventListener("resize", applyPosition);
      } else {
        menuEl.style.display = "none";
        menuEl.remove();
        context.setContentPortalMenuElement(null);
        window.removeEventListener("scroll", applyPosition, true);
        window.removeEventListener("resize", applyPosition);
      }
    })
  );

  onCleanup(() => {
    menuEl?.remove();
    window.removeEventListener("scroll", applyPosition, true);
    window.removeEventListener("resize", applyPosition);
  });

  return (
    <Portal mount={document.body}>
      <div
        ref={(el) => {
          menuEl = el;
        }}
        style={{ display: "none", position: "fixed", "z-index": "9999" }}
        class={mergeClasses(FORM_CONTROL_DROP_DOWN_CONTENT_MIN_WIDTH_CLASS_BY_SIZE, DROPDOWN_MENU_SURFACE_CLASSES, local.class)}
        {...rest}
      >
        <Show when={context.isSearchable()}>
          <DropdownBuiltInSearchField searchQuery={context.searchQuery} setSearchQuery={context.setSearchQuery} searchInputReference={context.registerSearchInput} />
        </Show>
        <Show when={local.wrapChildrenInList !== false} fallback={<div class={FORM_CONTROL_DROP_DOWN_MENU_PANEL_CLASS_BY_SIZE}>{local.children}</div>}>
          <ul class={FORM_CONTROL_DROP_DOWN_MENU_LIST_CLASS_BY_SIZE}>{local.children}</ul>
        </Show>
      </div>
    </Portal>
  );
};

type DropdownItemProperties = Omit<ComponentProps<"button">, "class" | "type"> & {
  class?: string;
  item?: { rawValue: string };
  disabled?: boolean;
  selected?: boolean;
  closeOnSelect?: boolean;
  clickable?: boolean;
  icon?: string | JSX.Element;
};

/**
 * Single option in the menu. Use inside Dropdown with For.
 */
const DropdownItem = (properties: DropdownItemProperties) => {
  const context = useDropdownContext();

  const [local, rest] = splitProps(properties, ["class", "item", "children", "onClick", "disabled", "selected", "closeOnSelect", "clickable", "icon"]);

  const isSelected = () => {
    if (typeof local.selected === "boolean") {
      return local.selected;
    }
    if (context.isMultiSelect() && local.item) {
      return context.selectedValues().includes(local.item.rawValue);
    }
    return Boolean(local.item && context.selectedValue() === local.item.rawValue);
  };

  const isHiddenBySearch = (): boolean => {
    if (!context.isSearchable() || context.isRemoteSearch()) {
      return false;
    }
    const query = context.searchQuery().trim().toLowerCase();
    if (query === "" || !local.item) {
      return false;
    }
    return !local.item.rawValue.toLowerCase().includes(query);
  };

  const shouldCloseOnSelect = (): boolean => local.closeOnSelect !== false;
  const isClickable = (): boolean => local.clickable !== false;

  return (
    <Show when={!isHiddenBySearch()}>
      <li>
        <button
          type="button"
          class={mergeClasses(
            "inline-flex w-full items-start rounded-lg px-2.5 py-1.5 text-left transition-colors duration-100 ease-out hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:hover:bg-gray-700/60 dark:hover:text-white",
            local.disabled || context.disabled() ? "pointer-events-none cursor-not-allowed opacity-50" : !isClickable() ? "pointer-events-none cursor-default" : "cursor-pointer transition-opacity duration-100 ease-out active:opacity-75",
            isSelected() && isClickable() ? "bg-blue-500/8 hover:bg-blue-500/15 hover:text-gray-900 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:hover:text-white" : ""
          )}
          onClick={(event) => {
            event.stopPropagation();
            if (local.disabled || context.disabled() || !isClickable()) {
              return;
            }
            if (local.item) {
              if (context.isMultiSelect()) {
                const current = context.selectedValues();
                const next = current.includes(local.item.rawValue) ? current.filter((v) => v !== local.item!.rawValue) : [...current, local.item.rawValue];
                context.setSelectedValues(next);
                context.onChange(undefined);
              } else {
                context.setSelectedValue(local.item.rawValue);
                context.onChange(local.item.rawValue);
              }
            }
            if (shouldCloseOnSelect() && !context.isMultiSelect()) {
              context.setDropdownOpen(false);
            }
            if (typeof local.onClick === "function") {
              local.onClick(event);
            }
          }}
          {...rest}
        >
          <span class="flex min-w-0 flex-1 items-center gap-2">
            <Show when={local.icon != null}>
              <RenderIcon icon={local.icon!} size={FORM_CONTROL_ICON_SIZE} />
            </Show>
            <Text as="span" size="small" color="inherit" display="inline" truncate class={mergeClasses("min-w-0 flex-1", local.class)}>
              {local.children}
            </Text>
          </span>
          <Show when={isSelected() && isClickable()}>
            <Icon name="check" size={FORM_CONTROL_ICON_SIZE} class="ml-2 shrink-0 text-blue-500 dark:text-blue-400" aria-hidden="true" />
          </Show>
        </button>
      </li>
    </Show>
  );
};

/**
 * Horizontal separator line inside a dropdown menu.
 */
const DropdownSeparator = (properties: ComponentProps<"div">) => {
  return <div class="my-1 border-t border-gray-200 dark:border-gray-700" {...properties} />;
};

export { Dropdown, DropdownValue, DropdownTrigger, DropdownIconTrigger, DropdownContent, DropdownItem, DropdownSeparator };
