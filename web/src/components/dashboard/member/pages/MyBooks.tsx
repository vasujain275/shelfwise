import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import type { BookTransactionDTO, CustomApiResponse } from '@/types/dashboard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MyBooks: React.FC = () => {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'issued' | 'history'>('issued');
  const [issuedTransactions, setIssuedTransactions] = useState<BookTransactionDTO[]>([]);
  const [historyTransactions, setHistoryTransactions] = useState<BookTransactionDTO[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<BookTransactionDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (transaction: BookTransactionDTO) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const fetchIssuedBooks = useCallback(async (page: number) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/transactions/user/${user.id}/active?page=${page}&size=10`);
      if (!response.ok) throw new Error('Failed to fetch issued books');
      const result: CustomApiResponse<BookTransactionDTO[]> = await response.json();
      setIssuedTransactions(result.data);
      setTotalPages(result.pagination?.totalPages || 1);
      setCurrentPage(result.pagination?.currentPage || 0);
    } catch (err) {
      setError('Failed to fetch issued books. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchHistory = useCallback(async (page: number) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/transactions/user/${user.id}/history?page=${page}&size=10`);
      if (!response.ok) throw new Error('Failed to fetch transaction history');
      const result: CustomApiResponse<BookTransactionDTO[]> = await response.json();
      setHistoryTransactions(result.data);
      setTotalPages(result.pagination?.totalPages || 1);
      setCurrentPage(result.pagination?.currentPage || 0);
    } catch (err) {
      setError('Failed to fetch transaction history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (tab === 'issued') {
      fetchIssuedBooks(0);
    } else {
      fetchHistory(0);
    }
  }, [user, tab, fetchIssuedBooks, fetchHistory]);

  const handlePageChange = (page: number) => {
    if (tab === 'issued') {
      fetchIssuedBooks(page);
    } else {
      fetchHistory(page);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OVERDUE': return 'bg-red-100 text-red-800 border-red-200';
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ISSUE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RETURN': return 'bg-green-100 text-green-800 border-green-200';
      case 'RENEW': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'LOST_REPORT': return 'bg-red-100 text-red-800 border-red-200';
      case 'DAMAGE_REPORT': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto p-4 md:p-6">
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            My Books
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={v => setTab(v as 'issued' | 'history')} className="mb-6">
            <TabsList>
              <TabsTrigger value="issued">My Issued Books</TabsTrigger>
              <TabsTrigger value="history">My Transaction History</TabsTrigger>
            </TabsList>
          </Tabs>
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center justify-center my-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Loading...</p>
              </motion.div>
            )}
            {error && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700">{error}</span>
                </div>
              </motion.div>
            )}
            {!isLoading && !error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-lg border overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book Title</TableHead>
                        {tab === 'history' && <TableHead>Type</TableHead>}
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        {tab === 'history' && <TableHead>Return Date</TableHead>}
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(tab === 'issued' ? issuedTransactions : historyTransactions).map((t) => (
                        <TableRow key={t.id} className="cursor-pointer hover:bg-blue-50 transition-colors">
                          <TableCell className="font-medium">{t.bookTitle}</TableCell>
                          {tab === 'history' && <TableCell><Badge className={getTypeColor(t.transactionType)}>{t.transactionType.replace('_', ' ')}</Badge></TableCell>}
                          <TableCell>{formatDate(t.issueDate)}</TableCell>
                          <TableCell>{formatDate(t.dueDate)}</TableCell>
                          {tab === 'history' && <TableCell>{t.returnDate ? formatDate(t.returnDate) : '-'}</TableCell>}
                          <TableCell><Badge className={getStatusColor(t.status)}>{t.status}</Badge></TableCell>
                          <TableCell className="flex gap-2 justify-center">
                            <Button size="icon" variant="outline" onClick={() => openModal(t)}><BookOpen className="w-4 h-4" /></Button>
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
                      {[...Array(totalPages)].map((_, idx) => (
                        <PaginationItem key={idx}>
                          <PaginationLink isActive={idx === currentPage} onClick={() => handlePageChange(idx)}>
                            {idx + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      <AnimatePresence>
        {isModalOpen && selectedTransaction && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeModal}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
                  <Button variant="ghost" size="sm" onClick={closeModal} className="hover:bg-gray-100">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="font-semibold">Book Title:</span> {selectedTransaction.bookTitle}
                    </div>
                    <div>
                      <span className="font-semibold">Transaction Type:</span> {selectedTransaction.transactionType.replace('_', ' ')}
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span> {selectedTransaction.status}
                    </div>
                    <div>
                      <span className="font-semibold">Issue Date:</span> {formatDate(selectedTransaction.issueDate)}
                    </div>
                    <div>
                      <span className="font-semibold">Due Date:</span> {formatDate(selectedTransaction.dueDate)}
                    </div>
                    {selectedTransaction.returnDate && (
                      <div>
                        <span className="font-semibold">Return Date:</span> {formatDate(selectedTransaction.returnDate)}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">Renewal Count:</span> {selectedTransaction.renewalCount}
                    </div>
                    <div>
                      <span className="font-semibold">Issued By:</span> {selectedTransaction.issuedByUserFullName}
                    </div>
                    {selectedTransaction.returnedToUserFullName && (
                      <div>
                        <span className="font-semibold">Returned To:</span> {selectedTransaction.returnedToUserFullName}
                      </div>
                    )}
                    {selectedTransaction.transactionNotes && (
                      <div>
                        <span className="font-semibold">Notes:</span> {selectedTransaction.transactionNotes}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyBooks;
