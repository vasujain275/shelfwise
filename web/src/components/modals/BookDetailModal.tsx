import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, BookOpen, User, Calendar, MapPin, Hash, DollarSign, FileText, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Book } from '@/types/book';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, isOpen, onClose }) => {
  if (!book) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ISSUED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOST':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'DAMAGED':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'UNDER_REPAIR':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'EXCELLENT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'GOOD':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'FAIR':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'POOR':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'DAMAGED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring" as const, damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="hover:bg-white/50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Book Details</h2>
                    <p className="text-sm text-gray-600">Complete information about this book</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="p-6">
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
                        {book.bookStatus.replace('_', ' ')}
                      </Badge>
                      <Badge className={getConditionColor(book.bookCondition)}>
                        {book.bookCondition}
                      </Badge>
                      <Badge variant="outline">
                        {book.bookType}
                      </Badge>
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
                          <p className="text-sm font-medium text-gray-500">Primary Author</p>
                          <p className="text-gray-900">{book.authorPrimary}</p>
                          {book.authorSecondary && (
                            <p className="text-sm text-gray-600 mt-1">Secondary: {book.authorSecondary}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Publication Year</p>
                          <p className="text-gray-900">{book.publicationYear}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Publisher & Place</p>
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
                          <p className="text-sm font-medium text-gray-500">Edition & Pages</p>
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
                          <p className="text-gray-900">{book.availableCopies} of {book.totalCopies} available</p>
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
                        <p className="text-sm font-medium text-gray-500 mb-1">Classification Number</p>
                        <p className="text-gray-900 font-mono">{book.classificationNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Accession Number</p>
                        <p className="text-gray-900 font-mono">{book.accessionNumber}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
                        <p className="text-gray-900">Rack: {book.locationRack} | Shelf: {book.locationShelf}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Purchase Date</p>
                        <p className="text-gray-900">{new Date(book.purchaseDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {book.keywords && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Keywords</p>
                        <div className="flex flex-wrap gap-1">
                          {book.keywords.split(',').map((keyword, index) => (
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
                        <p className="text-sm font-medium text-gray-500 mb-1">Bill Number</p>
                        <p className="text-gray-900 font-mono">{book.billNumber}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookDetailModal; 