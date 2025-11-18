import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Edit, Trash2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import type { Book, BookSearchResponse } from "@/types/book";
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import EditBookModal from '@/components/modals/EditBookModal';

// --- Book Form Schema (reuse from SharedAddBook) ---
const bookConditions = ["EXCELLENT", "GOOD", "FAIR", "POOR", "DAMAGED"] as const;
const bookStatuses = ["AVAILABLE", "ISSUED", "LOST", "DAMAGED", "UNDER_REPAIR", "UNAVAILABLE"] as const;
const bookTypes = ["REFERENCE", "GENERAL", "JOURNAL", "MAGAZINE", "THESIS", "REPORT", "TEST", "GIFTED", "OTHER"] as const;
const bookFormSchema = z.object({
  accessionNumber: z.string().min(1, "Accession Number is required."),
  isbn: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  authorPrimary: z.string().optional(),
  authorSecondary: z.string().optional(),
  publisher: z.string().optional(),
  publicationPlace: z.string().optional(),
  publicationYear: z.coerce.number().optional(),
  edition: z.string().optional(),
  pages: z.string().optional(),
  language: z.string().optional(),
  price: z.coerce.number().optional(),
  billNumber: z.string().optional(),
  vendorName: z.string().optional(),
  purchaseDate: z.string().optional(),
  keywords: z.string().optional(),
  classificationNumber: z.string().optional(),
  locationShelf: z.string().optional(),
  locationRack: z.string().optional(),
  bookCondition: z.enum(bookConditions).optional(),
  bookStatus: z.enum(bookStatuses).optional(),
  totalCopies: z.coerce.number().optional(),
  availableCopies: z.coerce.number().optional(),
  bookType: z.enum(bookTypes).optional(),
  isReferenceOnly: z.boolean().default(false).optional(),
  notes: z.string().optional(),
});
type BookFormValues = z.infer<typeof bookFormSchema>;

