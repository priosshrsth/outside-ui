import type { ReactNode } from "react";

export type RowData = Record<string, unknown>;

export type ColumnDef<TData extends RowData> = {
  /** Column identifier — used as accessor key into row data */
  accessor: Extract<keyof TData, string> | (string & {});
  /** Column header label. Defaults to capitalized accessor */
  header?: ReactNode;
  /** Custom cell renderer. Receives the row and meta info */
  cell?: (row: TData, meta: { rowIndex: number; pageIndex: number }) => ReactNode;
  /** Whether this column is sortable */
  sortable?: boolean;
  /**
   * Column width. Accepts any valid CSS grid track value
   * (e.g. `"200px"`, `"minmax(120px, 1fr)"`, `"1fr"`) or a number
   * treated as pixels. Used by `VirtualTable` to build its grid
   * template; ignored by the semantic `Table` unless you style
   * columns yourself via `thClassName` / `tdClassName`.
   */
  width?: string | number;
  /** Custom class for the <th> */
  thClassName?: string;
  /** Custom class for the <td> */
  tdClassName?: string;
};

export type SortDirection = "asc" | "desc";

export type SortState = {
  field: string;
  direction: SortDirection;
};

/**
 * Customize the three sort indicator icons. Any icon omitted falls back to
 * the built-in SVG default. Icons inherit the surrounding font size via `1em`,
 * so wrap the header content in a sized element to scale them.
 */
export type SortIcons = {
  /** Shown when the column is sorted ascending */
  asc?: ReactNode;
  /** Shown when the column is sorted descending */
  desc?: ReactNode;
  /** Shown when the column is sortable but not currently active */
  default?: ReactNode;
};

/**
 * Shared props for infinite-scroll on both `Table` and `VirtualTable`.
 * Pass `onLoadMore` to opt in; the library handles IntersectionObserver
 * wiring and the "don't double-fire" logic based on `hasMore` /
 * `isFetchingMore`.
 */
export type LoadMoreProps = {
  /** Fired when the sentinel at the end of the list enters view. */
  onLoadMore?: () => void;
  /**
   * When `false`, the observer stops firing onLoadMore. Leave unset or
   * `true` for endpoints without a known total.
   */
  hasMore?: boolean;
  /**
   * Render-time flag for "a page is in flight." While true, the library
   * suppresses onLoadMore and a `data-slot="table-load-more"` row is
   * rendered so you can style a default spinner without wiring your own.
   */
  isFetchingMore?: boolean;
  /** Label (or node) shown in the load-more row while fetching. */
  loadMoreLabel?: ReactNode;
  /** IntersectionObserver threshold. Default `0`. */
  loadMoreThreshold?: number;
  /**
   * IntersectionObserver rootMargin. Default `"0px"`. Useful for
   * triggering `onLoadMore` slightly before the user hits the bottom,
   * e.g. `"200px 0px"`.
   */
  loadMoreRootMargin?: string;
};
