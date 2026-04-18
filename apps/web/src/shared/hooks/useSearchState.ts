import { useState } from 'react';

import { useDebounced } from './useDebounced';

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
  const searchTextDebounced = useDebounced(searchText, options.debounceMs ?? 300);

  return { searchText, setSearchText, searchTextDebounced };
}
