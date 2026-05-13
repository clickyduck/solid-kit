import { Dropdown, DropdownTrigger, DropdownValue } from "@/components/dropdown/Dropdown";
import { IconButton } from "@/components/icon-button/IconButton";
import { TABLE_BODY_TEXT_CLASSES, TABLE_DATA_CELL_CLASSES, TABLE_HEADER_LABEL_CLASSES, TABLE_HEAD_CELL_CLASSES, TABLE_PAGINATION_BAR_CLASSES, mergeClasses } from "@/utilities";
import { type ComponentProps, type JSX, Show, createContext, createSignal, splitProps, useContext } from "solid-js";

const TABLE_MIN_WIDTH = "min-w-[640px]";

type TableContextValue = {
  setPaginationSlot: (element: JSX.Element) => void;
};

const TableContext = createContext<TableContextValue>();

/**
 * Table wrapper with card chrome (border, radius, background) and horizontal scroll.
 * Place TablePagination as a direct child alongside TableHeader/TableBody — it will
 * automatically render attached below the scroll area, inside the card.
 */
export const Table = (properties: ComponentProps<"table">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  const [paginationSlot, setPaginationSlot] = createSignal<JSX.Element>(null);

  return (
    <TableContext.Provider value={{ setPaginationSlot }}>
      <div class="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-100">
        <div class="overflow-x-auto">
          <table class={mergeClasses("w-full table-auto text-left", TABLE_BODY_TEXT_CLASSES, TABLE_MIN_WIDTH, local.class)} {...rest} />
        </div>
        <Show when={paginationSlot() !== null}>{paginationSlot()}</Show>
      </div>
    </TableContext.Provider>
  );
};

/**
 * Table header row group.
 */
export const TableHeader = (properties: ComponentProps<"thead">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <thead class={mergeClasses("border-b border-gray-200 bg-gray-50 font-medium tracking-wide text-gray-500 uppercase dark:border-gray-700/60 dark:bg-gray-700/20 dark:text-gray-400", TABLE_HEADER_LABEL_CLASSES, local.class)} {...rest} />;
};

/**
 * Table body row group.
 */
export const TableBody = (properties: ComponentProps<"tbody">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <tbody class={mergeClasses("divide-y divide-gray-100 dark:divide-gray-700/40", local.class)} {...rest} />;
};

/**
 * Table footer row group.
 */
export const TableFooter = (properties: ComponentProps<"tfoot">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <tfoot class={mergeClasses("border-t border-gray-200 bg-gray-50 font-medium tracking-wide text-gray-500 dark:border-gray-700/60 dark:bg-gray-700/20 dark:text-gray-400", TABLE_HEADER_LABEL_CLASSES, local.class)} {...rest} />;
};

type TableRowProperties = ComponentProps<"tr"> & {
  clickable?: boolean;
  active?: boolean;
  verticalAlign?: "top" | "middle";
};

/**
 * Table row. Adds pointer cursor, hover highlight, and keyboard activation when clickable=true.
 */
export const TableRow = (properties: TableRowProperties) => {
  const [local, rest] = splitProps(properties, ["clickable", "active", "verticalAlign", "class"]);
  const clickable = (): boolean => {
    return local.clickable === true;
  };

  const isActive = (): boolean => {
    return local.active === true;
  };

  const resolvedVerticalAlign = (): "top" | "middle" => {
    return local.verticalAlign ?? "middle";
  };

  const mergedOnKeyDown: JSX.EventHandler<HTMLTableRowElement, KeyboardEvent> = (event) => {
    const upstream = rest.onKeyDown;
    if (typeof upstream === "function") {
      upstream(event);
    }
    if (event.defaultPrevented) {
      return;
    }
    if (!clickable()) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    const rowClick = rest.onClick;
    if (typeof rowClick !== "function") {
      return;
    }
    event.preventDefault();
    const tableRowElement = event.currentTarget;
    rowClick({
      ...event,
      currentTarget: tableRowElement,
      target: tableRowElement
    } as unknown as MouseEvent & { currentTarget: HTMLTableRowElement; target: Element });
  };

  return (
    <tr
      tabIndex={clickable() && typeof rest.onClick === "function" ? 0 : undefined}
      class={mergeClasses(
        "bg-transparent transition-colors duration-100",
        resolvedVerticalAlign() === "top" ? "align-top" : "align-middle",
        clickable() ? "cursor-pointer hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:hover:bg-gray-700/25" : "",
        isActive() ? "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20" : "",
        local.class
      )}
      {...rest}
      onKeyDown={mergedOnKeyDown}
    />
  );
};

/**
 * Table header cell.
 */
export const TableHead = (properties: ComponentProps<"th"> & { align?: "left" | "right" | "center"; monospace?: boolean }) => {
  const [local, rest] = splitProps(properties, ["align", "monospace", "class"]);
  const resolvedAlign = (): "left" | "right" | "center" => {
    return local.align ?? "left";
  };
  const alignClass = (): string => {
    if (resolvedAlign() === "right") {
      return "text-right";
    }
    if (resolvedAlign() === "center") {
      return "text-center";
    }
    return "text-left";
  };
  return <th scope="col" class={mergeClasses("min-w-0 overflow-hidden font-semibold", alignClass(), local.monospace === true ? "font-mono" : "", TABLE_HEAD_CELL_CLASSES, local.class)} {...rest} />;
};

/**
 * Table footer cell — same height as header cells.
 */
