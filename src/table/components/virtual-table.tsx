"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  type ColumnDef as TanStackColumnDef,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { type CSSProperties, type ReactNode, useContext, useMemo, useRef } from "react";

import { SearchQueryContext } from "src/search-query/contexts/search-query-context";
import { SortAscIcon, SortDefaultIcon, SortDescIcon } from "src/table/components/icons";
import { useTableLoadMore } from "src/table/hooks/use-table-load-more";
import type {
  ColumnDef,
  LoadMoreProps,
  RowData,
  SortDirection,
  SortIcons,
  SortState,
  TableDensity,
} from "src/table/types/type";

type VirtualTableClassNames = {
  className?: string;
  scrollContainerClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;
  trClassName?: string;
  thClassName?: string;
  tdClassName?: string;
};

export type VirtualTableProps<TData extends RowData> = VirtualTableClassNames &
  LoadMoreProps & {
    data: TData[];
    columns: ColumnDef<TData>[];

    isLoading?: boolean;
    emptyMessage?: ReactNode;
    isError?: boolean;
    errorMessage?: ReactNode;

    sort?: SortState;
    onSortChange?: (sort: SortState) => void;
    sortIcons?: SortIcons;

    page?: number;
    pageSize?: number;

    /** Estimated row height in pixels. Default `48`. Rows that render
     * taller are measured and corrected via ResizeObserver. */
    estimateRowSize?: number;
    /** Rows rendered above / below the viewport. Default `10`. */
    overscan?: number;
    /**
     * Height of the internal scroll container. Accepts any CSS length
     * string or a number (treated as pixels). When omitted the
     * container sizes to its parent — wrap in a fixed-height element.
     */
    maxHeight?: string | number;
    /**
     * Inline style merged onto the scroll container. `maxHeight` above
     * is a convenience for the common case; use `scrollContainerStyle`
     * for fine-grained control.
     */
    scrollContainerStyle?: CSSProperties;

    /**
     * Vertical density. Defaults to `"comfortable"` (form-field scale).
     * Use `"compact"` for dense data listings and `"spacious"` for airy
     * card-like layouts. Drives cell + head padding via CSS tokens.
     */
    density?: TableDensity;
  };

function renderSortIcon(direction: SortDirection | null, icons: SortIcons | undefined): ReactNode {
  if (direction === "asc") {
    return icons?.asc ?? <SortAscIcon />;
  }
  if (direction === "desc") {
    return icons?.desc ?? <SortDescIcon />;
  }
  return icons?.default ?? <SortDefaultIcon />;
}

function capitalize(str: string): string {
  return (
    str.charAt(0).toUpperCase() +
    str
      .slice(1)
      .replace(/([A-Z])/g, " $1")
      .replace(/[_-]/g, " ")
  );
}

function toGridTrack<TData extends RowData>(col: ColumnDef<TData>): string {
  const w = col.width;
  if (w == null) return "minmax(0, 1fr)";
  if (typeof w === "number") return `${w}px`;
  return w;
}

