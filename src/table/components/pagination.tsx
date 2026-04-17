"use client";

import clsx from "clsx";
import { type ReactNode, useContext } from "react";

import { SearchQueryContext } from "src/search-query/contexts/search-query-context";
import { ChevronLeftIcon, ChevronRightIcon } from "src/table/components/icons";

const MAX_PAGES_TO_SHOW_ALL = 7;
const MIN_PAGE_FOR_ELLIPSIS = 3;

export type PaginationProps = {
  /** Current page (1-indexed). Falls back to SearchQueryProvider context */
  page?: number;
  /** Items per page. Falls back to SearchQueryProvider context */
  pageSize?: number;
  /** Total item count. Falls back to SearchQueryProvider context */
  total?: number;
  /** Called when page changes. Falls back to SearchQueryProvider updateQuery */
  onPageChange?: (page: number) => void;

  className?: string;
  navButtonClassName?: string;
  pageButtonClassName?: string;
  activePageButtonClassName?: string;
  prevLabel?: ReactNode;
  nextLabel?: ReactNode;
  /** Accessible label for the previous-page button. Rendered via `aria-label`. */
  prevAriaLabel?: string;
  /** Accessible label for the next-page button. Rendered via `aria-label`. */
  nextAriaLabel?: string;
};

export function Pagination({
  page: pageProp,
  pageSize: pageSizeProp,
  total: totalProp,
  onPageChange: onPageChangeProp,
  className,
  navButtonClassName,
  pageButtonClassName,
  activePageButtonClassName,
  prevLabel = <ChevronLeftIcon />,
  nextLabel = <ChevronRightIcon />,
  prevAriaLabel = "Previous page",
  nextAriaLabel = "Next page",
}: PaginationProps): ReactNode {
  const ctx = useContext(SearchQueryContext);

  const page = pageProp ?? ctx.searchQuery.page;
  const pageSize = pageSizeProp ?? ctx.searchQuery.limit;
  const total = totalProp ?? ctx.total;
  const onPageChange = onPageChangeProp ?? ((p: number) => ctx.updateQuery({ page: p }));

  const totalPages = Math.ceil(total / pageSize);

  if (!Number.isFinite(totalPages) || totalPages <= 1) {
    return null;
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const renderPageButton = (num: number) => (
    <button
      aria-current={page === num ? "page" : undefined}
      className={clsx(pageButtonClassName, page === num && activePageButtonClassName)}
      data-active={page === num || undefined}
      data-slot="pagination-page"
      key={num}
      onClick={() => onPageChange(num)}
      type="button"
    >
      {num}
    </button>
  );

  const renderPages = (): ReactNode[] => {
    if (totalPages <= MAX_PAGES_TO_SHOW_ALL) {
      return Array.from({ length: totalPages }, (_, i) => renderPageButton(i + 1));
    }

    const pages: ReactNode[] = [];

    pages.push(renderPageButton(1));

    if (page > MIN_PAGE_FOR_ELLIPSIS) {
      pages.push(
        <span data-slot="pagination-ellipsis" key="left-ellipsis">
          …
        </span>,
      );
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) {
      pages.push(renderPageButton(i));
    }

    if (page < totalPages - 2) {
      pages.push(
        <span data-slot="pagination-ellipsis" key="right-ellipsis">
          …
        </span>,
      );
    }

    if (totalPages > 1) {
      pages.push(renderPageButton(totalPages));
    }

    return pages;
  };

  return (
    <nav aria-label="Pagination" className={clsx(className)} data-slot="pagination">
      <span data-slot="pagination-summary">
        Showing {total > 0 ? startItem : 0}–{endItem} of {total} results
      </span>

      <div data-slot="pagination-controls">
        <button
          aria-label={prevAriaLabel}
          className={clsx(navButtonClassName)}
          data-slot="pagination-prev"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          {prevLabel}
        </button>

        <div data-slot="pagination-pages">{renderPages()}</div>

        <button
          aria-label={nextAriaLabel}
          className={clsx(navButtonClassName)}
          data-slot="pagination-next"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          {nextLabel}
        </button>
      </div>
    </nav>
  );
}
