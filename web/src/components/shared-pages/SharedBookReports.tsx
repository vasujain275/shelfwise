import { BookReportPDF } from "@/components/pdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import type { Book } from "@/types/book";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, Search, X } from "lucide-react";
import React, { useState } from "react";

const BOOK_SEARCH_DEBOUNCE = 400;
function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

type Transaction = {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userFullName: string;
  transactionType: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
  renewalCount: number;
  issuedByUserId: string;
  issuedByUserFullName: string;
  returnedToUserId?: string | null;
  returnedToUserFullName?: string | null;
  status: string;
  transactionNotes?: string | null;
  accessionNumber?: string;
  employeeId?: string;
  language?: string;
};

const SharedBookReports: React.FC = () => {
  const { user } = useAuthStore();
  const [bookQuery, setBookQuery] = useState("");
  const debouncedBookQuery = useDebouncedValue(bookQuery, BOOK_SEARCH_DEBOUNCE);
  const {
    data: bookResults = [],
    isLoading: isSearchingBooks,
    error: bookSearchError,
  } = useQuery<Book[]>({
    queryKey: ["book-search", debouncedBookQuery],
    queryFn: async () => {
      if (debouncedBookQuery.length < 2) return [];
      const res = await fetch(
        `/api/books/search?query=${encodeURIComponent(debouncedBookQuery)}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to search books");
      const data = await res.json();
      return data.data || [];
    },
    enabled: debouncedBookQuery.length >= 2,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const {
    data: bookTransactions = [],
    isLoading: isLoadingBookReports,
    error: bookReportsError,
  } = useQuery<Transaction[]>({
    queryKey: ["book-transactions", selectedBook?.id],
    queryFn: async () => {
      if (!selectedBook) return [];
      const res = await fetch(
        `/api/transactions/book/${selectedBook.id}?page=0&size=1000`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch book transactions");
      const data = await res.json();
      return data.data || [];
    },
    enabled: !!selectedBook,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (user?.userRole !== "ADMIN" && user?.userRole !== "SUPER_ADMIN") {
    return (
      <div className="max-w-2xl mx-auto my-12 p-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Access Denied
            </h2>
            <p className="text-red-600">
              Only Admins and Super Admins can access the Reports page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-2 md:px-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <img
          src="/shelfwise.webp"
          alt="ShelfWise Logo"
          className="w-20 h-20 mb-2"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-800 to-blue-400 bg-clip-text text-transparent mb-2">
          Book Reports
        </h1>
        <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl">
          Search for a book and generate its transaction report. Only Admins and
          Super Admins can access this page.
        </p>
      </div>
      <Card className="shadow-lg border-blue-100 bg-blue-50/30 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg font-semibold">Book Reports</span>
            <Search className="h-5 w-5 text-blue-700" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Book Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search book by title or accession no..."
                value={bookQuery}
                onChange={(e) => setBookQuery(e.target.value)}
                className="pl-10 pr-10 rounded-lg border-blue-200 focus:border-blue-500 shadow-sm"
              />
              {bookQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => {
                    setBookQuery("");
                    setSelectedBook(null);
                  }}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {bookSearchError && (
                <div className="text-xs text-red-600 mt-1">
                  {bookSearchError.message || bookSearchError.toString()}
                </div>
              )}
            </div>
            {/* Book Search Results */}
            {isSearchingBooks && (
              <div className="flex items-center gap-2 justify-center py-4">
                <Loader2 className="animate-spin" /> Searching books...
              </div>
            )}
            {!isSearchingBooks && bookResults.length > 0 && (
              <div className="space-y-4">
                <div className="font-medium text-sm text-muted-foreground">
                  Select a book to generate its transaction report:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookResults.map((b) => (
                    <div
                      key={b.id}
                      className={cn(
                        "p-4 border rounded-xl transition-all relative cursor-pointer bg-white/80 shadow-sm hover:shadow-lg",
                        selectedBook?.id === b.id
                          ? "bg-blue-100 border-blue-400 shadow-md"
                          : "hover:bg-blue-50 border-blue-200"
                      )}
                      onClick={() => setSelectedBook(b)}
                    >
                      <p className="font-semibold text-blue-900">{b.title}</p>
                      <p className="text-sm text-blue-700">
                        Accession No: {b.accessionNumber}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Author: {b.authorPrimary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Selected Book Reports */}
            {selectedBook && (
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-blue-900">
                    {selectedBook.title} ({selectedBook.accessionNumber})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBook(null)}
                    aria-label="Clear selection"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear selection</span>
                  </Button>
                </div>
                {isLoadingBookReports ? (
                  <div className="flex items-center gap-2 justify-center py-4">
                    <Loader2 className="animate-spin" /> Loading book
                    transactions...
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <PDFDownloadLink
                      document={
                        <BookReportPDF
                          book={selectedBook}
                          data={bookTransactions}
                          language={selectedBook.language}
                        />
                      }
                      fileName={`book-${selectedBook.accessionNumber}-transactions.pdf`}
                    >
                      {({ loading }) => (
                        <Button
                          disabled={loading || isLoadingBookReports}
                          variant="default"
                          className="w-full sm:w-auto gap-2 bg-blue-700 text-white hover:bg-blue-800"
                        >
                          {loading ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Download />
                          )}
                          {loading
                            ? "Generating..."
                            : "Download Transaction History"}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  </div>
                )}
                {bookReportsError && (
                  <div className="text-xs text-red-600 mt-1">
                    {bookReportsError.message || bookReportsError.toString()}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedBookReports;
