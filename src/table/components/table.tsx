"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  type ColumnDef as TanStackColumnDef,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { type ReactNode, useContext, useMemo, useRef } from "react";

import { SearchQueryContext } from "src/search-query/contexts/search-query-context";
import { useTableLoadMore } from "src/table/hooks/use-table-load-more";
import { SortAscIcon, SortDefaultIcon, SortDescIcon } from "src/table/components/icons";
import type {
  ColumnDef,
  LoadMoreProps,
  RowData,
  SortDirection,
  SortIcons,
  SortState,
} from "src/table/types/type";

type TableClassNames = {
  className?: string;
  theadClassName?: string;
  tbodyClassName?: string;
  trClassName?: string;
  thClassName?: string;
  tdClassName?: string;
};

export type TableProps<TData extends RowData> = TableClassNames &
  LoadMoreProps & {
    data: TData[];
    columns: ColumnDef<TData>[];

    /** Loading state — shows skeleton/placeholder rows */
    isLoading?: boolean;
    /** Content shown when data is empty and not loading */
    emptyMessage?: ReactNode;
    /** Error state flag */
    isError?: boolean;
    /** Content shown when isError is true */
    errorMessage?: ReactNode;

    /** Server-side sort state */
    sort?: SortState;
    /** Called when a sortable column header is clicked */
    onSortChange?: (sort: SortState) => void;
    /**
     * Customize the three sort indicator icons (ascending, descending, inactive).
     * Any icon omitted falls back to the built-in SVG default.
     */
    sortIcons?: SortIcons;

    /** Page number (1-indexed). Falls back to SearchQueryProvider context if omitted */
    page?: number;
    /** Page size. Falls back to SearchQueryProvider context if omitted */
    pageSize?: number;
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

export function Table<TData extends RowData>({
  data,
  columns,
  className,
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
}: TableProps<TData>): ReactNode {
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

  const sentinelRef = useRef<HTMLDivElement>(null);
  useTableLoadMore({
    sentinelRef,
    onLoadMore,
    hasMore,
    isFetchingMore,
    threshold: loadMoreThreshold,
    rootMargin: loadMoreRootMargin,
  });

  const handleSort = (accessor: string) => {
    if (!onSortChange) {
      return;
    }

    const nextDirection: SortDirection =
      sort?.field === accessor && sort.direction === "asc" ? "desc" : "asc";
    onSortChange({ field: accessor, direction: nextDirection });
  };

  const colCount = columns.length;
  const showEmpty = !(isLoading || isError) && data.length === 0;
  const showError = !isLoading && isError;
  const showRows = !(isLoading || isError || showEmpty);

  return (
    <table className={clsx(className)} data-slot="table">
      <thead className={theadClassName} data-slot="table-header">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr className={trClassName} data-slot="table-head-row" key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const colDef = columns.find((c) => c.accessor === header.id);
              const isSortable = colDef?.sortable && !!onSortChange;
              const sortDirection = sort?.field === header.id ? sort.direction : null;

              return (
                <th
                  className={clsx(
                    thClassName,
                    colDef?.thClassName,
                    isSortable && "cursor-pointer select-none",
                  )}
                  data-slot="table-head-cell"
                  data-sort-direction={sortDirection}
                  data-sortable={isSortable || undefined}
                  key={header.id}
                  onClick={isSortable ? () => handleSort(header.id) : undefined}
                >
                  <span data-slot="table-head-content">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {isSortable && renderSortIcon(sortDirection, sortIcons)}
                  </span>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody className={tbodyClassName} data-slot="table-body">
        {isLoading && (
          <tr className={trClassName} data-slot="table-row">
            <td className={tdClassName} colSpan={colCount} data-slot="table-cell">
              <div data-slot="table-loading">Loading…</div>
            </td>
          </tr>
        )}

        {showError && (
          <tr className={trClassName} data-slot="table-row">
            <td className={tdClassName} colSpan={colCount} data-slot="table-cell">
              <div data-slot="table-error">{errorMessage}</div>
            </td>
          </tr>
        )}

        {showEmpty && (
          <tr className={trClassName} data-slot="table-row">
            <td className={tdClassName} colSpan={colCount} data-slot="table-cell">
              <div data-slot="table-empty">{emptyMessage}</div>
            </td>
          </tr>
        )}

        {showRows &&
          table.getRowModel().rows.map((row) => (
            <tr className={trClassName} data-slot="table-row" key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const colDef = columns.find((c) => c.accessor === cell.column.id);
                return (
                  <td
                    className={clsx(tdClassName, colDef?.tdClassName)}
                    data-slot="table-cell"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}

        {showRows && onLoadMore && (
          <tr data-slot="table-load-more-row" aria-hidden="true">
            <td colSpan={colCount} style={{ padding: 0, border: 0 }}>
              <div ref={sentinelRef} data-slot="table-load-more-sentinel" style={{ height: 1 }} />
            </td>
          </tr>
        )}

        {isFetchingMore && (
          <tr className={trClassName} data-slot="table-load-more-row">
            <td className={tdClassName} colSpan={colCount} data-slot="table-cell">
              <div data-slot="table-load-more">{loadMoreLabel}</div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
