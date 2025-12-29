import { Modal } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/types/book";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  DollarSign,
  FileText,
  Hash,
  MapPin,
  Tag,
  User,
} from "lucide-react";
import React from "react";

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
}) => {
  if (!book) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800 border-green-200";
      case "ISSUED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "LOST":
        return "bg-red-100 text-red-800 border-red-200";
      case "DAMAGED":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "UNDER_REPAIR":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "EXCELLENT":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "GOOD":
        return "bg-green-100 text-green-800 border-green-200";
      case "FAIR":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "POOR":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "DAMAGED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Details"
      subtitle="Complete information about this book"
      size="xl"
      showBackButton
    >
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h1>
        {book.subtitle && (
          <p className="text-lg text-gray-600 mb-3">{book.subtitle}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(book.bookStatus)}>
            {book.bookStatus.replace("_", " ")}
          </Badge>
          <Badge className={getConditionColor(book.bookCondition)}>
            {book.bookCondition}
          </Badge>
          <Badge variant="outline">{book.bookType}</Badge>
          {book.isReferenceOnly && (
            <Badge variant="secondary">Reference Only</Badge>
          )}
        </div>
      </motion.div>

      {/* Main Info Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
      >
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Primary Author
              </p>
              <p className="text-gray-900">{book.authorPrimary}</p>
              {book.authorSecondary && (
                <p className="text-sm text-gray-600 mt-1">
                  Secondary: {book.authorSecondary}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Publication Year
              </p>
              <p className="text-gray-900">{book.publicationYear}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Publisher & Place
              </p>
              <p className="text-gray-900">{book.publisher}</p>
              <p className="text-sm text-gray-600">{book.publicationPlace}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Hash className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">ISBN</p>
              <p className="text-gray-900 font-mono">{book.isbn}</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-indigo-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Edition & Pages
              </p>
              <p className="text-gray-900">{book.edition} Edition</p>
              <p className="text-sm text-gray-600">{book.pages}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Price</p>
              <p className="text-gray-900">₹{book.price}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Tag className="h-5 w-5 text-pink-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Language</p>
              <p className="text-gray-900">{book.language}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-teal-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Copies</p>
              <p className="text-gray-900">
                {book.availableCopies} of {book.totalCopies} available
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Classification Number
            </p>
            <p className="text-gray-900 font-mono">
              {book.classificationNumber}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Accession Number
            </p>
            <p className="text-gray-900 font-mono">{book.accessionNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
            <p className="text-gray-900">
              Rack: {book.locationRack} | Shelf: {book.locationShelf}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Purchase Date
            </p>
            <p className="text-gray-900">
              {new Date(book.purchaseDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {book.keywords && (
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Keywords</p>
            <div className="flex flex-wrap gap-1">
              {book.keywords.split(",").map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {book.notes && (
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Notes</p>
            <p className="text-gray-900 text-sm">{book.notes}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Vendor</p>
            <p className="text-gray-900">{book.vendorName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Bill Number
            </p>
            <p className="text-gray-900 font-mono">{book.billNumber}</p>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

export default BookDetailModal;
