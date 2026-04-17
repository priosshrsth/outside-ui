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
