import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  mobileLabel?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyTitle?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (item: T) => void;
  rowClassName?: string | ((item: T) => string);
  actions?: (item: T) => React.ReactNode;
  mobileCardRender?: (item: T, actions?: React.ReactNode) => React.ReactNode;
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
    },
  },
};

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyMessage = "No results found",
  emptyTitle = "No Data",
  currentPage = 0,
  totalPages = 0,
  onPageChange,
  onRowClick,
  rowClassName,
  actions,
  mobileCardRender,
}: DataTableProps<T>) {
  const isMobile = useIsMobile();
  const paginationItems = usePagination({ currentPage, totalPages });

  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  const getValue = (item: T, key: keyof T | string): React.ReactNode => {
    const keys = (key as string).split(".");
    let value: unknown = item;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return value as React.ReactNode;
  };

  if (isLoading) {
    return <LoadingState message="Loading data..." />;
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyMessage} />;
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <div className="space-y-4">
        <AnimatePresence>
          {data.map((item, index) => (
            <motion.div
              key={keyExtractor(item)}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
            >
              {mobileCardRender ? (
                mobileCardRender(item, actions?.(item))
              ) : (
                <Card
                  className={cn(
                    "cursor-pointer hover:shadow-md transition-shadow",
                    typeof rowClassName === "function"
                      ? rowClassName(item)
                      : rowClassName
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  <CardContent className="p-4 space-y-2">
                    {columns
                      .filter((col) => !col.hideOnMobile)
                      .map((col) => (
                        <div
                          key={col.key as string}
                          className="flex justify-between items-start gap-2"
                        >
                          <span className="text-sm text-muted-foreground font-medium">
                            {col.mobileLabel || col.header}:
                          </span>
                          <span className="text-sm text-right flex-1 truncate">
                            {col.render
                              ? col.render(item)
                              : getValue(item, col.key)}
                          </span>
                        </div>
                      ))}
                    {actions && (
                      <div className="pt-2 border-t flex justify-end gap-2">
                        {actions(item)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pagination for mobile */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-3 py-2 text-sm rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-2 text-sm rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }

  // Desktop Table View
  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key as string} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="text-center">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {data.map((item, index) => (
                <motion.tr
                  key={keyExtractor(item)}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    onRowClick && "cursor-pointer",
                    typeof rowClassName === "function"
                      ? rowClassName(item)
                      : rowClassName
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key as string}
                      className={col.className}
                    >
                      {col.render ? col.render(item) : getValue(item, col.key)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-center">
                      <div
                        className="flex justify-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {actions(item)}
                      </div>
                    </TableCell>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={
                  currentPage === 0
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
            {paginationItems.map((page, i) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <span className="px-2">...</span>
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                  >
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage >= totalPages - 1
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
