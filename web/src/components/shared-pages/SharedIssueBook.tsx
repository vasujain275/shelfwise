import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFDownloadLink } from '@react-pdf/renderer';
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
  User, 
  Send, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  CheckCircle, 
  Plus,
  X,
  AlertCircle,
  Download
} from 'lucide-react';
import type { Book } from '@/types/book';
import type { UserProfile as UserType } from '@/types/auth';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { BookIssueReceipt } from '@/components/pdf';
import { Font } from '@react-pdf/renderer';

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
Font.registerHyphenationCallback((word: string) => (word ? [word] : []));
import ConfirmationModal from '@/components/modals/ConfirmationModal';

const SharedIssueBook: React.FC = () => {
  // Search states
  const [bookQuery, setBookQuery] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<UserType[]>([]);
  
  // Selection states
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  
  // Loading states
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [isLoadingActiveBorrows, setIsLoadingActiveBorrows] = useState(false);
  
  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [issuedBook, setIssuedBook] = useState<{ book: Book; user: UserType; dueDate: Date; issueDate: Date; transactionId?: string } | null>(null);
  
  // Active borrows state
  const [activeBorrowsCount, setActiveBorrowsCount] = useState<number | null>(null);
  
  // Dates
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // 1 month ahead
    return date;
  });

  // Confirmation states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);

  // Debounced search for books
  useEffect(() => {
    const timer = setTimeout(() => {
      if (bookQuery.trim()) {
        searchBooks();
      } else {
        setSearchedBooks([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [bookQuery]);

  // Debounced search for users
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userQuery.trim()) {
        searchUsers();
      } else {
        setSearchedUsers([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [userQuery]);

  const searchBooks = useCallback(async () => {
    if (!bookQuery.trim()) return;
    setIsLoadingBooks(true);
    try {
      const response = await fetch(`/api/books/search?query=${encodeURIComponent(bookQuery)}&page=0&size=5&sortBy=title&sortDir=ASC`);
      const result = await response.json();
      setSearchedBooks(result.data.filter((book: Book) => 
        book.bookStatus === 'AVAILABLE' && 
        book.bookType !== 'REFERENCE'
      ));
    } catch (error) {
      toast.error('Failed to search for books.');
      setSearchedBooks([]);
    } finally {
      setIsLoadingBooks(false);
    }
  }, [bookQuery]);

  const searchUsers = useCallback(async () => {
    if (!userQuery.trim()) return;
    setIsLoadingUsers(true);
    try {
      const response = await fetch(`/api/users/search?query=${encodeURIComponent(userQuery)}`);
      const result = await response.json();
      // Filter to only show active users
      const activeUsers = result.data.filter((user: UserType) => user.userStatus === 'ACTIVE');
      setSearchedUsers(activeUsers);
    } catch (error) {
      toast.error('Failed to search for users.');
      setSearchedUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [userQuery]);

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    // Keep search results visible but highlight selected
  };

  const handleUserSelect = async (user: UserType) => {
    setSelectedUser(user);
    setActiveBorrowsCount(null);
    
    // Fetch active borrows count for the selected user
    setIsLoadingActiveBorrows(true);
    try {
      const response = await fetch(`/api/transactions/user/${user.id}/active-borrows`);
      if (response.ok) {
        const result = await response.json();
        setActiveBorrowsCount(result.data);
      } else {
        console.error('Failed to fetch active borrows count');
        setActiveBorrowsCount(0);
      }
    } catch (error) {
      console.error('Error fetching active borrows count:', error);
      setActiveBorrowsCount(0);
    } finally {
      setIsLoadingActiveBorrows(false);
    }
  };

  const handleIssueBook = async () => {
    if (!selectedBook || !selectedUser || !dueDate || !issueDate) {
      toast.error('Please select a book, a user, and set both issue and due dates.');
      return;
    }

    setPendingTransaction({
      book: selectedBook,
      user: selectedUser,
      dueDate,
      issueDate,
    });
    setIsConfirmOpen(true);
  };

  const handleConfirmIssue = async () => {
    if (!pendingTransaction) return;

    setIsIssuing(true);
    try {
      const response = await fetch('/api/transactions/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: pendingTransaction.book.id,
          userId: pendingTransaction.user.id,
          dueDate: format(pendingTransaction.dueDate, 'yyyy-MM-dd'),
          issueDate: format(pendingTransaction.issueDate, 'yyyy-MM-dd'),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const transactionId = result.data?.id || result.id;
        setIssuedBook({ 
          book: pendingTransaction.book, 
          user: pendingTransaction.user, 
          dueDate: pendingTransaction.dueDate,
          issueDate: pendingTransaction.issueDate,
          transactionId 
        });
        setIsSuccess(true);
        toast.success('Book issued successfully!', {
          description: `"${pendingTransaction.book.title}" has been issued to ${pendingTransaction.user.fullName}.`,
        });
      } else {
        const errorData = await response.json();
        toast.error(`Failed to issue book: ${errorData.message}`);
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsIssuing(false);
      setPendingTransaction(null);
      setIsConfirmOpen(false);
    }
  };

  const handleIssueAnother = () => {
    setIsSuccess(false);
    setIssuedBook(null);
    setSelectedBook(null);
    setSelectedUser(null);
    setActiveBorrowsCount(null);
    setBookQuery('');
    setUserQuery('');
    setSearchedBooks([]);
    setSearchedUsers([]);
    setIssueDate(new Date());
    setDueDate(new Date(new Date().setDate(new Date().getDate() + 30)));
  };

  const isConfirmationReady = useMemo(() => selectedBook && selectedUser && issueDate && dueDate, [selectedBook, selectedUser, issueDate, dueDate]);

  // Success state UI
  if (isSuccess && issuedBook) {
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
                <h2 className="text-2xl font-bold text-green-800">Book Issued Successfully!</h2>
                <p className="text-green-600">The transaction has been completed.</p>
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
                    <h3 className="font-semibold text-lg">{issuedBook.book.title}</h3>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Issued
                  </Badge>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Author:</span>
                    <span className="font-medium">{issuedBook.book.authorPrimary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issued to:</span>
                    <span className="font-medium">{issuedBook.user.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issue Date:</span>
                    <span className="font-medium">{format(issuedBook.issueDate, 'PPP')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-medium">{format(issuedBook.dueDate, 'PPP')}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Button
                  onClick={handleIssueAnother}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Issue Another Book
                </Button>
                {issuedBook && (
                  <PDFDownloadLink
                    document={
                      <BookIssueReceipt
                        book={issuedBook.book}
                        user={issuedBook.user}
                        dueDate={issuedBook.dueDate}
                        transactionId={issuedBook.transactionId || `TXN-${Date.now()}`}
                        issueDate={issuedBook.issueDate}
                        language={issuedBook.book.language}
                      />
                    }
                    fileName={`book-issue-receipt-${issuedBook.book.accessionNumber}-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
                  >
                    {({ loading }) => (
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="mr-2 h-4 w-4" />
                        )}
                        {loading ? 'Generating...' : 'Download Receipt'}
                      </Button>
                    )}
                  </PDFDownloadLink>
                )}
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
            Issue a New Book
          </CardTitle>
          <CardDescription>
            Search for a book and a user to complete the transaction. Both book and user must be selected to proceed.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Book Search */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center">
                  <BookIcon className="mr-2 h-5 w-5 text-primary" /> 
                  Find a Book
                </h3>
                {selectedBook && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Selected
                  </Badge>
                )}
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search available books by title, author..." 
                  value={bookQuery} 
                  onChange={(e) => setBookQuery(e.target.value)}
                  className="pl-10 pr-10" 
                />
                {bookQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setBookQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <AnimatePresence>
                {isLoadingBooks && (
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
                  {searchedBooks.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleBookSelect(book)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-all relative",
                        selectedBook?.id === book.id 
                          ? 'bg-green-50 border-green-300 shadow-md' 
                          : 'hover:bg-muted/50 border-border'
                      )}
                    >
                      {selectedBook?.id === book.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      <p className="font-semibold">{book.title} <span className="text-xs text-muted-foreground font-mono">(Accession: {book.accessionNumber})</span></p>
                      <p className="text-sm opacity-80">{book.authorPrimary}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          Available
                        </Badge>
                        {book.isbn && (
                          <span className="text-xs text-muted-foreground">ISBN: {book.isbn}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* User Search */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center">
                  <User className="mr-2 h-5 w-5 text-primary" /> 
                  Find a User
                </h3>
                {selectedUser && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Selected
                  </Badge>
                )}
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search users by name, email..." 
                  value={userQuery} 
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="pl-10 pr-10" 
                />
                {userQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setUserQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <AnimatePresence>
                {isLoadingUsers && (
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
                  {searchedUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleUserSelect(user)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-all relative",
                        selectedUser?.id === user.id 
                          ? 'bg-blue-50 border-blue-300 shadow-md' 
                          : 'hover:bg-muted/50 border-border'
                      )}
                    >
                      {selectedUser?.id === user.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      <p className="font-semibold">{user.fullName}</p>
                      <p className="text-sm opacity-80">{user.email}</p>
                      
                      {selectedUser?.id === user.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-blue-200"
                        >
                          {isLoadingActiveBorrows ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                Active Borrows: {activeBorrowsCount !== null ? activeBorrowsCount : 'Loading...'}
                              </span>
                              {activeBorrowsCount !== null && activeBorrowsCount > 5 && (
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}
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
                  <h3 className="font-semibold text-xl mb-2">Confirm Transaction</h3>
                  <p className="text-muted-foreground">Review the details before completing the transaction</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 text-center mb-8"
                >
                  {/* Selected Book */}
                  <motion.div 
                    layoutId={`book-${selectedBook?.id}`}
                    className="p-6 border rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 w-full lg:w-80 shadow-sm"
                  >
                    <BookIcon className="mx-auto h-12 w-12 mb-4 text-green-600" />
                    <p className="font-bold text-lg mb-2">{selectedBook?.title}</p>
                    <p className="text-sm text-muted-foreground mb-3">{selectedBook?.authorPrimary}</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Ready to Issue
                    </Badge>
                  </motion.div>

                  <motion.div 
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="hidden lg:block"
                  >
                    <ArrowRight className="h-8 w-8 text-muted-foreground" />
                  </motion.div>

                  {/* Selected User */}
                  <motion.div 
                    layoutId={`user-${selectedUser?.id}`}
                    className="p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 w-full lg:w-80 shadow-sm"
                  >
                    <User className="mx-auto h-12 w-12 mb-4 text-blue-600" />
                    <p className="font-bold text-lg mb-2">{selectedUser?.fullName}</p>
                    <p className="text-sm text-muted-foreground mb-3">{selectedUser?.email}</p>
                    {selectedUser && (
                      <div className="space-y-2">
                        <Badge 
                          variant={activeBorrowsCount !== null && activeBorrowsCount > 5 ? "destructive" : "secondary"}
                          className={activeBorrowsCount !== null && activeBorrowsCount > 5 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}
                        >
                          {activeBorrowsCount !== null ? `${activeBorrowsCount} Active Borrow${activeBorrowsCount !== 1 ? 's' : ''}` : 'Loading borrows...'}
                        </Badge>
                        {activeBorrowsCount !== null && activeBorrowsCount > 5 && (
                          <p className="text-xs text-red-600 font-medium">
                            ⚠️ User has many active borrows
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto space-y-4"
                >
                  {/* Issue Date */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !issueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {issueDate ? format(issueDate, "PPP") : <span>Pick an issue date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={issueDate}
                        onSelect={setIssueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Due Date */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                      />
                    </PopoverContent>
                  </Popover>

                  <Button 
                    onClick={handleIssueBook} 
                    disabled={isIssuing || !dueDate || !issueDate} 
                    size="lg" 
                    className="w-full h-12 bg-green-600 hover:bg-green-700"
                  >
                    {isIssuing ? (
                      <>
                        <Loader2 className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2" />
                        Complete Transaction
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
        onCancel={() => {
          setIsConfirmOpen(false);
          setPendingTransaction(null);
        }}
        onConfirm={handleConfirmIssue}
        title="Confirm Book Issue"
        description="Are you sure you want to issue this book to the selected user?"
        details={pendingTransaction && (
          <div className="space-y-2 text-sm">
            <div><b>Book:</b> {pendingTransaction.book?.title}</div>
            <div><b>User:</b> {pendingTransaction.user?.fullName}</div>
            <div><b>Issue Date:</b> {pendingTransaction.issueDate && pendingTransaction.issueDate.toLocaleDateString()}</div>
            <div><b>Due Date:</b> {pendingTransaction.dueDate && pendingTransaction.dueDate.toLocaleDateString()}</div>
            {/* Add more fields as needed */}
          </div>
        )}
        confirmLabel="Issue Book"
        cancelLabel="Cancel"
      />
    </motion.div>
  );
};

export default SharedIssueBook; 