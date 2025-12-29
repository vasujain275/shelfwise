import { useCallback, useEffect, useState } from 'react';

interface UseDebouncedSearchProps<T> {
  fetchFn: (query: string, page: number) => Promise<{
    data: T[];
    totalPages: number;
    currentPage: number;
  }>;
  debounceMs?: number;
  initialQuery?: string;
}

interface UseDebouncedSearchReturn<T> {
  query: string;
  setQuery: (query: string) => void;
  data: T[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  handlePageChange: (page: number) => void;
  refresh: () => void;
}

export function useDebouncedSearch<T>({
  fetchFn,
  debounceMs = 500,
  initialQuery = '',
}: UseDebouncedSearchProps<T>): UseDebouncedSearchReturn<T> {
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (searchQuery: string, page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn(searchQuery, page);
      setData(result.data);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData(query, 0);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs, fetchData]);

  const handlePageChange = useCallback((page: number) => {
    fetchData(query, page);
  }, [query, fetchData]);

  const refresh = useCallback(() => {
    fetchData(query, currentPage);
  }, [query, currentPage, fetchData]);

  return {
    query,
    setQuery,
    data,
    totalPages,
    currentPage,
    isLoading,
    error,
    handlePageChange,
    refresh,
  };
}
