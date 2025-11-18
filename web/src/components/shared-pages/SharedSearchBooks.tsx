import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import type { Book, BookSearchResponse } from '@/types/book'
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, AlertCircle, Eye } from 'lucide-react';
import BookDetailModal from '@/components/modals/BookDetailModal';

const SharedSearchBooks: React.FC = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBooks = useCallback(async (page: number) => {
    if (!query) {
      setBooks([]);
      setTotalPages(0);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/books/search?query=${query}&page=${page}&size=10&sortBy=accessionNumber&sortDir=ASC`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result: BookSearchResponse = await response.json();
      setBooks(result.data);
      setTotalPages(result.pagination.totalPages);
      setCurrentPage(result.pagination.currentPage);
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) {
        fetchBooks(0);
      }
    }, 500); // Debounce search input

    return () => {
      clearTimeout(handler);
    };
  }, [query, fetchBooks]);

  const handlePageChange = (page: number) => {
    fetchBooks(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(0); // Reset to first page on new search
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  // Helper to generate pagination window
  const getPaginationWindow = (current: number, total: number, window: number = 2) => {
    const pages: (number | 'ellipsis')[] = [];
    if (total <= 7 + window * 2) {
      // Show all pages if not too many
      for (let i = 0; i < total; i++) pages.push(i);
    } else {
      // Always show first, last, and window around current
      const left = Math.max(0, current - window);
      const right = Math.min(total - 1, current + window);
      if (left > 1) {
        pages.push(0);
        pages.push('ellipsis');
      } else {
        for (let i = 0; i < left; i++) pages.push(i);
      }
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < total - 2) {
        pages.push('ellipsis');
        pages.push(total - 1);
      } else {
        for (let i = right + 1; i < total; i++) pages.push(i);
      }
    }
    return pages;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto p-4 md:p-6"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center justify-center text-center mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">Library Book Search</h1>
        <p className="text-muted-foreground">Find any book in our collection.</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="max-w-2xl mx-auto mb-8"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title, author, or ISBN..."
            className="w-full pl-10 py-6 text-base"
            value={query}
            onChange={handleSearch}
          />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-center my-8"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Searching...</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {!isLoading && !error && books.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="rounded-lg border overflow-hidden shadow-sm"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Accession Number</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {books.map((book, index) => (
                      <motion.tr
                        key={book.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleBookClick(book)}
                      >
                        <TableCell className="font-mono">{book.accessionNumber}</TableCell>
                        <TableCell>{book.locationShelf && book.locationRack ? `${book.locationShelf}.${book.locationRack}` : ''}</TableCell>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.authorPrimary}</TableCell>
                        <TableCell>{book.publicationYear || ''}</TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            book.bookStatus === 'AVAILABLE'
                            ? 'bg-green-100 text-green-800'
                            : book.bookStatus === 'ISSUED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                            {book.bookStatus.replace('_', ' ')}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookClick(book);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </motion.button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </motion.div>

            {totalPages > 1 && (
              <motion.div
                variants={itemVariants}
                className="mt-8"
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => { e.preventDefault(); if (currentPage > 0) handlePageChange(currentPage - 1); }}
                        className={currentPage === 0 ? 'pointer-events-none opacity-50' : undefined}
                      />
                    </PaginationItem>
                    {getPaginationWindow(currentPage, totalPages, 2).map((page, i) => (
                      page === 'ellipsis' ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                          <span className="px-2">...</span>
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => { e.preventDefault(); handlePageChange(page as number); }}
                          >
                            {(page as number) + 1}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => { e.preventDefault(); if (currentPage < totalPages - 1) handlePageChange(currentPage + 1); }}
                        className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : undefined}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}
          </motion.div>
        )}

        {!isLoading && !error && query && books.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-center text-muted-foreground mt-8"
          >
            <p>No books found for "{query}". Try a different search.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </motion.div>
  );
};

export default SharedSearchBooks;