function toLength(value: string | number | undefined): string | undefined {
  if (value == null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export function VirtualTable<TData extends RowData>({
  data,
  columns,
  className,
  scrollContainerClassName,
  theadClassName,
  tbodyClassName,
  trClassName,
  thClassName,
  tdClassName,
  isLoading = false,
  emptyMessage = "No data available.",
  isError = false,
  errorMessage = "Something went wrong.",
  sort,
  onSortChange,
  sortIcons,
  page: pageProp,
  pageSize: pageSizeProp,
  onLoadMore,
  hasMore,
  isFetchingMore = false,
  loadMoreLabel = "Loading more…",
  loadMoreThreshold,
  loadMoreRootMargin,
  estimateRowSize = 48,
  overscan = 10,
  maxHeight,
  scrollContainerStyle,
  density = "comfortable",
}: VirtualTableProps<TData>): ReactNode {
  const searchQueryCtx = useContext(SearchQueryContext);
  const page = pageProp ?? searchQueryCtx.searchQuery.page;
  const pageSize = pageSizeProp ?? searchQueryCtx.searchQuery.limit;

  const pageRef = useRef(page);
  const pageSizeRef = useRef(pageSize);
  pageRef.current = page;
  pageSizeRef.current = pageSize;

  const tanstackColumns = useMemo(() => {
    const helper = createColumnHelper<TData>();
    return columns.map((col) =>
      helper.display({
        id: col.accessor,
        header: () => col.header ?? capitalize(col.accessor),
        cell: (info) => {
          if (col.cell) {
            return col.cell(info.row.original, {
              rowIndex: info.row.index,
              pageIndex: (pageRef.current - 1) * pageSizeRef.current + info.row.index,
            });
          }
          return info.row.original[col.accessor] as ReactNode;
        },
      }),
    ) as TanStackColumnDef<TData, unknown>[];
  }, [columns]);

  const table = useReactTable({
    data,
    columns: tanstackColumns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const rows = table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowSize,
    overscan,
    // `getBoundingClientRect` measures actual row height for dynamic
    // content. Firefox historically miscalculates border heights, so
    // fall back to the estimate there (matches the known react-virtual
    // workaround).
    measureElement:
      typeof window !== "undefined" && !navigator.userAgent.includes("Firefox")
        ? (el) => el.getBoundingClientRect().height
        : undefined,
  });

  useTableLoadMore({
    sentinelRef,
    onLoadMore,
    hasMore,
    isFetchingMore,
    root: scrollRef.current,
    threshold: loadMoreThreshold,
    rootMargin: loadMoreRootMargin,
  });

  const handleSort = (accessor: string) => {
    if (!onSortChange) return;
    const nextDirection: SortDirection =
      sort?.field === accessor && sort.direction === "asc" ? "desc" : "asc";
    onSortChange({ field: accessor, direction: nextDirection });
  };

  const gridTemplateColumns = useMemo(() => columns.map(toGridTrack).join(" "), [columns]);

  const showEmpty = !(isLoading || isError) && data.length === 0;
  const showError = !isLoading && isError;
  const showRows = !(isLoading || isError || showEmpty);

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  const containerStyle: CSSProperties = {
    maxHeight: toLength(maxHeight),
    overflow: "auto",
    ...scrollContainerStyle,
  };

  return (
    <div
      className={clsx(className)}
      data-slot="table"
      data-variant="virtual"
      data-density={density}
      // role="table" only applies when there is row content to contain.
      // In empty/loading/error states the table-scroll child holds just a
      // status message (not a rowgroup), and axe's `aria-required-children`
      // rule would fail on a table role with a non-rowgroup child. Without
      // rows there's no table to announce — drop the role and let the
      // status message speak for itself.
      role={showRows ? "table" : undefined}
    >
      <div
        className={theadClassName}
        data-slot="table-header"
        role={showRows ? "rowgroup" : undefined}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <div
            className={trClassName}
            data-slot="table-head-row"
            key={headerGroup.id}
            role={showRows ? "row" : undefined}
            style={{ display: "grid", gridTemplateColumns }}
          >
            {headerGroup.headers.map((header) => {
              const colDef = columns.find((c) => c.accessor === header.id);
              const isSortable = colDef?.sortable && !!onSortChange;
              const sortDirection = sort?.field === header.id ? sort.direction : null;
              return (
                <div
                  className={clsx(thClassName, colDef?.thClassName)}
                  data-slot="table-head-cell"
                  data-sort-direction={sortDirection}
                  data-sortable={isSortable || undefined}
                  key={header.id}
                  onClick={isSortable ? () => handleSort(header.id) : undefined}
                  role={showRows ? "columnheader" : undefined}
                  aria-sort={
                    sortDirection === "asc"
                      ? "ascending"
                      : sortDirection === "desc"
                        ? "descending"
                        : isSortable
                          ? "none"
                          : undefined
                  }
                  tabIndex={isSortable ? 0 : undefined}
                  onKeyDown={
                    isSortable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSort(header.id);
                          }
                        }
                      : undefined
                  }
                >
                  <span data-slot="table-head-content">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {isSortable && renderSortIcon(sortDirection, sortIcons)}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/*
        The scroll container is itself the body rowgroup. Two reasons:
        (1) tabIndex={0} satisfies axe's `scrollable-region-focusable` rule —
        an overflow:auto container must be keyboard-focusable so non-mouse
        users can scroll.
        (2) role="rowgroup" is the only child role ARIA's `table` allows,
        so nesting a plain div (or one with role="presentation" / "group")
        between role="table" and the row content triggers
        `aria-required-children`. Promoting the scroll container to the
        rowgroup collapses that middle layer.

        The inner `data-slot="table-body"` stays purely as a layout helper
        (holding the virtualized total height + relative positioning for
        the absolutely-positioned rows); marking it role="presentation"
        keeps axe's tree view walking through it to the rows.
      */}
      <div
        ref={scrollRef}
        className={clsx(scrollContainerClassName)}
        data-slot="table-scroll"
        style={containerStyle}
        // Only apply rowgroup role when there are rows to contain — axe's
        // `aria-required-children` rule demands a rowgroup have at least
        // one row child. Empty/loading/error states get no role so the
        // container is a generic scroll wrapper that happens to be
        // keyboard-focusable via tabIndex.
        role={showRows ? "rowgroup" : undefined}
        tabIndex={0}
      >
        {isLoading && <div data-slot="table-loading">Loading…</div>}
        {showError && <div data-slot="table-error">{errorMessage}</div>}
        {showEmpty && <div data-slot="table-empty">{emptyMessage}</div>}

        {showRows && (
          <div
            className={tbodyClassName}
            data-slot="table-body"
            role="presentation"
            style={{ height: totalSize, position: "relative" }}
          >
            {virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index];
              if (!row) return null;
              return (
                <div
                  className={trClassName}
                  data-index={virtualRow.index}
                  data-slot="table-row"
                  key={row.id}
                  ref={virtualizer.measureElement}
                  role="row"
                  style={{
                    display: "grid",
                    gridTemplateColumns,
                    alignItems: "center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const colDef = columns.find((c) => c.accessor === cell.column.id);
                    return (
                      <div
                        className={clsx(tdClassName, colDef?.tdClassName)}
                        data-slot="table-cell"
                        key={cell.id}
                        role="cell"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {showRows && onLoadMore && (
          <div
            ref={sentinelRef}
            data-slot="table-load-more-sentinel"
            aria-hidden="true"
            style={{ height: 1 }}
          />
        )}
        {isFetchingMore && <div data-slot="table-load-more">{loadMoreLabel}</div>}
      </div>
    </div>
  );
}
