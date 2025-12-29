import { useMemo } from 'react';

interface UsePaginationProps {
  currentPage: number;
  totalPages: number;
  windowSize?: number;
}

type PaginationItem = number | 'ellipsis';

export function usePagination({ currentPage, totalPages, windowSize = 2 }: UsePaginationProps): PaginationItem[] {
  return useMemo(() => {
    const pages: PaginationItem[] = [];

    if (totalPages <= 0) return pages;

    // If total pages is small enough, show all
    const maxPagesBeforeEllipsis = 7 + windowSize * 2;

    if (totalPages <= maxPagesBeforeEllipsis) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const left = Math.max(0, currentPage - windowSize);
    const right = Math.min(totalPages - 1, currentPage + windowSize);

    // First page and ellipsis if needed
    if (left > 1) {
      pages.push(0);
      pages.push('ellipsis');
    } else {
      for (let i = 0; i < left; i++) {
        pages.push(i);
      }
    }

    // Pages around current
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    // Last page and ellipsis if needed
    if (right < totalPages - 2) {
      pages.push('ellipsis');
      pages.push(totalPages - 1);
    } else {
      for (let i = right + 1; i < totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  }, [currentPage, totalPages, windowSize]);
}
