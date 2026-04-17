/** Default Tailwind class presets for Table + Pagination data-slots */
export const defaultTableStyles = {
  className: "w-full border-collapse overflow-clip rounded-md",
  theadClassName: "bg-muted/50 border-b border-border",
  trClassName: "hover:bg-muted/20 transition-colors duration-150",
  thClassName:
    "px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider",
  tdClassName: "px-6 py-4 text-sm text-foreground",
};

/**
 * Defaults for VirtualTable — differs from `defaultTableStyles` because
 * the row layout is CSS grid, not table layout, so cell padding lives on
 * the cells themselves rather than td/th selectors.
 */
export const defaultVirtualTableStyles = {
  className: "w-full overflow-clip rounded-md border border-border",
  scrollContainerClassName: "h-full",
  theadClassName: "bg-muted/50 border-b border-border",
  trClassName: "hover:bg-muted/20 transition-colors duration-150 border-b border-border",
  thClassName:
    "px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider",
  tdClassName: "px-6 py-4 text-sm text-foreground",
};

export const defaultPaginationStyles = {
  className: "flex items-center justify-between gap-4 py-4",
  navButtonClassName: "px-3 py-1.5 rounded-md text-sm disabled:opacity-40",
  pageButtonClassName: "px-3 py-1.5 rounded-md text-sm",
  activePageButtonClassName: "font-bold bg-primary text-primary-foreground",
};
