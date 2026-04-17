"use client";

import { type RefObject, useEffect, useRef } from "react";

export type UseTableLoadMoreOptions = {
  /** Ref to a 0×0 sentinel element placed at the end of the scrollable region. */
  sentinelRef: RefObject<HTMLElement | null>;
  /**
   * Invoked when the sentinel scrolls into view. The library suppresses
   * further invocations while `isFetchingMore` is true or `hasMore` is
   * explicitly false, so consumers don't have to guard against
   * double-firing.
   */
  onLoadMore?: () => void;
  /**
   * When `false`, the observer stays attached but no longer fires
   * onLoadMore. Leaving this unset (or `true`) means "more is
   * available" — handy for endpoints without a finite total.
   */
  hasMore?: boolean;
  /** Render-time flag that the consumer is fetching the next page. */
  isFetchingMore?: boolean;
  /** Optional scroll container used as the IntersectionObserver `root`. */
  root?: Element | null;
  /**
   * IntersectionObserver threshold. Default `0` — fires as soon as the
   * sentinel is 1px inside the root.
   */
  threshold?: number;
  /** IntersectionObserver rootMargin. Default `"0px"`. */
  rootMargin?: string;
};

/**
 * Attaches an IntersectionObserver to a sentinel element and invokes
 * `onLoadMore` when it enters view. Uses a ref for the callback state
 * so the observer is not torn down when props change each render.
 */
export function useTableLoadMore({
  sentinelRef,
  onLoadMore,
  hasMore,
  isFetchingMore,
  root,
  threshold = 0,
  rootMargin = "0px",
}: UseTableLoadMoreOptions): void {
  const stateRef = useRef({ hasMore, isFetchingMore, onLoadMore });
  stateRef.current = { hasMore, isFetchingMore, onLoadMore };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        const { hasMore: more, isFetchingMore: fetching, onLoadMore: cb } = stateRef.current;
        if (cb && more !== false && !fetching) {
          cb();
        }
      },
      { root, threshold, rootMargin },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinelRef, root, threshold, rootMargin]);
}
