import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Search,
  Book as BookIcon,
  CheckCircle,
  ArrowLeft,
  ClipboardList,
  Send,
  X,
} from 'lucide-react';
import type { Transaction } from '@/types/transaction';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import ConfirmationModal from '@/components/modals/ConfirmationModal';

type TransactionWithAccession = Transaction & { accessionNumber?: string };

const SharedReturnBook: React.FC = () => {
  // Search states
  const [transactionQuery, setTransactionQuery] = useState('');
  const [searchedTransactions, setSearchedTransactions] = useState<TransactionWithAccession[]>([]);

  // Selection states
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithAccession | null>(null);
  const [transactionNotes, setTransactionNotes] = useState('');

  // Loading states
  const [isLoadingTransactions] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [returnedTransaction, setReturnedTransaction] = useState<TransactionWithAccession | null>(null);

  // Confirmation modal states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<TransactionWithAccession | null>(null);

  // Debounced search for transactions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (transactionQuery.trim()) {
        searchTransactions();
      } else {
        setSearchedTransactions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [transactionQuery]);

  const searchTransactions = useCallback(async () => {
    if (!transactionQuery.trim()) return;
    // setIsLoadingTransactions(true); // Uncomment if you want to show loading
    try {
      const response = await fetch(
        `/api/transactions/search?query=${encodeURIComponent(transactionQuery)}&page=0&size=10&sortBy=issueDate&sortDir=DESC`
      );
      const result = await response.json();
      setSearchedTransactions(
        result.data.filter(
          (transaction: TransactionWithAccession) =>
            (transaction.status === 'ACTIVE' || transaction.status === 'OVERDUE')
        )
      );
    } catch (error) {
      toast.error('Failed to search for transactions.');
      setSearchedTransactions([]);
    } finally {
      // setIsLoadingTransactions(false); // Uncomment if you want to show loading
    }
  }, [transactionQuery]);

  // useEffect(() => {
  //   // When search results change, fetch accession numbers for all bookIds
  //   searchedTransactions.forEach((t) => {
  //     if (t.bookId && !bookAccessionMap[t.bookId]) {
  //       fetchAccessionNumber(t.bookId);
  //     }
  //   });
  // }, [searchedTransactions, bookAccessionMap, fetchAccessionNumber]);

  const handleTransactionSelect = (transaction: TransactionWithAccession) => {
    setSelectedTransaction(transaction);
  };

  const handleConfirmReturn = () => {
    if (!selectedTransaction) return;
    setPendingTransaction(selectedTransaction);
    setIsConfirmOpen(true);
  };
  const handleReturnConfirmed = async () => {
    if (!pendingTransaction) return;
    setIsReturning(true);
    try {
      const response = await fetch('/api/transactions/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: pendingTransaction.id,
          transactionNotes: transactionNotes,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setReturnedTransaction(result.data);
        setIsSuccess(true);
        toast.success('Book returned successfully!', {
          description: `"${pendingTransaction.bookTitle}" has been returned by ${pendingTransaction.userFullName}.`,
        });
      } else {
        const errorData = await response.json();
        toast.error(`Failed to return book: ${errorData.message}`);
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsReturning(false);
      setIsConfirmOpen(false);
      setPendingTransaction(null);
    }
  };

  const handleReturnAnother = () => {
    setIsSuccess(false);
    setReturnedTransaction(null);
    setSelectedTransaction(null);
    setTransactionQuery('');
    setTransactionNotes('');
    setSearchedTransactions([]);
  };

  const isConfirmationReady = useMemo(() => selectedTransaction !== null, [selectedTransaction]);

  // Success state UI
  if (isSuccess && returnedTransaction) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-4 md:p-6"
      >
        <Card className="overflow-hidden border-green-200 bg-green-50/50">
          <CardContent className="p-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-green-800">Book Returned Successfully!</h2>
                <p className="text-green-600">The book has been marked as returned.</p>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-green-200 max-w-md mx-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <BookIcon className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-lg">{returnedTransaction.bookTitle}</h3>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Returned
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Returned by:</span>
                    <span className="font-medium">{returnedTransaction.userFullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issue Date:</span>
                    <span className="font-medium">{format(new Date(returnedTransaction.issueDate), 'PPP')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Return Date:</span>
                    <span className="font-medium">{format(new Date(returnedTransaction.returnDate!), 'PPP')}</span>
                  </div>
                  {returnedTransaction.transactionNotes && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Notes:</span>
                      <span className="font-medium">{returnedTransaction.transactionNotes}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Button
                  onClick={handleReturnAnother}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return Another Book
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto p-4 md:p-6"
    >
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <BookIcon className="mr-3 h-6 w-6 text-primary" />
            Return a Book
          </CardTitle>
          <CardDescription>
            Search for an active transaction and mark the book as returned.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-1 gap-8"
          >
            {/* Transaction Search */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5 text-primary" />
                  Find an Active Transaction
                </h3>
                {selectedTransaction && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Selected
                  </Badge>
                )}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by book title, user name, transaction ID, or accession number..."
                  value={transactionQuery}
                  onChange={(e) => setTransactionQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {transactionQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setTransactionQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <AnimatePresence>
                {isLoadingTransactions && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center p-4"
                  >
                    <Loader2 className="animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                <AnimatePresence>
                  {searchedTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleTransactionSelect(transaction)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-all relative",
                        selectedTransaction?.id === transaction.id
                          ? 'bg-green-50 border-green-300 shadow-md'
                          : 'hover:bg-muted/50 border-border'
                      )}
                    >
                      {selectedTransaction?.id === transaction.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      <p className="font-semibold">
                        {transaction.bookTitle}
                        {transaction.accessionNumber && (
                          <span className="text-xs text-muted-foreground font-mono"> (Accession: {transaction.accessionNumber})</span>
                        )}
                      </p>
                      <p className="text-sm opacity-80">Issued to: {transaction.userFullName}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          Status: {transaction.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Due: {format(new Date(transaction.dueDate), 'PPP')}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Confirmation Section */}
          <AnimatePresence>
            {isConfirmationReady && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="border-t pt-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-6"
                >
                  <h3 className="font-semibold text-xl mb-2">Confirm Book Return</h3>
                  <p className="text-muted-foreground">Review the details before completing the return</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 text-center mb-8"
                >
                  {/* Selected Transaction Details */}
                  <motion.div
                    layoutId={`transaction-${selectedTransaction?.id}`}
                    className="p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 w-full lg:w-96 shadow-sm"
                  >
                    <ClipboardList className="mx-auto h-12 w-12 mb-4 text-blue-600" />
                    <p className="font-bold text-lg mb-2">{selectedTransaction?.bookTitle}</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Issued to: {selectedTransaction?.userFullName}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Issue Date:</span>
                        <span className="font-medium">
                          {selectedTransaction?.issueDate ? format(new Date(selectedTransaction.issueDate), 'PPP') : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span className="font-medium">
                          {selectedTransaction?.dueDate ? format(new Date(selectedTransaction.dueDate), 'PPP') : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge
                          variant={selectedTransaction?.status === 'OVERDUE' ? 'destructive' : 'default'}
                          className="text-xs"
                        >
                          {selectedTransaction?.status}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto space-y-4"
                >
                  {/* Transaction Notes */}
                  <Input
                    placeholder="Add notes (e.g., book condition, remarks)"
                    value={transactionNotes}
                    onChange={(e) => setTransactionNotes(e.target.value)}
                    className="h-12"
                  />

                  <Button
                    onClick={handleConfirmReturn}
                    disabled={isReturning}
                    size="lg"
                    className="w-full h-12 bg-green-600 hover:bg-green-700"
                  >
                    {isReturning ? (
                      <>
                        <Loader2 className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2" />
                        Confirm Return
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleReturnConfirmed}
        title="Confirm Book Return"
        description="Are you sure you want to return this book?"
        details={pendingTransaction && (
          <div className="space-y-2 text-sm">
            <div><b>Book:</b> {pendingTransaction.bookTitle}</div>
            <div><b>User:</b> {pendingTransaction.userFullName}</div>
            <div><b>Issue Date:</b> {pendingTransaction.issueDate && new Date(pendingTransaction.issueDate).toLocaleDateString()}</div>
            <div><b>Due Date:</b> {pendingTransaction.dueDate && new Date(pendingTransaction.dueDate).toLocaleDateString()}</div>
            {/* Add more fields as needed */}
          </div>
        )}
        confirmLabel="Return Book"
        cancelLabel="Cancel"
        loading={isReturning}
      />
    </motion.div>
  );
};

export default SharedReturnBook;
