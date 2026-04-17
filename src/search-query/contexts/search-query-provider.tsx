"use client";

import { type ReactNode, useCallback, useState } from "react";

import { useLazySearch } from "src/lazy-search/hooks/use-lazy-search";
import type {
  IBaseSearchQuery,
  ISearchQueryContext,
} from "src/search-query/types/search-query-context-types";
import { setSearchParams } from "src/set-search-params";

import { SearchQueryContext } from "./search-query-context";

type ProviderProps<T extends IBaseSearchQuery> = {
  defaultValues?: Partial<T>;
  children: ReactNode;
  initialSearchParams?: Partial<IBaseSearchQuery & T>;
  syncWithUrl?: boolean;
};

export function SearchQueryProvider<T extends IBaseSearchQuery>({
  children,
  initialSearchParams,
  defaultValues,
  syncWithUrl = false,
}: ProviderProps<T>): ReactNode {
  const [searchQuery, setSearchQuery] = useState<T>({
    ...defaultValues,
    ...initialSearchParams,
  } as T);

  const [total, setTotal] = useState(0);

  const updateQuery = useCallback(
    (newFilters: Partial<T>) => {
      const prevFilters = { ...searchQuery };

      if (
        (newFilters.sortBy || !newFilters.sortOrder || newFilters.search || newFilters.limit) &&
        !newFilters.page
      ) {
        newFilters.page = 1;
      }

      const updatedFilters = {
        ...searchQuery,
        ...newFilters,
      };

      if (syncWithUrl) {
        const changedFilters = (Object.keys(newFilters) as (keyof T)[]).reduce((diff, key) => {
          if (key === "custom") {
            return diff;
          }
          if (!Object.is(prevFilters[key], newFilters[key])) {
            diff[key] = newFilters[key];
          }
          return diff;
        }, {} as Partial<T>);

        setSearchParams(changedFilters as Record<string, unknown>);
      }

      setSearchQuery(updatedFilters);
    },
    [searchQuery, syncWithUrl],
  );

  const { handleInputChangeDebounced } = useLazySearch({
    initialQuery: typeof initialSearchParams?.search === "string" ? initialSearchParams.search : "",
    onDebouncedChange: (value: string) =>
      updateQuery({
        search: value,
        page: 1,
      } as Partial<T>),
  });

  const contextValue: ISearchQueryContext<T> = {
    searchQuery,
    updateQuery,
    total,
    handleSearch: handleInputChangeDebounced,
    setTotal,
  };

  return (
    <SearchQueryContext.Provider value={contextValue as unknown as ISearchQueryContext}>
      {children}
    </SearchQueryContext.Provider>
  );
}