const SharedManageBooks: React.FC = () => {
  const { user } = useAuthStore();
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteBook, setDeleteBook] = useState<Book | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Only admin and super admin can access
  if (user?.userRole !== "ADMIN" && user?.userRole !== "SUPER_ADMIN") {
    return (
      <div className="max-w-2xl mx-auto my-12 p-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 w-12 h-12 text-red-500" />
            <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
            <p className="text-red-600">Only Admins and Super Admins can access the Manage Books page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Fetch Books ---
  const fetchBooks = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      let url;
      if (query && query.trim() !== "") {
        url = `/api/books/search?query=${encodeURIComponent(query)}&page=${page}&size=10`;
      } else {
        url = `/api/books?page=${page}&size=10&sortBy=accessionNumber&sortDir=ASC`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch books");
      const result: BookSearchResponse = await response.json();
      setBooks(result.data);
      setTotalPages(result.pagination.totalPages);
      setCurrentPage(result.pagination.currentPage);
    } catch (err) {
      setError("Failed to fetch books. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchBooks(0);
  }, [fetchBooks]);

  const handlePageChange = (page: number) => {
    fetchBooks(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(0);
  };

  // Helper to generate pagination window
  const getPaginationWindow = (current: number, total: number, window: number = 2) => {
    const pages: (number | 'ellipsis')[] = [];
    if (total <= 7 + window * 2) {
      for (let i = 0; i < total; i++) pages.push(i);
    } else {
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

  // --- Edit Book Modal Logic ---
  const editForm = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {},
  });

  const openEditModal = (book: Book) => {
    setEditBook(book);
    setIsEditModalOpen(true);
    // Map all nulls to undefined for optional fields
    const formValues: BookFormValues = {
      accessionNumber: book.accessionNumber ?? "",
      isbn: book.isbn ?? undefined,
      title: book.title ?? undefined,
      subtitle: book.subtitle ?? undefined,
      authorPrimary: book.authorPrimary ?? undefined,
      authorSecondary: book.authorSecondary ?? undefined,
      publisher: book.publisher ?? undefined,
      publicationPlace: book.publicationPlace ?? undefined,
      publicationYear: book.publicationYear ?? undefined,
      edition: book.edition ?? undefined,
      pages: book.pages ?? undefined,
      language: book.language ?? undefined,
      price: book.price ?? undefined,
      billNumber: book.billNumber ?? undefined,
      vendorName: book.vendorName ?? undefined,
      purchaseDate: book.purchaseDate ?? undefined,
      keywords: book.keywords ?? undefined,
      classificationNumber: book.classificationNumber ?? undefined,
      locationShelf: book.locationShelf ?? undefined,
      locationRack: book.locationRack ?? undefined,
      bookCondition: book.bookCondition ?? undefined,
      bookStatus: book.bookStatus ?? undefined,
      totalCopies: book.totalCopies ?? undefined,
      availableCopies: book.availableCopies ?? undefined,
      bookType: book.bookType ?? undefined,
      isReferenceOnly: book.isReferenceOnly ?? undefined,
      notes: book.notes ?? undefined,
    };
    editForm.reset(formValues);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditBook(null);
    editForm.reset({});
  };

  const handleEditSubmit = async (values: BookFormValues) => {
    if (!editBook) return;
    try {
      // Exclude accessionNumber from the update payload
      const { accessionNumber, ...rest } = values;
      const payload = {
        ...rest,
        purchaseDate: values.purchaseDate ? format(new Date(values.purchaseDate), "yyyy-MM-dd") : undefined,
      };
      const response = await fetch(`/api/books/${editBook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update book.");
      }
      toast.success("Book updated successfully!");
      closeEditModal();
      fetchBooks(currentPage);
    } catch (err: any) {
      toast.error(err.message || "Failed to update book.");
    }
  };

  // --- Delete Book Dialog Logic ---
  const openDeleteDialog = (book: Book) => {
    setDeleteBook(book);
    setIsDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteBook(null);
  };
  const handleDelete = async () => {
    if (!deleteBook) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/books/${deleteBook.id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete book.");
      }
      toast.success("Book deleted successfully!");
      closeDeleteDialog();
      fetchBooks(currentPage);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete book.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Render ---
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto p-4 md:p-6">
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Manage Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title, author, or ISBN..."
                className="w-full pl-10 py-3 text-base"
                value={query}
                onChange={handleSearch}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center justify-center my-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Loading books...</p>
              </motion.div>
            )}
            {error && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Alert variant="destructive" className="max-w-2xl mx-auto">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            {!isLoading && !error && books.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-lg border overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Accession Number</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {books.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell className="font-mono">{book.accessionNumber}</TableCell>
                          <TableCell>{book.title}</TableCell>
                          <TableCell>{book.authorPrimary}</TableCell>
                          <TableCell>{book.locationShelf && book.locationRack ? `${book.locationShelf}.${book.locationRack}` : ''}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {book.bookStatus.toLowerCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex gap-2 justify-center">
                            <Button size="icon" variant="outline" onClick={() => openEditModal(book)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => openDeleteDialog(book)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious onClick={() => handlePageChange(Math.max(0, currentPage - 1))} />
                      </PaginationItem>
                      {getPaginationWindow(currentPage, totalPages, 2).map((page, i) => (
                        page === 'ellipsis' ? (
                          <PaginationItem key={`ellipsis-${i}`}>
                            <span className="px-2">...</span>
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={page}>
                            <PaginationLink isActive={page === currentPage} onClick={() => handlePageChange(page as number)}>
                              {(page as number) + 1}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      ))}
                      <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </motion.div>
            )}
            {!isLoading && !error && books.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="text-center text-muted-foreground mt-8">
                <p>No books found. Try a different search.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Edit Book Modal */}
      <AnimatePresence>
        {isEditModalOpen && editBook && (
          <EditBookModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            onSubmit={handleEditSubmit}
            book={editBook}
            form={editForm}
          />
        )}
      </AnimatePresence>

      {/* Delete Book Dialog */}
      <AnimatePresence>
        {isDeleteDialogOpen && deleteBook && (
          <ConfirmationModal
            isOpen={isDeleteDialogOpen}
            onCancel={closeDeleteDialog}
            onConfirm={handleDelete}
            title="Confirm Deletion"
            description={`Are you sure you want to delete "${deleteBook?.title}"? This action cannot be undone.`}
            details={deleteBook && (
              <div className="space-y-2 text-sm">
                <div><b>Accession Number:</b> {deleteBook.accessionNumber}</div>
                <div><b>Author:</b> {deleteBook.authorPrimary}</div>
                {/* Add more fields as needed */}
              </div>
            )}
            confirmLabel="Delete"
            confirmVariant="destructive"
            loading={isDeleting}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SharedManageBooks;
