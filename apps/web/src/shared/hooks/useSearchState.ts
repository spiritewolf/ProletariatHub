import { useEffect, useState } from 'react';

type UseSearchStateOptions = {
  defaultSearchText?: string;
  debounceMs?: number;
};

export type UseSearchStateResult = {
  searchText: string;
  setSearchText: (nextSearchText: string) => void;
  searchTextDebounced: string;
};

export function useSearchState(options: UseSearchStateOptions = {}): UseSearchStateResult {
  const [searchText, setSearchText] = useState(options.defaultSearchText ?? '');
  const delayMs = options.debounceMs ?? 300;
  const [debouncedValue, setDebouncedValue] = useState(searchText);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedValue(searchText);
    }, delayMs);
    return () => {
      clearTimeout(t);
    };
  }, [searchText, delayMs]);

  return { searchText, setSearchText, searchTextDebounced: debouncedValue };
}
