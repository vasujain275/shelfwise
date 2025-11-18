import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Eye, 
  Calendar,
  BookOpen,
  User,
  RefreshCw,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  X,
  Download
} from 'lucide-react';
import type { TransactionResponse } from '@/types/transaction';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { PDFDownloadLink, Font } from '@react-pdf/renderer';
import { BookIssueReceipt } from '@/components/pdf';

// Register fonts for PDF receipts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: '/fonts/Helvetica.ttf', fontWeight: 'normal' },
    { src: '/fonts/Helvetica-Bold.ttf', fontWeight: 'bold' },
  ]
});
Font.register({
  family: 'Noto Sans Devanagari',
  fonts: [
    { src: '/fonts/NotoSansDevanagari.ttf', fontWeight: 'normal' },
    { src: '/fonts/NotoSansDevanagari.ttf', fontWeight: 'bold' },
  ]
});
Font.register({
  family: 'Noto Sans',
  fonts: [
    { src: '/fonts/NotoSans-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/NotoSans-Bold.ttf', fontWeight: 'bold' },
  ]
});
Font.registerHyphenationCallback(word => (word ? [word] : []));

// Extend Transaction type locally
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
};

const SharedAllTransactions: React.FC = () => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Only current page
  const [search, setSearch] = useState('');

  // Add state for loading and fetched book/user details for each transaction
  const [receiptData, setReceiptData] = useState<Record<string, {
    book: any | null;
    user: any | null;
    loading: boolean;
    error: string | null;
  }>>({});

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

  // Fetch transactions for current page and search
  const fetchTransactions = useCallback(async (page: number, query: string) => {
    setIsLoading(true);
    try {
      let url;
      if (query && query.trim() !== "") {
        url = `/api/transactions/search?query=${encodeURIComponent(query)}&page=${page}&size=10&sortBy=issueDate&sortDir=DESC`;
      } else {
        url = `/api/transactions?page=${page}&size=10&sortBy=issueDate&sortDir=DESC`;
      }
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const result: TransactionResponse = await response.json();
      setTransactions(Array.isArray(result.data) ? result.data : []);
      setTotalPages(result.pagination?.totalPages || 1);
      setCurrentPage(result.pagination?.currentPage || 0);
    } catch (err: any) {
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount and when page/search changes
  useEffect(() => {
    fetchTransactions(currentPage, search);
  }, [fetchTransactions, currentPage, search]);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'OVERDUE':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'RENEWED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ISSUE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'RETURN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RENEW':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'LOST_REPORT':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Clock className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'OVERDUE':
        return <AlertTriangle className="h-4 w-4" />;
      case 'RENEWED':
        return <RefreshCw className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const stats = useMemo(() => {
    const total = transactions.length;
    const active = transactions.filter(t => t.status === 'ACTIVE').length;
    const completed = transactions.filter(t => t.status === 'COMPLETED').length;
    const overdue = transactions.filter(t => t.status === 'OVERDUE').length;
    
    return { total, active, completed, overdue };
  }, [transactions]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
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
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  // Helper to fetch book and user details
  const fetchReceiptDetails = async (transaction: Transaction) => {
    setReceiptData(prev => ({
      ...prev,
      [transaction.id]: { book: null, user: null, loading: true, error: null }
    }));
    try {
      const [bookRes, userRes] = await Promise.all([
        fetch(`/api/books/${transaction.bookId}`),
        fetch(`/api/users/${transaction.userId}`)
      ]);
      if (!bookRes.ok) throw new Error('Failed to fetch book details');
      if (!userRes.ok) throw new Error('Failed to fetch user details');
      const bookData = await bookRes.json();
      const userData = await userRes.json();
      setReceiptData(prev => ({
        ...prev,
        [transaction.id]: {
          book: bookData.data,
          user: userData.data,
          loading: false,
          error: null
        }
      }));
    } catch (error: any) {
      setReceiptData(prev => ({
        ...prev,
        [transaction.id]: {
          book: null,
          user: null,
          loading: false,
          error: error.message || 'Failed to fetch details'
        }
      }));
      toast.error('Failed to fetch book/user details for receipt');
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto p-4 md:p-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            All Transactions
          </h1>
          <p className="text-gray-600 mt-2">Manage and view all library transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchTransactions(currentPage, search)}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-3 items-end">
          <Input
            placeholder="Search by book/user/title/ID, accession number, or employee ID..."
            value={search}
            onChange={handleSearch}
            className="w-56"
          />
          {/* isAnyFilterActive && (
            <Button variant="ghost" onClick={clearFilters} className="text-red-600">Clear Filters</Button>
          ) */}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Active</p>
                <p className="text-2xl font-bold text-emerald-900">{stats.active}</p>
              </div>
              <Clock className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Overdue</p>
                <p className="text-2xl font-bold text-orange-900">{stats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transactions Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Transaction History</span>
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin h-8 w-8" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer select-none group"
                        onClick={() => {
                          // if (sortBy === 'bookTitle') setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
                          // setSortBy('bookTitle');
                        }}
                        aria-sort="none"
                      >
                        <span className="inline-flex items-center gap-1">
                          Book
                          {/* {sortBy === 'bookTitle' && (
                            sortDir === 'ASC' ? <ChevronUp className="w-4 h-4 text-blue-600 transition-transform group-hover:-translate-y-0.5" /> : <ChevronDown className="w-4 h-4 text-blue-600 transition-transform group-hover:translate-y-0.5" />
                          )} */}
                        </span>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none group"
                        onClick={() => {
                          // if (sortBy === 'userFullName') setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
                          // setSortBy('userFullName');
                        }}
                        aria-sort="none"
                      >
                        <span className="inline-flex items-center gap-1">
                          User
                          {/* {sortBy === 'userFullName' && (
                            sortDir === 'ASC' ? <ChevronUp className="w-4 h-4 text-blue-600 transition-transform group-hover:-translate-y-0.5" /> : <ChevronDown className="w-4 h-4 text-blue-600 transition-transform group-hover:translate-y-0.5" />
                          )} */}
                        </span>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none group"
                        onClick={() => {
                          // if (sortBy === 'transactionType') setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
                          // setSortBy('transactionType');
                        }}
                        aria-sort="none"
                      >
                        <span className="inline-flex items-center gap-1">
                          Type
                          {/* {sortBy === 'transactionType' && (
                            sortDir === 'ASC' ? <ChevronUp className="w-4 h-4 text-blue-600 transition-transform group-hover:-translate-y-0.5" /> : <ChevronDown className="w-4 h-4 text-blue-600 transition-transform group-hover:translate-y-0.5" />
                          )} */}
                        </span>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none group"
                        onClick={() => {
                          // if (sortBy === 'status') setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
                          // setSortBy('status');
                        }}
                        aria-sort="none"
                      >
                        <span className="inline-flex items-center gap-1">
                          Status
                          {/* {sortBy === 'status' && (
                            sortDir === 'ASC' ? <ChevronUp className="w-4 h-4 text-blue-600 transition-transform group-hover:-translate-y-0.5" /> : <ChevronDown className="w-4 h-4 text-blue-600 transition-transform group-hover:translate-y-0.5" />
                          )} */}
                        </span>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none group"
                        onClick={() => {
                          // if (sortBy === 'issueDate') setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
                          // setSortBy('issueDate');
                        }}
                        aria-sort="none"
                      >
                        <span className="inline-flex items-center gap-1">
                          Issue Date
                          {/* {sortBy === 'issueDate' && (
                            sortDir === 'ASC' ? <ChevronUp className="w-4 h-4 text-blue-600 transition-transform group-hover:-translate-y-0.5" /> : <ChevronDown className="w-4 h-4 text-blue-600 transition-transform group-hover:translate-y-0.5" />
                          )} */}
                        </span>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none group"
                        onClick={() => {
                          // if (sortBy === 'dueDate') setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
                          // setSortBy('dueDate');
                        }}
                        aria-sort="none"
                      >
                        <span className="inline-flex items-center gap-1">
                          Due Date
                          {/* {sortBy === 'dueDate' && (
                            sortDir === 'ASC' ? <ChevronUp className="w-4 h-4 text-blue-600 transition-transform group-hover:-translate-y-0.5" /> : <ChevronDown className="w-4 h-4 text-blue-600 transition-transform group-hover:translate-y-0.5" />
                          )} */}
                        </span>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none group"
                        onClick={() => {
                          // if (sortBy === 'returnDate') setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
                          // setSortBy('returnDate');
                        }}
                        aria-sort="none"
                      >
                        <span className="inline-flex items-center gap-1">
                          Return Date
                          {/* {sortBy === 'returnDate' && (
                            sortDir === 'ASC' ? <ChevronUp className="w-4 h-4 text-blue-600 transition-transform group-hover:-translate-y-0.5" /> : <ChevronDown className="w-4 h-4 text-blue-600 transition-transform group-hover:translate-y-0.5" />
                          )} */}
                        </span>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {transactions.map((transaction, index) => {
                        return (
                          <motion.tr
                            key={transaction.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                <div>
                                  <p className="font-medium text-gray-900">{transaction.bookTitle}</p>
                                  <p className="text-sm text-gray-500">
                                    Accession No: {transaction.accessionNumber || transaction.bookId}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-green-600" />
                                <div>
                                  <p className="font-medium text-gray-900">{transaction.userFullName}</p>
                                  <p className="text-sm text-gray-500">
                                    Employee ID: {transaction.employeeId || transaction.userId}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getTypeColor(transaction.transactionType)}>
                                {transaction.transactionType.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(transaction.status)} flex items-center gap-1 w-fit`}>
                                {getStatusIcon(transaction.status)}
                                {transaction.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>{format(new Date(transaction.issueDate), 'MMM dd, yyyy')}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>{format(new Date(transaction.dueDate), 'MMM dd, yyyy')}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {transaction.returnDate ? (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span>{format(new Date(transaction.returnDate), 'MMM dd, yyyy')}</span>
                                </div>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedTransaction(transaction)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {/* Download Receipt Button - only for ISSUE transactions */}
                                {transaction.transactionType === 'ISSUE' && (
                                  receiptData[transaction.id]?.book && receiptData[transaction.id]?.user ? (
                                    <PDFDownloadLink
                                      document={
                                        <BookIssueReceipt
                                          book={receiptData[transaction.id].book}
                                          user={receiptData[transaction.id].user}
                                          dueDate={new Date(transaction.dueDate)}
                                          transactionId={transaction.id}
                                          issueDate={new Date(transaction.issueDate)}
                                          issuedBy={transaction.issuedByUserFullName}
                                          language={receiptData[transaction.id].book.language}
                                        />
                                      }
                                      fileName={`book-issue-receipt-${receiptData[transaction.id].book.accessionNumber}-${format(new Date(transaction.issueDate), 'yyyy-MM-dd')}.pdf`}
                                    >
                                      {({ loading }) => (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          disabled={loading}
                                        >
                                          {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <Download className="h-4 w-4" />
                                          )}
                                        </Button>
                                      )}
                                    </PDFDownloadLink>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      disabled={receiptData[transaction.id]?.loading}
                                      onClick={() => fetchReceiptDetails(transaction)}
                                    >
                                      {receiptData[transaction.id]?.loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Download className="h-4 w-4" />
                                      )}
                                    </Button>
                                  )
                                )}
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    {/* First Page Button */}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === 0}
                        onClick={e => { e.preventDefault(); if (currentPage !== 0) handlePageChange(0); }}
                        className={currentPage === 0 ? 'pointer-events-none opacity-50' : ''}
                      >
                        First
                      </PaginationLink>
                    </PaginationItem>
                    {/* Jump -10 Pages */}
                    {totalPages > 20 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive={false}
                          onClick={e => { e.preventDefault(); if (currentPage >= 10) handlePageChange(Math.max(0, currentPage - 10)); }}
                          className={currentPage < 10 ? 'pointer-events-none opacity-50' : ''}
                        >
                          -10
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={e => { e.preventDefault(); if (currentPage > 0) handlePageChange(currentPage - 1); }} 
                        className={currentPage === 0 ? 'pointer-events-none opacity-50' : undefined} 
                      />
                    </PaginationItem>
                    {getPaginationWindow(currentPage, totalPages, totalPages > 20 ? 3 : 2).map((page, i) => (
                      page === 'ellipsis' ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                          <span className="px-2">...</span>
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            href="#" 
                            isActive={page === currentPage} 
                            onClick={e => { e.preventDefault(); handlePageChange(page as number); }}
                          >
                            {(page as number) + 1}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={e => { e.preventDefault(); if (currentPage < totalPages - 1) handlePageChange(currentPage + 1); }} 
                        className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : undefined} 
                      />
                    </PaginationItem>
                    {/* Jump +10 Pages */}
                    {totalPages > 20 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive={false}
                          onClick={e => { e.preventDefault(); if (currentPage <= totalPages - 11) handlePageChange(Math.min(totalPages - 1, currentPage + 10)); }}
                          className={currentPage > totalPages - 11 ? 'pointer-events-none opacity-50' : ''}
                        >
                          +10
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    {/* Last Page Button */}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === totalPages - 1}
                        onClick={e => { e.preventDefault(); if (currentPage !== totalPages - 1) handlePageChange(totalPages - 1); }}
                        className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
                      >
                        Last
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Transaction Details</h2>
                  <p className="text-sm text-gray-600">Complete information about this transaction</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTransaction(null)}
                  className="hover:bg-white/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      Book Information
                    </h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Title:</span> {selectedTransaction.bookTitle}</p>
                      <p><span className="font-medium">Accession No:</span> {selectedTransaction.accessionNumber || selectedTransaction.bookId}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="h-5 w-5 text-green-600" />
                      User Information
                    </h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {selectedTransaction.userFullName}</p>
                      <p><span className="font-medium">Employee ID:</span> {selectedTransaction.employeeId || selectedTransaction.userId}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Transaction Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p><span className="font-medium">Transaction ID:</span> {selectedTransaction.id}</p>
                      <p><span className="font-medium">Type:</span> 
                        <Badge className={`${getTypeColor(selectedTransaction.transactionType)} ml-2`}>
                          {selectedTransaction.transactionType.replace('_', ' ')}
                        </Badge>
                      </p>
                      <p><span className="font-medium">Status:</span>
                        <Badge className={`${getStatusColor(selectedTransaction.status)} ml-2 flex items-center gap-1 w-fit`}>
                          {getStatusIcon(selectedTransaction.status)}
                          {selectedTransaction.status}
                        </Badge>
                      </p>
                      <p><span className="font-medium">Renewal Count:</span> {selectedTransaction.renewalCount}</p>
                    </div>
                    <div className="space-y-2">
                      <p><span className="font-medium">Issue Date:</span> {format(new Date(selectedTransaction.issueDate), 'PPP')}</p>
                      <p><span className="font-medium">Due Date:</span> {format(new Date(selectedTransaction.dueDate), 'PPP')}</p>
                      {selectedTransaction.returnDate && (
                        <p><span className="font-medium">Return Date:</span> {format(new Date(selectedTransaction.returnDate), 'PPP')}</p>
                      )}
                      <p><span className="font-medium">Issued By:</span> {selectedTransaction.issuedByUserFullName}</p>
                      {selectedTransaction.returnedToUserFullName && (
                        <p><span className="font-medium">Returned To:</span> {selectedTransaction.returnedToUserFullName}</p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedTransaction.transactionNotes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedTransaction.transactionNotes}</p>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTransaction(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SharedAllTransactions;