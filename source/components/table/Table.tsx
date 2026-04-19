import { Dropdown, DropdownTrigger, DropdownValue } from "@/components/dropdown/Dropdown";
import { IconButton } from "@/components/icon-button/IconButton";
import { arrowLeft, chevronRight } from "@/components/icons";
import { TABLE_BODY_TEXT_CLASS, TABLE_DATA_CELL_PADDING_CLASS, TABLE_HEADER_LABEL_TEXT_CLASS, TABLE_HEAD_CELL_PADDING_CLASS, TABLE_PAGINATION_BAR_PADDING_CLASS } from "@/utilities/controlLayoutClasses";
import { mergeClasses } from "@/utilities/mergeClasses";
import { type ComponentProps, type JSX, Show, splitProps } from "solid-js";

const TABLE_MIN_WIDTH = "min-w-[640px]";

/**
 * Table wrapper with horizontal scroll for narrow viewports. Minimum width 640px.
 */
export const Table = (properties: ComponentProps<"table">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return (
    <div class="relative w-full overflow-x-auto">
      <table class={mergeClasses("w-full table-auto text-left text-gray-400", TABLE_BODY_TEXT_CLASS, TABLE_MIN_WIDTH, local.class)} {...rest} />
    </div>
  );
};

/**
 * Table header row group.
 */
export const TableHeader = (properties: ComponentProps<"thead">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <thead class={mergeClasses("border-b border-gray-700 bg-gray-900/60 font-medium tracking-wide text-gray-500 uppercase", TABLE_HEADER_LABEL_TEXT_CLASS, local.class)} {...rest} />;
};

/**
 * Table body row group.
 */
export const TableBody = (properties: ComponentProps<"tbody">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <tbody class={mergeClasses("divide-y divide-gray-800/70", local.class)} {...rest} />;
};

/**
 * Table footer row group.
 */
export const TableFooter = (properties: ComponentProps<"tfoot">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <tfoot class={mergeClasses("border-t border-gray-700 bg-gray-900/60 font-medium tracking-wide text-gray-500", TABLE_HEADER_LABEL_TEXT_CLASS, local.class)} {...rest} />;
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
  const [local, rest] = splitProps(properties, ["class", "clickable", "active", "verticalAlign"]);
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
        "border-b border-gray-700 bg-gray-900/30 transition-colors duration-100 last:border-b-0",
        resolvedVerticalAlign() === "top" ? "align-top" : "align-middle",
        clickable() ? "cursor-pointer hover:bg-gray-800/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500" : "",
        isActive() ? "bg-blue-500/10 text-blue-200 hover:bg-blue-500/20" : "",
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
  const [local, rest] = splitProps(properties, ["class", "align", "monospace"]);
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
  return <th scope="col" class={mergeClasses("min-w-0 overflow-hidden font-semibold", alignClass(), local.monospace === true ? "font-mono" : "", TABLE_HEAD_CELL_PADDING_CLASS, local.class)} {...rest} />;
};

/**
 * Table data cell.
 */
export const TableCell = (properties: ComponentProps<"td"> & { align?: "left" | "right" | "center"; monospace?: boolean }) => {
  const [local, rest] = splitProps(properties, ["class", "align", "monospace"]);
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
  return <td class={mergeClasses("min-w-0 overflow-hidden", alignClass(), local.monospace === true ? "font-mono" : "", TABLE_DATA_CELL_PADDING_CLASS, local.class)} {...rest} />;
};

/**
 * Table caption.
 */
export const TableCaption = (properties: ComponentProps<"caption">) => {
  const [local, rest] = splitProps(properties, ["class"]);
  return <caption class={mergeClasses("mt-4 text-gray-400", TABLE_BODY_TEXT_CLASS, local.class)} {...rest} />;
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
 * Pagination controls for server-side limit/offset tables.
 */
export const TablePagination = (properties: TablePaginationProperties) => {
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

  return (
    <div class={mergeClasses("flex flex-wrap items-center justify-between gap-3 border-t border-gray-700 bg-gray-900/40 text-gray-400", TABLE_PAGINATION_BAR_PADDING_CLASS, TABLE_BODY_TEXT_CLASS, properties.class)}>
      <div class="flex items-center gap-2">
        <span class="font-medium text-gray-500">Rows per page</span>
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
          menuClass="w-24 top-auto bottom-full mb-1 mt-0"
          menuFullWidth={false}
          usePortal={false}
        >
          <DropdownTrigger class="w-24 border-gray-700 bg-gray-950/50 text-gray-200 hover:bg-gray-800">
            <DropdownValue>{selectedLimitValue()}</DropdownValue>
          </DropdownTrigger>
        </Dropdown>
      </div>

      <div class="flex items-center gap-2 md:gap-3">
        <Show when={properties.currentPageCount >= 0 && properties.currentPageCount > 0}>
          <span class={mergeClasses("px-1 font-medium tracking-wide text-gray-500 uppercase", TABLE_BODY_TEXT_CLASS)}>Page {currentPage()}</span>
        </Show>
        <div class="flex items-center gap-1.5">
          <IconButton
            icon={arrowLeft}
            variant="default"
            class="bg-gray-950/40"
            disabled={isPreviousDisabled()}
            aria-label="Previous page"
            onClick={() => {
              const nextOffset = Math.max(0, resolvedOffset() - resolvedLimit());
              properties.onChange({ limit: resolvedLimit(), offset: nextOffset });
            }}
          />
          <IconButton
            icon={chevronRight}
            variant="default"
            class="bg-gray-950/40"
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
};
