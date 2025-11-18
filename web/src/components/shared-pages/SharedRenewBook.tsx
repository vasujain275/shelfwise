import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Search,
  Book as BookIcon,
  CheckCircle,
  ArrowLeft,
  ClipboardList,
  Calendar as CalendarIcon,
  Send,
  X,
} from 'lucide-react';
import type { Transaction } from '@/types/transaction';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import ConfirmationModal from '@/components/modals/ConfirmationModal';

type TransactionWithAccession = Transaction & { accessionNumber?: string };

const SharedRenewBook: React.FC = () => {
  // Search states
  const [transactionQuery, setTransactionQuery] = useState('');
  const [searchedTransactions, setSearchedTransactions] = useState<TransactionWithAccession[]>([]);

  // Selection states
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithAccession | null>(null);
  const [newDueDate, setNewDueDate] = useState<Date | undefined>(undefined);
  const [transactionNotes, setTransactionNotes] = useState('');

  // Loading states
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [renewedTransaction, setRenewedTransaction] = useState<TransactionWithAccession | null>(null);

  // Confirmation modal states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<TransactionWithAccession | null>(null);

  // Debounced search for transactions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (transactionQuery.trim()) {
        searchTransactions();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [transactionQuery]);

  const searchTransactions = useCallback(async () => {
    if (!transactionQuery.trim()) return;
    setIsLoadingTransactions(true);
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
      setIsLoadingTransactions(false);
    }
  }, [transactionQuery]);

  const handleTransactionSelect = (transaction: TransactionWithAccession) => {
    setSelectedTransaction(transaction);
    // Set new due date to current due date + 30 days by default
    const currentDueDate = new Date(transaction.dueDate);
    currentDueDate.setDate(currentDueDate.getDate() + 30);
    setNewDueDate(currentDueDate);
  };

  const handleConfirmRenew = () => {
    if (!selectedTransaction || !newDueDate) return;
    setPendingTransaction(selectedTransaction);
    setIsConfirmOpen(true);
  };
  const handleRenewConfirmed = async () => {
    if (!pendingTransaction || !newDueDate) return;
    setIsRenewing(true);
    try {
      const response = await fetch('/api/transactions/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: pendingTransaction.id,
          newDueDate: format(newDueDate, 'yyyy-MM-dd'),
          transactionNotes: transactionNotes,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setRenewedTransaction(result.data);
        setIsSuccess(true);
        toast.success('Book renewed successfully!', {
          description: `"${pendingTransaction.bookTitle}" has been renewed for ${pendingTransaction.userFullName}.`,
        });
      } else {
        const errorData = await response.json();
        toast.error(`Failed to renew book: ${errorData.message}`);
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsRenewing(false);
      setIsConfirmOpen(false);
      setPendingTransaction(null);
    }
  };

  const handleRenewAnother = () => {
    setIsSuccess(false);
    setRenewedTransaction(null);
    setSelectedTransaction(null);
    setTransactionQuery('');
    setNewDueDate(undefined);
    setTransactionNotes('');
    setSearchedTransactions([]);
  };

  const isConfirmationReady = useMemo(() => selectedTransaction !== null && newDueDate !== undefined, [selectedTransaction, newDueDate]);

  // Success state UI
  if (isSuccess && renewedTransaction) {
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
                <h2 className="text-2xl font-bold text-green-800">Book Renewed Successfully!</h2>
                <p className="text-green-600">The book's due date has been extended.</p>
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
                    <h3 className="font-semibold text-lg">{renewedTransaction.bookTitle}</h3>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Renewed
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Renewed for:</span>
                    <span className="font-medium">{renewedTransaction.userFullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Due Date:</span>
                    <span className="font-medium">{format(new Date(renewedTransaction.dueDate), 'PPP')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Renewal Count:</span>
                    <span className="font-medium">{renewedTransaction.renewalCount}</span>
                  </div>
                  {renewedTransaction.transactionNotes && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Notes:</span>
                      <span className="font-medium">{renewedTransaction.transactionNotes}</span>
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
                  onClick={handleRenewAnother}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Renew Another Book
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
            Renew a Book
          </CardTitle>
          <CardDescription>
            Search for an active transaction and extend its due date.
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
                  placeholder="Search by book title, user name, or transaction ID..."
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
                  <h3 className="font-semibold text-xl mb-2">Confirm Book Renewal</h3>
                  <p className="text-muted-foreground">Review the details before completing the renewal</p>
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
                        <span className="text-muted-foreground">Current Due Date:</span>
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
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Renewal Count:</span>
                        <span className="font-medium">{selectedTransaction?.renewalCount}</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto space-y-4"
                >
                  {/* New Due Date */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !newDueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newDueDate ? format(newDueDate, "PPP") : <span>Select new due date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newDueDate}
                        onSelect={setNewDueDate}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Transaction Notes */}
                  <Input
                    placeholder="Add notes (e.g., reason for renewal)"
                    value={transactionNotes}
                    onChange={(e) => setTransactionNotes(e.target.value)}
                    className="h-12"
                  />

                  <Button
                    onClick={handleConfirmRenew}
                    disabled={isRenewing || !newDueDate}
                    size="lg"
                    className="w-full h-12 bg-green-600 hover:bg-green-700"
                  >
                    {isRenewing ? (
                      <>
                        <Loader2 className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2" />
                        Confirm Renewal
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
        onConfirm={handleRenewConfirmed}
        title="Confirm Book Renewal"
        description="Are you sure you want to renew this book?"
        details={pendingTransaction && (
          <div className="space-y-2 text-sm">
            <div><b>Book:</b> {pendingTransaction.bookTitle}</div>
            <div><b>User:</b> {pendingTransaction.userFullName}</div>
            <div><b>Current Due Date:</b> {pendingTransaction.dueDate && new Date(pendingTransaction.dueDate).toLocaleDateString()}</div>
            <div><b>New Due Date:</b> {newDueDate && newDueDate.toLocaleDateString()}</div>
            {/* Add more fields as needed */}
          </div>
        )}
        confirmLabel="Renew Book"
        cancelLabel="Cancel"
        loading={isRenewing}
      />
    </motion.div>
  );
};

export default SharedRenewBook;