export const TableFooterCell = (properties: ComponentProps<"td"> & { align?: "left" | "right" | "center"; monospace?: boolean }) => {
  const [local, rest] = splitProps(properties, ["align", "monospace", "class"]);
  const resolvedAlign = (): "left" | "right" | "center" => local.align ?? "left";
  const alignClass = (): string => {
    if (resolvedAlign() === "right") return "text-right";
    if (resolvedAlign() === "center") return "text-center";
    return "text-left";
  };
  return <td class={mergeClasses("min-w-0 overflow-hidden", alignClass(), local.monospace === true ? "font-mono" : "", TABLE_HEAD_CELL_CLASSES, local.class)} {...rest} />;
};

/**
 * Table data cell.
 */
export const TableCell = (properties: ComponentProps<"td"> & { align?: "left" | "right" | "center"; monospace?: boolean }) => {
  const [local, rest] = splitProps(properties, ["align", "monospace", "class"]);
  const resolvedAlign = (): "left" | "right" | "center" => {
    return local.align ?? "left";
  };
  const alignClass = (): string => {
    if (resolvedAlign() === "right") {
      return "text-right";
    }
    if (resolvedAlign() === "center") {
      return "text-center";
    }
    return "text-left";
  };
  return <td class={mergeClasses("min-w-0 overflow-hidden", alignClass(), local.monospace === true ? "font-mono" : "", TABLE_DATA_CELL_CLASSES, local.class)} {...rest} />;
};

type TablePaginationProperties = {
  limit: number;
  offset: number;
  currentPageCount: number;
  totalCount?: number;
  onChange: (next: { limit: number; offset: number }) => void;
  limitOptions?: number[];
  class?: string;
};

const coerceLimitOption = (value: number): number => {
  if (!Number.isFinite(value) || value <= 0) {
    return 50;
  }
  return Math.max(1, Math.floor(value));
};

/**
 * Pagination controls. Place as a direct child of Table — it renders attached below
 * the scroll area inside the card via context, not in the DOM position it appears.
 */
export const TablePagination = (properties: TablePaginationProperties) => {
  const context = useContext(TableContext);

  const resolvedLimitOptions = (): number[] => {
    const configured = properties.limitOptions ?? [25, 50, 100, 200];
    const uniqueOptions = Array.from(new Set(configured.map(coerceLimitOption))).sort((first, second) => {
      return first - second;
    });
    return uniqueOptions.length > 0 ? uniqueOptions : [50];
  };

  const resolvedLimit = (): number => {
    return coerceLimitOption(properties.limit);
  };

  const resolvedOffset = (): number => {
    if (!Number.isFinite(properties.offset) || properties.offset < 0) {
      return 0;
    }
    return Math.floor(properties.offset);
  };

  const isPreviousDisabled = (): boolean => {
    return resolvedOffset() <= 0;
  };

  const isNextDisabled = (): boolean => {
    const totalCount = properties.totalCount;
    if (typeof totalCount === "number" && Number.isFinite(totalCount) && totalCount >= 0) {
      return resolvedOffset() + properties.currentPageCount >= totalCount;
    }
    return properties.currentPageCount < resolvedLimit();
  };

  const selectedLimitValue = (): string => {
    return String(resolvedLimit());
  };

  const limitOptionValues = (): string[] => {
    return resolvedLimitOptions().map((option) => {
      return String(option);
    });
  };

  const currentPage = (): number => {
    return Math.floor(resolvedOffset() / resolvedLimit()) + 1;
  };

  const paginationElement = (
    <div
      class={mergeClasses(
        "flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700/60 dark:bg-gray-700/20 dark:text-gray-400",
        TABLE_PAGINATION_BAR_CLASSES,
        TABLE_BODY_TEXT_CLASSES,
        properties.class
      )}
    >
      <div class="flex items-center gap-2">
        <span class="font-medium text-gray-500 dark:text-gray-400">Rows per page</span>
        <Dropdown
          options={limitOptionValues()}
          value={selectedLimitValue()}
          onChange={(value) => {
            if (typeof value !== "string") {
              return;
            }
            const nextLimit = coerceLimitOption(Number(value));
            properties.onChange({ limit: nextLimit, offset: 0 });
          }}
          menuFullWidth={false}
        >
          <DropdownTrigger>
            <DropdownValue>{selectedLimitValue()}</DropdownValue>
          </DropdownTrigger>
        </Dropdown>
      </div>

      <div class="flex items-center gap-2 md:gap-3">
        <Show when={properties.currentPageCount > 0}>
          <span class={mergeClasses("px-1 font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400", TABLE_BODY_TEXT_CLASSES)}>Page {currentPage()}</span>
        </Show>
        <div class="flex items-center gap-1.5">
          <IconButton
            icon="arrow_back"
            variant="outline"
            class="border-gray-300 bg-white shadow-none dark:border-gray-600/60 dark:bg-gray-700/30"
            disabled={isPreviousDisabled()}
            aria-label="Previous page"
            onClick={() => {
              const nextOffset = Math.max(0, resolvedOffset() - resolvedLimit());
              properties.onChange({ limit: resolvedLimit(), offset: nextOffset });
            }}
          />
          <IconButton
            icon="arrow_forward"
            variant="outline"
            class="border-gray-300 bg-white shadow-none dark:border-gray-600/60 dark:bg-gray-700/30"
            disabled={isNextDisabled()}
            aria-label="Next page"
            onClick={() => {
              properties.onChange({ limit: resolvedLimit(), offset: resolvedOffset() + resolvedLimit() });
            }}
          />
        </div>
      </div>
    </div>
  );

  if (context !== undefined) {
    context.setPaginationSlot(paginationElement);
    return null;
  }

  return paginationElement;
};
