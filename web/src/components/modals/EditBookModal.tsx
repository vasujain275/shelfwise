import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import type { Book } from '@/types/book';
import type { UseFormReturn } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<any>;
  book: Book | null;
  form: UseFormReturn<any>;
}

const bookConditions = ["EXCELLENT", "GOOD", "FAIR", "POOR", "DAMAGED"] as const;
const bookStatuses = ["AVAILABLE", "ISSUED", "LOST", "DAMAGED", "UNDER_REPAIR", "UNAVAILABLE"] as const;
const bookTypes = ["REFERENCE", "GENERAL", "JOURNAL", "MAGAZINE", "THESIS", "REPORT", "TEST", "GIFTED", "OTHER"] as const;

const EditBookModal: React.FC<EditBookModalProps> = ({ isOpen, onClose, onSubmit, book, form }) => {
  if (!book) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-semibold text-gray-900">Edit Book</h2>
                <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Row 1: Accession Number, ISBN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="accessionNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accession Number</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="isbn" render={({ field }) => (
                        <FormItem>
                          <FormLabel>ISBN</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 2: Title, Subtitle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="subtitle" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subtitle</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 3: Primary Author, Secondary Author */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="authorPrimary" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Author</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="authorSecondary" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Author</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 4: Publisher, Publication Place */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="publisher" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publisher</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="publicationPlace" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publication Place</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 5: Publication Year, Edition */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="publicationYear" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publication Year</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="edition" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Edition</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 6: Pages, Language */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="pages" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pages</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="language" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 7: Price, Bill Number */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="billNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bill Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 8: Vendor Name, Purchase Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="vendorName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="purchaseDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 9: Keywords, Classification Number */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="keywords" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Keywords</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="classificationNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Classification Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 10: Location Shelf, Location Rack */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="locationShelf" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Shelf</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="locationRack" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Rack</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 11: Book Condition, Book Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="bookCondition" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Book Condition</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full border rounded px-2 py-2">
                              <option value="">Select Condition</option>
                              {bookConditions.map((cond) => (
                                <option key={cond} value={cond}>{cond}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="bookStatus" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Book Status</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full border rounded px-2 py-2">
                              <option value="">Select Status</option>
                              {bookStatuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 13: Book Type, Reference Only */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="bookType" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Book Type</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full border rounded px-2 py-2">
                              <option value="">Select Type</option>
                              {bookTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="isReferenceOnly" render={({ field }) => (
                        <FormItem className="flex flex-col justify-center h-full">
                          <FormLabel>Reference Only</FormLabel>
                          <FormControl>
                            <input type="checkbox" checked={!!field.value} onChange={e => field.onChange(e.target.checked)} className="w-5 h-5" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    {/* Row 14: Notes */}
                    <div className="grid grid-cols-1 gap-6">
                      <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditBookModal; 