import BookDetailModal from "@/components/modals/BookDetailModal";
import type { Column } from "@/components/shared";
import {
  DataTable,
  EmptyState,
  ErrorState,
  PageHeader,
  SearchInput,
  StatusBadge,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Book, BookSearchResponse } from "@/types/book";
import { motion } from "framer-motion";
import { Eye, Search } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

const SharedSearchBooks: React.FC = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBooks = useCallback(
    async (page: number) => {
      if (!query) {
        setBooks([]);
        setTotalPages(0);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/books/search?query=${query}&page=${page}&size=10&sortBy=accessionNumber&sortDir=ASC`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: BookSearchResponse = await response.json();
        setBooks(result.data);
        setTotalPages(result.pagination.totalPages);
        setCurrentPage(result.pagination.currentPage);
      } catch {
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) {
        fetchBooks(0);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query, fetchBooks]);

  const handlePageChange = (page: number) => {
    fetchBooks(page);
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const columns: Column<Book>[] = [
    {
      key: "accessionNumber",
      header: "Accession #",
      mobileLabel: "Accession",
      className: "font-mono",
    },
    {
      key: "location",
      header: "Location",
      hideOnMobile: true,
      render: (book) =>
        book.locationShelf && book.locationRack
          ? `${book.locationShelf}.${book.locationRack}`
          : "-",
    },
    {
      key: "title",
      header: "Title",
      className: "font-medium max-w-[200px] truncate",
    },
    {
      key: "authorPrimary",
      header: "Author",
      mobileLabel: "Author",
      className: "max-w-[150px] truncate",
    },
    {
      key: "publicationYear",
      header: "Year",
      hideOnMobile: true,
      render: (book) => book.publicationYear || "-",
    },
    {
      key: "bookStatus",
      header: "Status",
      className: "text-center",
      render: (book) => <StatusBadge status={book.bookStatus} size="sm" />,
    },
  ];

  // Mobile card render
  const renderMobileCard = (book: Book) => (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
      onClick={() => handleBookClick(book)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{book.title}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {book.authorPrimary}
            </p>
          </div>
          <StatusBadge status={book.bookStatus} size="sm" />
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span className="font-mono">{book.accessionNumber}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              handleBookClick(book);
            }}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Library Book Search"
        description="Find any book in our collection"
        icon={Search}
        centered
      />

      <div className="max-w-2xl mx-auto">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by title, author, or ISBN..."
          size="lg"
        />
      </div>

      {error && (
        <ErrorState message={error} onRetry={() => fetchBooks(currentPage)} />
      )}

      {!error && !query && !isLoading && (
        <EmptyState
          icon={Search}
          title="Start searching"
          description="Enter a search term to find books in our collection"
        />
      )}

      {!error && query && (
        <DataTable
          data={books}
          columns={columns}
          keyExtractor={(book) => book.id}
          isLoading={isLoading}
          emptyTitle="No books found"
          emptyMessage={`No books found for "${query}". Try a different search term.`}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onRowClick={handleBookClick}
          mobileCardRender={renderMobileCard}
          actions={(book) => (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              onClick={() => handleBookClick(book)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        />
      )}

      <BookDetailModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </motion.div>
  );
};

export default SharedSearchBooks;
