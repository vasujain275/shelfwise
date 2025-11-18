export interface AdminDashboardDTO {
  totalBookCopies: number;
  totalUniqueBooks: number;
  availableBooks: number;
  issuedBooks: number;
  overdueBooks: number;
  lostBooks: number;
  damagedBooks: number;
  booksAddedLast7Days: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  bannedUsers: number;
  newUsersLast30Days: number;
  transactionsLast7Days: number;
  transactionsLast30Days: number;
  bookIssuesLast7Days: Array<Record<string, any>>;
  bookReturnsLast7Days: Array<Record<string, any>>;
  overdueBooksBreakdown: Array<Record<string, any>>;
}

export interface BookTransactionDTO {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userFullName: string;
  transactionType: "ISSUE" | "RETURN" | "RENEW" | "LOST_REPORT" | "DAMAGE_REPORT";
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  renewalCount: number;
  issuedByUserId: string;
  issuedByUserFullName: string;
  returnedToUserId?: string;
  returnedToUserFullName?: string;
  status: "ACTIVE" | "COMPLETED" | "OVERDUE" | "LOST" | "DAMAGED";
  transactionNotes?: string;
}

export interface CustomApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
  pagination?: {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface MemberDashboardDTO {
  borrowedBooksCount: number;
  overdueBooksCount: number;
  overdueBooks: BookTransactionDTO[];
} 