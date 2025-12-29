import ConfirmationModal from "@/components/modals/ConfirmationModal";
import EditBookModal from "@/components/modals/EditBookModal";
import type { Column } from "@/components/shared";
import {
  DataTable,
  ErrorState,
  PageHeader,
  SearchInput,
  StatusBadge,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import type { BookSearchResponse, Book as BookType } from "@/types/book";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Book, Edit, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// --- Book Form Schema (reuse from SharedAddBook) ---
const bookConditions = [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "DAMAGED",
] as const;
const bookStatuses = [
  "AVAILABLE",
  "ISSUED",
  "LOST",
  "DAMAGED",
  "UNDER_REPAIR",
  "UNAVAILABLE",
] as const;
const bookTypes = [
  "REFERENCE",
  "GENERAL",
  "JOURNAL",
  "MAGAZINE",
  "THESIS",
  "REPORT",
  "TEST",
  "GIFTED",
  "OTHER",
] as const;
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
  const [books, setBooks] = useState<BookType[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editBook, setEditBook] = useState<BookType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteBook, setDeleteBook] = useState<BookType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Only admin and super admin can access
  if (user?.userRole !== "ADMIN" && user?.userRole !== "SUPER_ADMIN") {
    return (
      <div className="max-w-2xl mx-auto my-12 p-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 w-12 h-12 text-red-500" />
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Access Denied
            </h2>
            <p className="text-red-600">
              Only Admins and Super Admins can access the Manage Books page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Fetch Books ---
  const fetchBooks = useCallback(
    async (page: number) => {
      setIsLoading(true);
      setError(null);
      try {
        let url;
        if (query && query.trim() !== "") {
          url = `/api/books/search?query=${encodeURIComponent(
            query
          )}&page=${page}&size=10`;
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
    },
    [query]
  );

  useEffect(() => {
    fetchBooks(0);
  }, [fetchBooks]);

  const handlePageChange = (page: number) => {
    fetchBooks(page);
  };

  // --- Edit Book Modal Logic ---
  const editForm = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {},
  });

  const openEditModal = (book: BookType) => {
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
        purchaseDate: values.purchaseDate
          ? format(new Date(values.purchaseDate), "yyyy-MM-dd")
          : undefined,
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
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update book.";
      toast.error(message);
    }
  };

  // --- Delete Book Dialog Logic ---
  const openDeleteDialog = (book: BookType) => {
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
      const response = await fetch(`/api/books/${deleteBook.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete book.");
      }
      toast.success("Book deleted successfully!");
      closeDeleteDialog();
      fetchBooks(currentPage);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete book.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns definition
  const columns: Column<BookType>[] = [
    {
      key: "accessionNumber",
      header: "Accession #",
      mobileLabel: "Accession",
      className: "font-mono",
    },
    {
      key: "title",
      header: "Title",
      className: "font-medium max-w-[200px] truncate",
    },
    {
      key: "authorPrimary",
      header: "Author",
      hideOnMobile: true,
      className: "max-w-[150px] truncate",
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
      key: "bookStatus",
      header: "Status",
      render: (book) => <StatusBadge status={book.bookStatus} size="sm" />,
    },
  ];

  // Mobile card render
  const renderMobileCard = (book: BookType, actions?: React.ReactNode) => (
    <Card className="hover:shadow-md transition-shadow">
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
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-muted-foreground">
            {book.accessionNumber}
          </span>
          <div className="flex gap-1">{actions}</div>
        </div>
      </CardContent>
    </Card>
  );

  // --- Render ---
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Manage Books"
        description="View, edit, and delete books in the library"
        icon={Book}
      />

      <div className="max-w-md">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by title, author, or ISBN..."
        />
      </div>

      {error && (
        <ErrorState message={error} onRetry={() => fetchBooks(currentPage)} />
      )}

      {!error && (
        <DataTable
          data={books}
          columns={columns}
          keyExtractor={(book) => book.id}
          isLoading={isLoading}
          emptyTitle="No books found"
          emptyMessage="No books found. Try a different search term."
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          mobileCardRender={renderMobileCard}
          actions={(book) => (
            <>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() => openEditModal(book)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8"
                onClick={() => openDeleteDialog(book)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        />
      )}

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
            details={
              deleteBook && (
                <div className="space-y-2 text-sm">
                  <div>
                    <b>Accession Number:</b> {deleteBook.accessionNumber}
                  </div>
                  <div>
                    <b>Author:</b> {deleteBook.authorPrimary}
                  </div>
                </div>
              )
            }
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
