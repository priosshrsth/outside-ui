"use client";

import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type UseLazySearchOptions = {
  /** Pre-populates the search field once, typically from URL/search params */
  initialQuery?: string;
  /** Fires after the debounce delay with the latest query value */
  onDebouncedChange: (query: string) => void;
  /** Debounce delay in milliseconds for invoking onDebouncedChange. Default `300`. */
  debounceMs?: number;
};

export type UseLazySearchReturn = {
  /** Current query string bound to the input */
  searchQuery: string;
  /** Input/onChange handler that debounces before calling onDebouncedChange */
  handleInputChangeDebounced: (e: string | ChangeEvent<HTMLInputElement>) => void;
  /** Imperatively set the query immediately (no debounce) */
  setQueryImmediate: Dispatch<SetStateAction<string>>;
};

export function useLazySearch({
  initialQuery,
  onDebouncedChange,
  debounceMs = 300,
}: UseLazySearchOptions): UseLazySearchReturn {
  const [searchQuery, setSearchQuery] = useState(() => initialQuery ?? "");

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChangeDebounced = useCallback(
    (e: string | ChangeEvent<HTMLInputElement>) => {
      const nextQuery = typeof e === "string" ? e : e.target.value;
      setSearchQuery(nextQuery);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        onDebouncedChange(nextQuery);
      }, debounceMs);
    },
    [onDebouncedChange, debounceMs],
  );

  useEffect(
    () => () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    },
    [],
  );

  return {
    searchQuery,
    handleInputChangeDebounced,
    setQueryImmediate: setSearchQuery,
  };
}
